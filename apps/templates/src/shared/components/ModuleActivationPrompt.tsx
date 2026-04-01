"use client";

import { Button } from "@shared/components/ui/button";
import { useCompleteModule } from "@shared/hooks/use-complete-module";
import {
  useSiteSettings,
  useUpdateSiteSettings,
} from "@shared/hooks/use-site-settings";
import { CheckCircle2, SkipForward } from "lucide-react";
import { useState } from "react";

import type { SiteSection } from "../constants/enums";

type ModuleConfig = Partial<
  Record<SiteSection, { title: string; description: string; nextPage: string }>
>;
const MODULE_CONFIG: ModuleConfig = {
  DESIGNS: {
    title: "Designs",
    description:
      "Showcase your available tattoo designs that clients can pick and book directly.",
    nextPage: "Dashboard",
  },
  CATALOG: {
    title: "Catalog",
    description:
      "Sell merch, gift certificates, prints, stickers and other products from your store.",
    nextPage: "Dashboard",
  },
  EVENTS: {
    title: "Events",
    description:
      "Share your upcoming guest spots, conventions, and travel dates with clients.",
    nextPage: "Dashboard",
  },
  REVIEWS: {
    title: "Reviews",
    description:
      "Display client testimonials and reviews to build trust with potential clients.",
    nextPage: "Dashboard",
  },
};

interface ModuleActivationPromptProps {
  moduleKey: SiteSection;
  onActivate: () => void;
}

export function ModuleActivationPrompt({
  moduleKey,
  onActivate,
}: ModuleActivationPromptProps) {
  const { data: siteSettings } = useSiteSettings();
  const { completeModule } = useCompleteModule();
  const { mutateAsync: updateSettings } = useUpdateSiteSettings();

  const [skipping, setSkipping] = useState(false);
  const config = MODULE_CONFIG[moduleKey];

  if (!config) return null;

  const handleSkip = async () => {
    setSkipping(true);
    await completeModule(moduleKey);
    const currentSections = (siteSettings?.site_sections ?? {}) as Record<
      string,
      boolean
    >;
    if (currentSections[moduleKey]) {
      await updateSettings({
        site_sections: { ...currentSections, [moduleKey]: false } as never,
      });
    }
    window.location.href = `/admin`;
  };

  const handleActivate = async () => {
    const currentSections = (siteSettings?.site_sections ?? {}) as Record<
      string,
      boolean
    >;
    await updateSettings({
      site_sections: { ...currentSections, [moduleKey]: true } as never,
    });
    onActivate();
  };

  return (
    <div className="max-w-lg mx-auto mt-16 text-center px-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
          <span className="text-2xl">✨</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Do you want to use {config.title} on your site?
        </h2>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          {config.description}
          <br />
          <span className="text-gray-400 text-xs mt-2 block">
            You can always enable this later in Settings → Modules.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleActivate}
            className="bg-blue-500 hover:bg-blue-600 rounded-full px-8 text-sm font-semibold gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Yes, set it up
          </Button>
          <Button
            variant="outline"
            onClick={handleSkip}
            disabled={skipping}
            className="rounded-full px-8 text-sm font-medium text-gray-500 gap-2"
          >
            <SkipForward className="w-4 h-4" />
            {skipping ? "Skipping..." : "Skip for now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
