import { useQuery } from "@tanstack/react-query";

import { api } from "@/src/shared/api/client";

// ---------------- assets ----------------

export interface ApiAsset {
  id: string;
  org_id: string;
  name: string;
  category: string | null;
  qr_tag: string;
  building: string | null;
  floor: string | null;
  room: string | null;
  criticality: "low" | "medium" | "high" | "critical";
  status: "operational" | "under_maintenance" | "decommissioned";
  manufacturer: string | null;
  model_number: string | null;
  purchase_date: string | null;
  warranty_until: string | null;
}

export function useAssets(q?: string) {
  return useQuery({
    queryKey: ["assets", q],
    queryFn: () => api.get<ApiAsset[]>("/assets", { q }),
  });
}

// ---------------- SLA rules ----------------

export interface ApiSlaRule {
  id: string;
  category: string;
  priority: "low" | "medium" | "high" | "emergency";
  response_hours: number | null;
  resolution_hours: number | null;
}

export function useSlaRules() {
  return useQuery({
    queryKey: ["sla-rules"],
    queryFn: () => api.get<ApiSlaRule[]>("/sla-rules"),
  });
}

export function upsertSlaRule(body: {
  category: string;
  priority: string;
  response_hours: number;
  resolution_hours: number;
}) {
  return api.put<ApiSlaRule>("/sla-rules", body);
}

// ---------------- preventive maintenance ----------------

export interface ApiPmSchedule {
  id: string;
  asset_id: string | null;
  title: string;
  description: string | null;
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "semi_annual" | "annual";
  assigned_worker_id: string | null;
  next_due: string;
  last_completed_at: string | null;
  is_active: boolean;
}

export function usePmSchedules(dueOnly = false) {
  return useQuery({
    queryKey: ["pm-schedules", dueOnly],
    queryFn: () => api.get<ApiPmSchedule[]>("/pm-schedules", { due_only: dueOnly }),
  });
}

// ---------------- analytics ----------------

export interface AnalyticsOverview {
  total_tickets: number;
  open_tickets: number;
  in_progress: number;
  closed_tickets: number;
  escalated: number;
  sla_breached: number;
  avg_resolution_hours: number | null;
  avg_verification_rating: number | null;
  by_category: { category: string; count: number }[];
  by_status: { status: string; count: number }[];
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics-overview"],
    queryFn: () => api.get<AnalyticsOverview>("/analytics/overview"),
  });
}
