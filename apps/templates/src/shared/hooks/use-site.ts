import { apiClient } from "@shared/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const siteKeys = {
  me: () => ["sites", "me"] as const,
} as const;

export function useSiteMe() {
  return useQuery({
    queryKey: siteKeys.me(),
    queryFn: async () => {
      const { data, error, response } = await apiClient.GET("/api/sites/me");
      if (error || !data || !response.ok) {
        throw new Error("Failed to load site context");
      }
      return data;
    },
  });
}
