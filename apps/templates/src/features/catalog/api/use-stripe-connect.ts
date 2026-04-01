import { stripeConnectKeys } from "@shared/hooks/query-keys";
import { apiClient } from "@shared/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ConnectStatus {
  connected: boolean;
  charges_enabled: boolean;
}

export function useConnectStatus() {
  return useQuery({
    queryKey: stripeConnectKeys.status(),
    queryFn: async () => {
      const { data, error } = await apiClient.GET(
        "/api/billing/connect-status",
      );
      if (error || !data) throw new Error("Failed to fetch connect status");
      return data as ConnectStatus;
    },
  });
}

export function useConnectOnboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (returnUrl: string) => {
      const { data, error } = await apiClient.POST(
        "/api/billing/connect-onboard",
        {
          body: { returnUrl },
        },
      );
      if (error || !data) throw new Error("Failed to start connect onboarding");
      return data as { url: string };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: stripeConnectKeys.status(),
      });
    },
  });
}
