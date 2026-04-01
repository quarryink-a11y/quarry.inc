"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import { OnboardingProgress } from "@/components/account/onboarding/OnboardingProgress";
import { OnboardingProvider } from "@/features/onboarding/context";
import { useAuth } from "@/providers/AuthProvider";

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const segment = useSelectedLayoutSegment();
  const currentStep = segment ?? "template";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      router.replace("/account");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      // DESCRIPTION: Вынести в отдельный компонент, который будет использоваться везде, где нужно показывать загрузку
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
        <p className="text-gray-500 ml-2">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <OnboardingProvider currentStep={currentStep}>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <OnboardingProgress />
        </div>

        {children}
      </div>
    </OnboardingProvider>
  );
}
