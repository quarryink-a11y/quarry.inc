import type {
  BillingCreateSetupIntentDto,
  BillingCreateSetupIntentResponseDto,
} from "@quarry/api-types/aliases";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { stripeBillingKeys } from "./stripe-billing.keys";

export function useMutationSetupIntent() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: BillingCreateSetupIntentDto) => {
      const response = await fetch("/api/stripe-billing/setup-intent", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result =
        (await response.json()) as BillingCreateSetupIntentResponseDto;
      if (!response.ok) {
        throw new Error("Failed to create setup intent");
      }

      return result;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: stripeBillingKeys.setupIntent(),
      });
    },
  });

  return {
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
