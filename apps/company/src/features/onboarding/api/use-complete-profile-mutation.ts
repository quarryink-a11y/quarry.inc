import type {
  OnboardingCompleteProfileDto,
  OnboardingCompleteProfileResponseDto,
} from "@quarry/api-types/aliases";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { onboardingKeys } from "./onboarding.keys";

export function useCompleteProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: OnboardingCompleteProfileDto) => {
      const res = await fetch("/api/onboarding/complete-profile", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });

      const data = (await res.json()) as OnboardingCompleteProfileResponseDto;
      if (!res.ok) {
        throw new Error("Failed to complete profile");
      }

      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: onboardingKeys.context(),
      });
    },
  });
}
