"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useTanstackOnboarding } from "@/features/onboarding/api/use-tanstack-onboarding";

export interface OnboardingData {
  selectedTemplateId: string | null;
  stripeClientSecret: string | null;
  profile: Record<string, unknown> | null;
}

interface OnboardingContextValue {
  currentStep: string;
  data: OnboardingData;
  updateData: (patch: Partial<OnboardingData>) => void;
  goNext: () => void;
  goBack: () => void;
  api: ReturnType<typeof useTanstackOnboarding>;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

interface ProviderProps {
  currentStep: string;
  children: ReactNode;
}

export function OnboardingProvider({ currentStep, children }: ProviderProps) {
  const router = useRouter();
  const api = useTanstackOnboarding();

  const navigation = api.contextQuery.data?.navigation;

  // Navigation guard — redirect based on backend navigation state
  useEffect(() => {
    if (!navigation) return;

    // Completed onboarding — always land on "done"
    if (navigation.isCompleted) {
      if (currentStep !== "done") {
        router.replace("/account/onboarding/done");
      }
      return;
    }

    if (currentStep !== navigation.currentStep) {
      router.replace(`/account/onboarding/${navigation.currentStep}`);
    }
  }, [navigation, currentStep, router]);

  const [data, setData] = useState<OnboardingData>({
    selectedTemplateId: null,
    stripeClientSecret: null,
    profile: null,
  });

  const updateData = useCallback(
    (patch: Partial<OnboardingData>) =>
      setData((prev) => ({ ...prev, ...patch })),
    [],
  );

  const goNext = useCallback(() => {
    const next = api.contextQuery.data?.navigation?.nextStep;
    if (next) router.push(`/account/onboarding/${next}`);
  }, [api.contextQuery.data?.navigation?.nextStep, router]);

  const goBack = useCallback(() => {
    const prev = api.contextQuery.data?.navigation?.prevStep;
    if (prev) router.push(`/account/onboarding/${prev}`);
  }, [api.contextQuery.data?.navigation?.prevStep, router]);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      currentStep,
      data,
      updateData,
      goNext,
      goBack,
      api,
    }),
    [currentStep, data, updateData, goNext, goBack, api],
  );

  // Block rendering until navigation is loaded and the step is correct.
  // This prevents a flash of the wrong page before the redirect fires.
  const isLoading = api.contextQuery.isLoading;
  const isWrongStep =
    navigation &&
    (navigation.isCompleted
      ? currentStep !== "done"
      : currentStep !== navigation.currentStep);

  if (isLoading || isWrongStep) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used within <OnboardingProvider>");
  }
  return ctx;
}
