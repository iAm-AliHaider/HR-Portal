import { supabase } from "@/lib/supabase/client";

export const AnnouncementsService = {
  async createAnnouncement(
    tenantId: string,
    payload: {
      title: string;
      content: string;
      target_roles?: string[];
      target_departments?: string[];
    },
  ) {
    const { data, error } = await supabase
      .from("announcements")
      .insert({
        ...payload,
        tenant_id: tenantId,
      })
      .select();

    if (error) throw new Error(error.message);
    return data[0];
  },

  async getRelevantAnnouncements(tenantId: string, userId: string) {
    const { data: user } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    const { data: employee } = await supabase
      .from("employees")
      .select("department")
      .eq("user_id", userId)
      .single();

    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("tenant_id", tenantId)
      .or(
        `target_roles.cs.{${user?.role}},target_departments.cs.{${employee?.department}}`,
      );

    if (error) throw new Error(error.message);
    return data;
  },
};
