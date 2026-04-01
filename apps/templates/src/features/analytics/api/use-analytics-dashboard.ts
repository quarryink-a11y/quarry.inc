import { apiClient } from "@shared/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const analyticsKeys = {
  dashboard: (period: number) => ["analytics", "dashboard", period] as const,
} as const;

export function useAnalyticsDashboard(periodDays: number) {
  return useQuery({
    queryKey: analyticsKeys.dashboard(periodDays),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/analytics/dashboard", {
        params: { query: { period: String(periodDays) } },
      });
      if (error || !data) throw new Error("Failed to load analytics");
      return data;
    },
  });
}
