import { redirect } from "next/navigation";

/**
 * /account/onboarding → redirect to the first step.
 *
 * In a more advanced setup you could check the user's onboarding progress
 * server-side and redirect them to the correct step.
 */
export default function OnboardingIndexPage() {
  redirect("/account/onboarding/template");
}
