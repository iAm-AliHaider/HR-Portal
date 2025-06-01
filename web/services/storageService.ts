import { supabase } from "../lib/supabase/client";

// File upload configuration
interface FileUploadConfig {
  maxSize: number; // in bytes
  allowedTypes: string[];
  bucket: string;
}

// File metadata interface
interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

// Upload result interface
interface UploadResult {
  success: boolean;
  file?: FileMetadata;
  error?: string;
}

class StorageService {
  private isDevelopment: boolean;

  // Default configurations for different file types
  private configs: Record<string, FileUploadConfig> = {
    documents: {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ["pdf", "doc", "docx", "txt", "rtf"],
      bucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || "hr-documents",
    },
    avatars: {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ["jpg", "jpeg", "png", "gif", "webp"],
      bucket: process.env.NEXT_PUBLIC_AVATARS_BUCKET || "avatars",
    },
    training: {
      maxSize: 50 * 1024 * 1024, // 50MB
      allowedTypes: ["pdf", "doc", "docx", "ppt", "pptx", "mp4", "avi", "mov"],
      bucket: "training-materials",
    },
    compliance: {
      maxSize: 20 * 1024 * 1024, // 20MB
      allowedTypes: ["pdf", "doc", "docx"],
      bucket: "compliance-documents",
    },
    expenses: {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ["jpg", "jpeg", "png", "pdf"],
      bucket: "expense-receipts",
    },
  };

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
  }

  // Validate file before upload
  private validateFile(
    file: File,
    config: FileUploadConfig,
  ): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > config.maxSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${this.formatBytes(config.maxSize)}`,
      };
    }

    // Check file type
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !config.allowedTypes.includes(fileExtension)) {
      return {
        valid: false,
        error: `File type not allowed. Supported types: ${config.allowedTypes.join(", ")}`,
      };
    }

    return { valid: true };
  }

  // Generate unique file path
  private generateFilePath(
    file: File,
    category: string,
    userId?: string,
  ): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

    const basePath = userId ? `${category}/${userId}` : category;
    return `${basePath}/${timestamp}_${randomId}_${sanitizedName}`;
  }

  // Format bytes for human reading
  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Upload single file
  async uploadFile(
    file: File,
    category: keyof typeof this.configs,
    userId?: string,
    customPath?: string,
  ): Promise<UploadResult> {
    try {
      const config = this.configs[category];
      if (!config) {
        return { success: false, error: `Unknown file category: ${category}` };
      }

      // Validate file
      const validation = this.validateFile(file, config);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Development mode - simulate upload
      if (this.isDevelopment) {
        console.log("📁 [DEV] File upload simulation:");
        console.log("File:", file.name);
        console.log("Category:", category);
        console.log("Size:", this.formatBytes(file.size));

        const mockFile: FileMetadata = {
          id: `mock_${Date.now()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          url: `/storage/mock/${category}/${file.name}`,
          uploadedAt: new Date().toISOString(),
          uploadedBy: userId || "unknown",
        };

        return { success: true, file: mockFile };
      }

      // Production mode - actual upload
      const filePath =
        customPath || this.generateFilePath(file, category, userId);

      const { data, error } = await supabase.storage
        .from(config.bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Storage upload error:", error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(config.bucket)
        .getPublicUrl(filePath);

      const fileMetadata: FileMetadata = {
        id: data.path,
        name: file.name,
        size: file.size,
        type: file.type,
        url: urlData.publicUrl,
        uploadedAt: new Date().toISOString(),
        uploadedBy: userId || "unknown",
      };

      console.log("✅ File uploaded successfully:", filePath);
      return { success: true, file: fileMetadata };
    } catch (error) {
      console.error("❌ File upload failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown upload error",
      };
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(
    files: FileList | File[],
    category: keyof typeof this.configs,
    userId?: string,
  ): Promise<{
    uploaded: FileMetadata[];
    failed: Array<{ file: string; error: string }>;
  }> {
    const results = await Promise.allSettled(
      Array.from(files).map((file) => this.uploadFile(file, category, userId)),
    );

    const uploaded: FileMetadata[] = [];
    const failed: Array<{ file: string; error: string }> = [];

    results.forEach((result, index) => {
      const fileName = Array.from(files)[index].name;

      if (
        result.status === "fulfilled" &&
        result.value.success &&
        result.value.file
      ) {
        uploaded.push(result.value.file);
      } else {
        const error =
          result.status === "rejected"
            ? result.reason.message
            : result.value.error || "Unknown error";
        failed.push({ file: fileName, error });
      }
    });

    console.log(
      `📁 Batch upload results: ${uploaded.length} uploaded, ${failed.length} failed`,
    );
    return { uploaded, failed };
  }

  // Delete file
  async deleteFile(
    filePath: string,
    bucket?: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.isDevelopment) {
        console.log("📁 [DEV] File deletion simulation:", filePath);
        return { success: true };
      }

      const targetBucket = bucket || this.configs.documents.bucket;

      const { error } = await supabase.storage
        .from(targetBucket)
        .remove([filePath]);

      if (error) {
        console.error("Storage deletion error:", error);
        return { success: false, error: error.message };
      }

      console.log("✅ File deleted successfully:", filePath);
      return { success: true };
    } catch (error) {
      console.error("❌ File deletion failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown deletion error",
      };
    }
  }

  // List files in a bucket/path
  async listFiles(
    bucket: string,
    path?: string,
    limit: number = 100,
  ): Promise<{ files: any[]; error?: string }> {
    try {
      if (this.isDevelopment) {
        console.log("📁 [DEV] File listing simulation");
        return { files: [] };
      }

      const { data, error } = await supabase.storage.from(bucket).list(path, {
        limit,
        sortBy: { column: "created_at", order: "desc" },
      });

      if (error) {
        console.error("Storage list error:", error);
        return { files: [], error: error.message };
      }

      return { files: data || [] };
    } catch (error) {
      console.error("❌ File listing failed:", error);
      return {
        files: [],
        error: error instanceof Error ? error.message : "Unknown listing error",
      };
    }
  }

  // Get public URL for a file
  getPublicUrl(filePath: string, bucket?: string): string {
    if (this.isDevelopment) {
      return `/storage/mock/${bucket || "documents"}/${filePath}`;
    }

    const targetBucket = bucket || this.configs.documents.bucket;
    const { data } = supabase.storage.from(targetBucket).getPublicUrl(filePath);

    return data.publicUrl;
  }

  // Create signed URL for private files
  async createSignedUrl(
    filePath: string,
    expiresIn: number = 3600,
    bucket?: string,
  ): Promise<{ url?: string; error?: string }> {
    try {
      if (this.isDevelopment) {
        return { url: `/storage/signed/${bucket || "documents"}/${filePath}` };
      }

      const targetBucket = bucket || this.configs.documents.bucket;

      const { data, error } = await supabase.storage
        .from(targetBucket)
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        console.error("Signed URL creation error:", error);
        return { error: error.message };
      }

      return { url: data.signedUrl };
    } catch (error) {
      console.error("❌ Signed URL creation failed:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Quick upload methods for common scenarios
  async uploadAvatar(file: File, userId: string): Promise<UploadResult> {
    return this.uploadFile(file, "avatars", userId);
  }

  async uploadDocument(file: File, userId?: string): Promise<UploadResult> {
    return this.uploadFile(file, "documents", userId);
  }

  async uploadTrainingMaterial(
    file: File,
    courseId: string,
  ): Promise<UploadResult> {
    return this.uploadFile(file, "training", courseId);
  }

  async uploadExpenseReceipt(
    file: File,
    expenseId: string,
  ): Promise<UploadResult> {
    return this.uploadFile(file, "expenses", expenseId);
  }

  async uploadComplianceDocument(
    file: File,
    userId?: string,
  ): Promise<UploadResult> {
    return this.uploadFile(file, "compliance", userId);
  }

  // Utility method to get configuration for a category
  getConfig(category: keyof typeof this.configs) {
    return this.configs[category];
  }

  // Add new file category configuration
  addConfig(category: string, config: FileUploadConfig) {
    this.configs[category] = config;
  }
}

// Export singleton instance
export const storageService = new StorageService();
export default storageService;
