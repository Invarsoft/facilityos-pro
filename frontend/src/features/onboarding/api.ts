import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/src/shared/api/client";

export interface OnboardingRequest {
  id: string;
  org_name: string;
  vertical: string | null;
  contact_name: string | null;
  contact_email: string;
  contact_phone: string | null;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  created_org_id: string | null;
  created_admin_email: string | null;
  created_facility_code: string | null;
}

export interface ApprovalCredentials {
  request_id: string;
  org_id: string;
  org_name: string;
  facility_code: string;
  admin_email: string;
  admin_password: string;
}

export function submitOnboarding(body: {
  org_name: string;
  vertical?: string;
  contact_name?: string;
  contact_email: string;
  contact_phone?: string;
  message?: string;
}) {
  return api.post<OnboardingRequest>("/onboarding", body);
}

export function checkFacilityCode(code: string) {
  return api.get<{ id: string; name: string; vertical: string | null; code: string }>(
    `/organizations/by-code/${encodeURIComponent(code.trim().toUpperCase())}`,
  );
}

export function useOnboardingRequests(status?: string) {
  return useQuery({
    queryKey: ["onboarding-requests", status],
    queryFn: () => api.get<OnboardingRequest[]>("/onboarding", { status }),
    refetchInterval: 30_000,
  });
}

export function useApproveOnboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) =>
      api.post<ApprovalCredentials>(`/onboarding/${requestId}/approve`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["onboarding-requests"] }),
  });
}

export function useRejectOnboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) =>
      api.post<OnboardingRequest>(`/onboarding/${requestId}/reject`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["onboarding-requests"] }),
  });
}
