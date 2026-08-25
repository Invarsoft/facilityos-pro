import { useQuery } from "@tanstack/react-query";

import { api } from "@/src/shared/api/client";

export interface PublicOrganization {
  id: string;
  name: string;
  code: string | null;
  vertical: string | null;
  brand_color: string | null;
  welcome_message: string | null;
}

export function usePublicOrganizations() {
  return useQuery({
    queryKey: ["public-organizations"],
    queryFn: () => api.get<PublicOrganization[]>("/organizations/public"),
    staleTime: 60_000,
  });
}
