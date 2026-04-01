import type { OnboardingContext } from "@quarry/api-types/aliases";
import { useQuery } from "@tanstack/react-query";

import { onboardingKeys } from "./onboarding.keys";

export function useOnboardingContextQuery() {
  return useQuery({
    queryKey: onboardingKeys.context(),
    queryFn: async () => {
      const res = await fetch("/api/onboarding/context", {
        method: "GET",
        credentials: "include",
      });

      const data = (await res.json()) as OnboardingContext;

      if (!res.ok) {
        throw new Error("Failed to fetch onboarding context");
      }

      return data;
    },
  });
}
