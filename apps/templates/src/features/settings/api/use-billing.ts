import { billingKeys } from "@shared/hooks/query-keys";
import { apiClient } from "@shared/lib/api-client";
import { useQuery } from "@tanstack/react-query";

interface BillingData {
  billing_status: string | null;
  plan_code: string | null;
  subscription_status: string | null;
  trial_ends_at: string | null;
  current_period_end: string | null;
  canceled_at: string | null;
  stripe_connect_account_id: string | null;
}

interface BillingResponse {
  billing: BillingData | null;
}

export function useBilling() {
  return useQuery({
    queryKey: billingKeys.status(),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/billing");
      if (error || !data) throw new Error("Failed to fetch billing status");
      return data as BillingResponse;
    },
  });
}
