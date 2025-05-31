import { supabase } from "@/lib/supabase/client";

export const StorageService = {
  async uploadFile(tenantId: string, file: File, path: string) {
    const fileName = `${tenantId}/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("company-documents")
      .upload(fileName, file);

    if (error) throw error;
    return data;
  },

  async getDocuments(tenantId: string) {
    const { data, error } = await supabase.storage
      .from("company-documents")
      .list(tenantId);

    if (error) throw error;
    return data;
  },
};
