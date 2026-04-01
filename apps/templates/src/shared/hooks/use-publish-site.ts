import { apiClient } from "@shared/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { siteKeys } from "./use-site";

export function usePublishSite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await apiClient.POST("/api/sites/publish");
      if (error || !data) throw new Error("Failed to publish");
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: siteKeys.me() });
    },
  });
}
