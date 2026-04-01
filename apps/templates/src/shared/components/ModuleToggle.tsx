"use client";

import {
  useSiteSettings,
  useUpdateSiteSettings,
} from "@shared/hooks/use-site-settings";
import { EyeOff, Globe } from "lucide-react";
import { useState } from "react";

import type { SiteSection } from "../constants/enums";

interface ModuleToggleProps {
  moduleKey: SiteSection;
  label: string;
}

export function ModuleToggle({ moduleKey, label }: ModuleToggleProps) {
  const { data: siteSettings } = useSiteSettings();
  const { mutateAsync: updateMe } = useUpdateSiteSettings();
  const [saving, setSaving] = useState(false);

  const sections = (siteSettings?.site_sections ?? {}) as Record<
    string,
    boolean
  >;
  const enabled = !!sections[moduleKey];

  const handleToggle = async () => {
    setSaving(true);
    await updateMe({
      site_sections: { ...sections, [moduleKey]: !enabled } as never,
    });
    setSaving(false);
  };

  if (!siteSettings) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={saving}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
        enabled
          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
          : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
      } ${saving ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
    >
      {enabled ? <Globe className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      {enabled
        ? `${label} visible on your website`
        : `${label} hidden — won't show on your website`}
    </button>
  );
}
