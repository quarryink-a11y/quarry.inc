"use client";

import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { ExternalLink, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
// ResponseSettingsDto doesn't include domain fields yet — use inline shape
interface DomainSettings {
  domain?: string | null;
  domain_name?: string | null;
}

interface DomainTabProps {
  settings: DomainSettings | null;
  onSave: (data: Partial<DomainSettings>) => Promise<void>;
}

export function DomainTab({ settings, onSave }: DomainTabProps) {
  const [domain, setDomain] = useState(settings?.domain_name || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ domain_name: domain });
    setSaving(false);
    toast.success("Domain saved");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Domain Name
        </h2>
        <p className="text-sm text-gray-500">
          Set the domain name for your portfolio website
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Your domain
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              className="pl-10"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm text-blue-800 font-medium mb-2">
            How to connect a domain?
          </p>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>
              Purchase a domain from a registrar (Namecheap, GoDaddy, etc.)
            </li>
            <li>Add a CNAME record pointing to your site</li>
            <li>Enter the domain in the field above and save</li>
          </ol>
        </div>

        {domain && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ExternalLink className="w-4 h-4" />
            <span>
              Your site will be available at:{" "}
              <strong className="text-gray-700">https://{domain}</strong>
            </span>
          </div>
        )}
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
