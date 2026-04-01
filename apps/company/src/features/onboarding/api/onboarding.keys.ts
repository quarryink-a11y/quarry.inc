export const onboardingKeys = {
  all: ["onboarding"] as const,
  context: () => [...onboardingKeys.all, "context"] as const,
};
