import { useCompleteProfileMutation } from "./use-complete-profile-mutation";
import { useLaunchSiteMutation } from "./use-launch-site-mutation";
import { useOnboardingContextQuery } from "./use-onboarding-context-query";
import { useSelectOnboardingTemplateMutation } from "./use-select-onboarding-template-mutation";

export function useTanstackOnboarding() {
  const contextQuery = useOnboardingContextQuery();
  const selectTemplateMutation = useSelectOnboardingTemplateMutation();
  const completeProfileMutation = useCompleteProfileMutation();
  const launchSiteMutation = useLaunchSiteMutation();

  return {
    contextQuery,
    selectTemplateMutation,
    completeProfileMutation,
    launchSiteMutation,
  };
}
