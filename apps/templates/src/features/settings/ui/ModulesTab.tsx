"use client";

import { MODULES } from "@features/settings/lib/modules";
import { Skeleton } from "@shared/components/ui/skeleton";
import { Switch } from "@shared/components/ui/switch";
import type { SiteSection } from "@shared/constants/enums";
import { useSiteMe } from "@shared/hooks/use-site";
import {
  useSiteSettings,
  useUpdateSiteSettings,
} from "@shared/hooks/use-site-settings";
import type { SiteSections } from "@shared/types/local-types";
import { useState } from "react";
import toast from "react-hot-toast";

export function ModulesTab() {
  const { data: siteMe } = useSiteMe();
  const { data: siteSettings, isLoading } = useSiteSettings();
  const { mutateAsync: updateSiteSettings } = useUpdateSiteSettings();
  const sections: SiteSections =
    (siteSettings?.site_sections as SiteSections) ?? {};
  const [saving, setSaving] = useState(false);
  const isOnboarding =
    siteMe?.owner_onboarding_status !== "ONBOARDING_COMPLETED";

  const handleToggle = async (key: SiteSection, checked: boolean) => {
    const updated: SiteSections = { ...sections, [key]: checked };
    setSaving(true);
    try {
      await updateSiteSettings({ site_sections: updated });
    } catch {
      toast.error("Failed to update module settings");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-lg" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-5 w-9 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Site Modules</h2>
      <p className="text-sm text-gray-500 mb-6">
        Toggle which sections appear on your public website.
      </p>

      {isOnboarding && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-amber-700">
            Complete the onboarding first to enable optional modules.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {MODULES.map((mod) => (
          <div
            key={mod.key}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                <mod.icon className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{mod.label}</p>
                <p className="text-xs text-gray-500">{mod.description}</p>
              </div>
            </div>
            <Switch
              checked={!!sections[mod.key]}
              onCheckedChange={(checked) => void handleToggle(mod.key, checked)}
              disabled={saving || isOnboarding}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
