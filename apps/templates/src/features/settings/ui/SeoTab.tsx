"use client";

import { PhotoUploader } from "@shared/components/PhotoUploader";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Textarea } from "@shared/components/ui/textarea";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
// ResponseSettingsDto doesn't include SEO fields yet — use inline shape
interface SeoSettings {
  site_title?: string | null;
  site_description?: string | null;
  seo_keywords?: string | null;
  og_image_url?: string | null;
}

interface SeoTabProps {
  settings: SeoSettings | null;
  onSave: (data: Partial<SeoSettings>) => Promise<void>;
}

export function SeoTab({ settings, onSave }: SeoTabProps) {
  const [seo, setSeo] = useState({
    site_title: settings?.site_title || "",
    site_description: settings?.site_description || "",
    seo_keywords: settings?.seo_keywords || "",
    og_image_url: settings?.og_image_url || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(seo);
    setSaving(false);
    toast.success("SEO settings saved");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">SEO</h2>
        <p className="text-sm text-gray-500">
          Search engine optimization — helps clients find you on Google
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Site title
          </label>
          <Input
            value={seo.site_title}
            onChange={(e) => setSeo({ ...seo, site_title: e.target.value })}
            placeholder="Tattoo Artist John Doe — New York"
            maxLength={60}
          />
          <p className="text-xs text-gray-400 mt-1">
            {seo.site_title.length}/60 characters
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Site description
          </label>
          <Textarea
            value={seo.site_description}
            onChange={(e) =>
              setSeo({ ...seo, site_description: e.target.value })
            }
            placeholder="Professional tattoo artist with 10 years of experience. Custom designs, realistic tattoos..."
            maxLength={160}
            className="h-20"
          />
          <p className="text-xs text-gray-400 mt-1">
            {seo.site_description.length}/160 characters
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Keywords
          </label>
          <Input
            value={seo.seo_keywords}
            onChange={(e) => setSeo({ ...seo, seo_keywords: e.target.value })}
            placeholder="tattoo, tattoo artist, New York, realistic tattoo"
          />
          <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            OG Image (social media preview)
          </label>
          <p className="text-xs text-gray-400 mb-2">
            Recommended size: 1200×630px
          </p>
          <PhotoUploader
            imageUrl={seo.og_image_url}
            onChange={(v) =>
              setSeo({ ...seo, og_image_url: v?.imageUrl ?? "" })
            }
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Google preview</p>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-400">google.com</span>
          </div>
          <p className="text-blue-700 text-base font-medium hover:underline cursor-pointer">
            {seo.site_title || "Your site title"}
          </p>
          <p className="text-sm text-green-700 mb-1">https://yourdomain.com</p>
          <p className="text-sm text-gray-600 line-clamp-2">
            {seo.site_description ||
              "Your site description will appear here..."}
          </p>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-500 hover:bg-blue-600"
      >
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
