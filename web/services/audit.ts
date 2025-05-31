import { supabase } from "@/lib/supabase/client";

export const AuditService = {
  async logAction(
    tenantId: string | null,
    userId: string,
    action: {
      type: string;
      targetId?: string;
      targetType?: string;
      details?: Record<string, unknown>;
    },
  ) {
    const { error } = await supabase.from("audit_logs").insert({
      tenant_id: tenantId,
      user_id: userId,
      action_type: action.type,
      target_id: action.targetId,
      target_type: action.targetType,
      details: action.details,
    });

    if (error) console.error("Audit log failed:", error);
  },
};

// Example usage in a component:
// AuditService.logAction(tenantId, userId, {
//   type: 'user_login',
//   details: { method: 'google' }
// })
