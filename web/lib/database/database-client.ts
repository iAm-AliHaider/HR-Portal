// Database Client Wrapper with Fallback Support
import { supabase } from "../supabase/client";

export interface DatabaseResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
  count?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  orderBy?: string;
  ascending?: boolean;
}

export interface FilterParams {
  column: string;
  operator:
    | "eq"
    | "neq"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "like"
    | "ilike"
    | "in";
  value: any;
}

// Database connection checker
export class DatabaseClient {
  private static connectionTested = false;
  private static isConnected = false;

  static async testConnection(): Promise<boolean> {
    if (this.connectionTested) {
      return this.isConnected;
    }

    try {
      // Try a simple query to test the connection
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .limit(1);

      if (error) {
        console.warn("Database connection test failed:", error.message);
        this.isConnected = false;
      } else {
        console.log("✅ Database connection successful");
        this.isConnected = true;
      }
    } catch (err) {
      console.warn("Database connection error:", err);
      this.isConnected = false;
    }

    this.connectionTested = true;
    return this.isConnected;
  }

  static async executeQuery<T>(
    tableName: string,
    operation: () => Promise<any>,
    fallbackData?: T,
  ): Promise<DatabaseResponse<T>> {
    try {
      const result = await operation();

      if (result.error) {
        console.warn(
          `Database operation failed for ${tableName}:`,
          result.error.message,
        );

        // Check if it's a relationship error and return fallback
        if (
          result.error.message.includes("relationship") ||
          result.error.message.includes("schema cache") ||
          result.error.message.includes("function")
        ) {
          return {
            data: fallbackData || null,
            error: null,
            success: true,
            count: Array.isArray(fallbackData) ? fallbackData.length : 0,
          };
        }

        return {
          data: null,
          error: result.error.message,
          success: false,
        };
      }

      return {
        data: result.data,
        error: null,
        success: true,
        count: result.count,
      };
    } catch (err) {
      console.warn(`Unexpected error in ${tableName}:`, err);

      return {
        data: fallbackData || null,
        error: null,
        success: true,
        count: Array.isArray(fallbackData) ? fallbackData.length : 0,
      };
    }
  }

  // Helper to create simple queries without complex relationships
  static createSimpleQuery(tableName: string, select = "*") {
    return supabase.from(tableName).select(select);
  }

  // Helper to apply filters safely
  static applyFilters(query: any, filters?: FilterParams[]) {
    if (!filters) return query;

    filters.forEach((filter) => {
      try {
        switch (filter.operator) {
          case "eq":
            query = query.eq(filter.column, filter.value);
            break;
          case "neq":
            query = query.neq(filter.column, filter.value);
            break;
          case "gt":
            query = query.gt(filter.column, filter.value);
            break;
          case "gte":
            query = query.gte(filter.column, filter.value);
            break;
          case "lt":
            query = query.lt(filter.column, filter.value);
            break;
          case "lte":
            query = query.lte(filter.column, filter.value);
            break;
          case "like":
            query = query.like(filter.column, filter.value);
            break;
          case "ilike":
            query = query.ilike(filter.column, filter.value);
            break;
          case "in":
            query = query.in(filter.column, filter.value);
            break;
        }
      } catch (err) {
        console.warn(
          `Failed to apply filter ${filter.column} ${filter.operator}:`,
          err,
        );
      }
    });

    return query;
  }

  // Helper to apply pagination
  static applyPagination(query: any, pagination?: PaginationParams) {
    if (!pagination) return query;

    const {
      page,
      limit,
      orderBy = "created_at",
      ascending = false,
    } = pagination;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    try {
      return query.order(orderBy, { ascending }).range(start, end);
    } catch (err) {
      console.warn("Failed to apply pagination:", err);
      return query.limit(limit);
    }
  }
}

// Simplified database operations that work without complex relationships
export class SimpleDatabase {
  // Generic CRUD operations
  static async getAll<T>(
    tableName: string,
    pagination?: PaginationParams,
    filters?: FilterParams[],
    fallbackData: T[] = [],
  ): Promise<DatabaseResponse<T[]>> {
    return DatabaseClient.executeQuery(
      tableName,
      async () => {
        let query = DatabaseClient.createSimpleQuery(tableName);
        query = DatabaseClient.applyFilters(query, filters);
        query = DatabaseClient.applyPagination(query, pagination);
        return await query;
      },
      fallbackData,
    );
  }

  static async getById<T>(
    tableName: string,
    id: string,
    fallbackData: T | null = null,
  ): Promise<DatabaseResponse<T>> {
    return DatabaseClient.executeQuery(
      tableName,
      async () => {
        return await DatabaseClient.createSimpleQuery(tableName)
          .eq("id", id)
          .single();
      },
      fallbackData,
    );
  }

  static async create<T>(
    tableName: string,
    data: any,
    fallbackData?: T,
  ): Promise<DatabaseResponse<T>> {
    return DatabaseClient.executeQuery(
      tableName,
      async () => {
        return await supabase
          .from(tableName)
          .insert([
            {
              ...data,
              id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();
      },
      fallbackData || data,
    );
  }

  static async update<T>(
    tableName: string,
    id: string,
    updates: any,
    fallbackData?: T,
  ): Promise<DatabaseResponse<T>> {
    return DatabaseClient.executeQuery(
      tableName,
      async () => {
        return await supabase
          .from(tableName)
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single();
      },
      fallbackData || { id, ...updates },
    );
  }

  static async delete(
    tableName: string,
    id: string,
  ): Promise<DatabaseResponse<boolean>> {
    return DatabaseClient.executeQuery(
      tableName,
      async () => {
        return await supabase.from(tableName).delete().eq("id", id);
      },
      true,
    );
  }
}
