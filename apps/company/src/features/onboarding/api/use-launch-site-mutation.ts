import type { OnboardingLaunchResponseDto } from "@quarry/api-types/aliases";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { onboardingKeys } from "./onboarding.keys";

export function useLaunchSiteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/onboarding/launch", {
        method: "POST",
        credentials: "include",
      });

      const raw = (await res.json()) as unknown;
      const data = raw as OnboardingLaunchResponseDto;
      if (!res.ok) {
        throw new Error("Failed to launch site");
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
