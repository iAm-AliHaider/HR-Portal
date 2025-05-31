import { supabase } from "@/lib/supabase/client";

export type RequestType = "leave" | "expense" | "asset" | "travel";
export type Status = "draft" | "submitted" | "approved" | "rejected";

export interface Request {
  id: string;
  type: RequestType;
  data: Record<string, unknown>;
  status: Status;
  created_at: string;
}

export const RequestsService = {
  async createRequest(tenantId: string, request: Partial<Request>) {
    const { data, error } = await supabase
      .from("requests")
      .insert({
        ...request,
        tenant_id: tenantId,
        status: "draft",
      })
      .select();

    if (error) throw new Error(error.message);
    return data[0];
  },

  async submitForApproval(requestId: string) {
    const { data, error } = await supabase
      .from("requests")
      .update({ status: "submitted" })
      .eq("id", requestId)
      .select();

    if (error) throw new Error(error.message);
    return data[0];
  },

  async getRequests(tenantId: string, userId: string) {
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("employee_id", userId);

    if (error) throw new Error(error.message);
    return data;
  },
};
