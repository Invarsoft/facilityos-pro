import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/src/shared/api/client";

export interface ApiUser {
  id: string;
  org_id: string | null;
  email: string;
  full_name: string;
  phone?: string | null;
  role: "requester" | "worker" | "manager" | "admin" | "super_admin";
  skills: string[];
  experience_years: number | null;
  is_available: boolean;
  active_load: number | null;
  completed_jobs: number | null;
  rating: number | null;
  avatar_url?: string | null;
  is_active: boolean;
}

export function useWorkers(skill?: string) {
  return useQuery({
    queryKey: ["workers", skill],
    queryFn: () => api.get<ApiUser[]>("/users/workers", { skill }),
  });
}

export function useUsers(role?: string, q?: string) {
  return useQuery({
    queryKey: ["users", role, q],
    queryFn: () => api.get<ApiUser[]>("/users", { role, q }),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      email: string;
      password: string;
      full_name: string;
      role: string;
      phone?: string;
      skills?: string[];
    }) => api.post<ApiUser>("/users", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, ...body }: { userId: string } & Record<string, unknown>) =>
      api.patch<ApiUser>(`/users/${userId}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["workers"] });
    },
  });
}
