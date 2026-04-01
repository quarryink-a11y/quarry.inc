import type { components } from "@quarry/api-types";
import { apiClient } from "@shared/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type SiteSettingsUpdateDto = components["schemas"]["UpdateSettingsDto"];

const settingsKey = () => ["site-settings"] as const;

function useInvalidate() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: settingsKey(),
    });
}

function useSiteSettings() {
  return useQuery({
    queryKey: settingsKey(),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/sites/settings");
      if (error || !data) throw new Error("Failed to load site settings");
      return data;
    },
  });
}

function useUpdateSiteSettings() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (updates: Partial<SiteSettingsUpdateDto>) => {
      const { data, error } = await apiClient.PATCH("/api/sites/settings", {
        body: updates,
      });
      if (error || !data) throw new Error("Failed to update site settings");
      return data;
    },
    onSuccess: invalidate,
  });
}

export { settingsKey, useInvalidate, useSiteSettings, useUpdateSiteSettings };
