"use client";

import { Button } from "@shared/components/ui/button";
import { useMediaUpload } from "@shared/hooks/use-media";
import type { ResponseSettings } from "@shared/types/api";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface LogoTabProps {
  settings: ResponseSettings | null;
  onSave: (data: Partial<ResponseSettings>) => Promise<void>;
}

export function LogoTab({ settings, onSave }: LogoTabProps) {
  const [logoUrl, setLogoUrl] = useState(settings?.logo_url || "");
  const [saving, setSaving] = useState(false);
  const upload = useMediaUpload();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await upload.mutateAsync(file);
    setLogoUrl(result.url);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ logo_url: logoUrl });
    setSaving(false);
    toast.success("Logo saved");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Website Logo
        </h2>
        <p className="text-sm text-gray-500">
          Upload your website logo. Recommended size: 200×200px
        </p>
      </div>

      <div className="flex items-start gap-6">
        <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-300" />
          )}
        </div>

        <div className="space-y-3">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
              <Upload className="w-4 h-4" />
              {upload.isPending ? "Uploading..." : "Upload logo"}
            </div>
          </label>

          {logoUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setLogoUrl("")}
            >
              <Trash2 className="w-4 h-4 mr-1" /> Remove
            </Button>
          )}
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
