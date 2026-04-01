import type {
  OnboardingSelectTemplateDto,
  OnboardingSelectTemplateResponseDto,
} from "@quarry/api-types/aliases";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { onboardingKeys } from "./onboarding.keys";

export function useSelectOnboardingTemplateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: OnboardingSelectTemplateDto) => {
      const res = await fetch("/api/onboarding/select-template", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = (await res.json()) as unknown;
      const data = raw as OnboardingSelectTemplateResponseDto;
      if (!res.ok) {
        throw new Error("Failed to select onboarding template");
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
