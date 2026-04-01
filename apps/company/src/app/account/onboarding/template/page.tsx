// STATUS: in-progress
// DESCRIPTION: Основная логика выбора шаблона и отображения сетки шаблонов готова, но нужно решить ошибки типизации
"use client";

import type { OnboardingTemplate } from "@quarry/api-types/aliases";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

import { TemplateCard } from "@/components/account/onboarding/TemplateCard";
import { TemplatePreviewModal } from "@/components/account/onboarding/TemplatePreviewModal";
import { useOnboarding } from "@/features/onboarding/context";
import { cn } from "@/lib/utils";

export default function TemplatePage() {
  const { data, updateData, goNext, api } = useOnboarding();
  const { contextQuery, selectTemplateMutation } = api;
  const templates = contextQuery.data?.availableTemplates ?? [];
  const isLoadingTemplates = contextQuery.isLoading;

  const [previewTemplate, setPreviewTemplate] =
    useState<OnboardingTemplate | null>(null);
  const selectedId = data.selectedTemplateId;

  function handleSelect(templateId: string | null) {
    updateData({ selectedTemplateId: templateId });
  }

  async function handleContinue() {
    if (!selectedId) return;
    await selectTemplateMutation.mutateAsync({
      onboardingTemplateId: selectedId,
    });
    goNext();
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Choose your website template
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Pick a design that fits your style. You can customize everything
            later.
          </p>
        </div>

        {/* Templates grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 pb-24">
          {isLoadingTemplates ? (
            <div className="col-span-3 flex justify-center py-12">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ) : (
            templates.map((t: OnboardingTemplate) => (
              <TemplateCard
                key={t.id}
                template={t}
                isSelected={selectedId === t.id}
                onSelect={handleSelect}
                onPreview={setPreviewTemplate}
              />
            ))
          )}

          {/* Coming soon placeholder */}
          <div className="bg-white/50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center aspect-4/5">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-400">Coming soon</p>
              <p className="text-xs text-gray-300 mt-1">
                New templates on the way
              </p>
            </div>
          </div>
        </div>

        {/* Sticky continue bar */}
        {selectedId && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 p-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {templates.find((t) => t.id === selectedId)?.name} selected
                </p>
                <p className="text-xs text-gray-500">
                  Next: Start your free trial
                </p>
              </div>
              <button
                onClick={() => void handleContinue()}
                className={cn(
                  "bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium transition-colors cursor-pointer disabled:bg-gray-400 disabled:hover:bg-gray-400",
                )}
                disabled={!selectedId || selectTemplateMutation.isPending}
              >
                {selectTemplateMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing…
                  </span>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={handleSelect}
        />
      )}
    </>
  );
}
