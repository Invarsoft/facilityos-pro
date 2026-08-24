import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/src/shared/api/client";

// ---------------- notifications ----------------

export interface ApiNotification {
  id: string;
  user_id: string;
  type: string | null;
  title: string;
  message: string | null;
  ticket_id: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

export function useNotifications(unreadOnly = false) {
  return useQuery({
    queryKey: ["notifications", unreadOnly],
    queryFn: () => api.get<ApiNotification[]>("/notifications", { unread_only: unreadOnly }),
    refetchInterval: 30_000,
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/notifications/${id}/read`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post("/notifications/read-all"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

// ---------------- audit logs ----------------

export interface ApiAuditLog {
  id: string;
  actor_id: string | null;
  actor_name: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  changes: Record<string, { old: unknown; new: unknown }> | null;
  created_at: string;
}

export function useAuditLogs(entityType?: string) {
  return useQuery({
    queryKey: ["audit-logs", entityType],
    queryFn: () => api.get<ApiAuditLog[]>("/audit-logs", { entity_type: entityType }),
  });
}
