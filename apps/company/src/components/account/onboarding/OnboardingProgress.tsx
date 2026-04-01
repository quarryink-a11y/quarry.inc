import { Check } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

import { useOnboarding } from "@/features/onboarding/context";

export function OnboardingProgress() {
  const { api } = useOnboarding();
  const steps = api.contextQuery.data?.navigation?.steps ?? [];

  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {steps.map((step, i) => {
        const isCompleted = step.status === "completed";
        const isCurrent = step.status === "current";
        return (
          <Fragment key={step.key}>
            {i > 0 && (
              <div
                className={`w-8 h-px ${isCompleted ? "bg-blue-500" : "bg-gray-200"}`}
              />
            )}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  isCompleted
                    ? "bg-blue-500 text-white"
                    : isCurrent
                      ? "bg-blue-500 text-white ring-4 ring-blue-100"
                      : "bg-gray-200 text-gray-400"
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  isCompleted || isCurrent ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
