import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/src/shared/api/client";

export type TicketStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "awaiting_verification"
  | "closed"
  | "reopened"
  | "escalated";

export interface ApiTicket {
  id: string;
  org_id: string;
  ticket_number: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "emergency";
  status: TicketStatus;
  requester_id: string;
  assignee_id: string | null;
  location: string | null;
  room: string | null;
  photos: string[];
  progress: number | null;
  is_emergency: boolean;
  escalated: boolean;
  reopen_count: number | null;
  sla_response_due: string | null;
  sla_resolution_due: string | null;
  first_response_at: string | null;
  sla_response_breached: boolean;
  sla_resolution_breached: boolean
  assigned_at: string | null;
  resolved_at: string | null;
  closed_at: string | null;
  verification_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface TicketEvent {
  id: string;
  actor_id: string | null;
  actor_name: string | null;
  event_type: string;
  message: string;
  created_at: string;
}

export interface TicketComment {
  id: string;
  ticket_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface WorkerRecommendation {
  worker_id: string;
  full_name: string;
  skills: string[];
  rating: number | null;
  active_load: number | null;
  completed_jobs: number | null;
  match_score: number;
  reasons: string[];
}

const invalidateTickets = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ["tickets"] });
  qc.invalidateQueries({ queryKey: ["notifications"] });
};

export function useTickets(filters: {
  status?: string;
  category?: string;
  mine?: boolean;
  q?: string;
}) {
  return useQuery({
    queryKey: ["tickets", filters],
    queryFn: () =>
      api.get<ApiTicket[]>("/tickets", {
        status: filters.status,
        category: filters.category,
        mine: filters.mine,
        q: filters.q,
      }),
  });
}

export function useTicket(ticketId: string) {
  return useQuery({
    queryKey: ["tickets", ticketId],
    queryFn: () => api.get<ApiTicket>(`/tickets/${ticketId}`),
    enabled: Boolean(ticketId),
  });
}

export function useTicketEvents(ticketId: string) {
  return useQuery({
    queryKey: ["tickets", ticketId, "events"],
    queryFn: () => api.get<TicketEvent[]>(`/tickets/${ticketId}/events`),
    enabled: Boolean(ticketId),
  });
}

export function useTicketComments(ticketId: string) {
  return useQuery({
    queryKey: ["tickets", ticketId, "comments"],
    queryFn: () => api.get<TicketComment[]>(`/tickets/${ticketId}/comments`),
    enabled: Boolean(ticketId),
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      title: string;
      description: string;
      category: string;
      priority: string;
      location?: string;
      room?: string;
      photos?: string[];
    }) => api.post<ApiTicket>("/tickets", body),
    onSuccess: () => invalidateTickets(qc),
  });
}

export function useAssignWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, workerId }: { ticketId: string; workerId: string }) =>
      api.post<ApiTicket>(`/tickets/${ticketId}/assign`, { worker_id: workerId }),
    onSuccess: () => invalidateTickets(qc),
  });
}

export function useUpdateProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      ticketId,
      progress,
      note,
    }: {
      ticketId: string;
      progress: number;
      note?: string;
    }) =>
      api.post<ApiTicket>(`/tickets/${ticketId}/progress`, {
        progress,
        note,
        photos: [],
      }),
    onSuccess: () => invalidateTickets(qc),
  });
}

export function useCompleteWork() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: string) =>
      api.post<{ detail: string; ticket: ApiTicket }>(
        `/tickets/${ticketId}/complete`,
        {},
      ),
    onSuccess: () => invalidateTickets(qc),
  });
}

export function useVerifyTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      ticketId,
      otpCode,
      rating,
      feedback,
    }: {
      ticketId: string;
      otpCode: string;
      rating: number;
      feedback?: string;
    }) =>
      api.post<ApiTicket>(`/tickets/${ticketId}/verify`, {
        otp_code: otpCode,
        rating,
        feedback,
      }),
    onSuccess: () => invalidateTickets(qc),
  });
}

export function useReopenTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, reason }: { ticketId: string; reason: string }) =>
      api.post<ApiTicket>(`/tickets/${ticketId}/reopen`, { reason }),
    onSuccess: () => invalidateTickets(qc),
  });
}

export function useEscalateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, reason }: { ticketId: string; reason: string }) =>
      api.post<ApiTicket>(`/tickets/${ticketId}/escalate`, { reason }),
    onSuccess: () => invalidateTickets(qc),
  });
}

export function useRecommendWorkers(category: string, enabled = false) {
  return useQuery({
    queryKey: ["recommend-workers", category],
    queryFn: () =>
      api.get<WorkerRecommendation[]>("/tickets/recommend-workers", { category }),
    enabled: enabled && Boolean(category),
  });
}

export function useTriggerEmergency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      title: string;
      description: string;
      category: string;
      location?: string;
      room?: string;
    }) => api.post<ApiTicket>("/tickets/emergency", body),
    onSuccess: () => invalidateTickets(qc),
  });
}
