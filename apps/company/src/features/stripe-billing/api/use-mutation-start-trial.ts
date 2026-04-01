import type {
  BillingStartTrialDto,
  BillingStartTrialResponseDto,
} from "@quarry/api-types/aliases";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { onboardingKeys } from "@/features/onboarding/api/onboarding.keys";
export function useMutationStartTrial() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: BillingStartTrialDto) => {
      const response = await fetch("/api/stripe-billing/start-trial", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as BillingStartTrialResponseDto;
      if (!response.ok) {
        throw new Error("Failed to start trial");
      }
      return result;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: onboardingKeys.context(),
      });
    },
  });
  return {
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
