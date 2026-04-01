export const stripeBillingKeys = {
  all: ["stripe-billing"] as const,
  setupIntent: () => [...stripeBillingKeys.all, "setup-intent"] as const,
  startTrial: () => [...stripeBillingKeys.all, "start-trial"] as const,
};
