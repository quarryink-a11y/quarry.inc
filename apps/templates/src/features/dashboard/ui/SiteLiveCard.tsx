"use client";

import { generateSlug } from "@quarry/shared-utils";
import { Button } from "@shared/components/ui/button";
import { usePublishSite } from "@shared/hooks/use-publish-site";
import { useSiteMe } from "@shared/hooks/use-site";
import { useTenantHref } from "@shared/hooks/use-tenant-href";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  Globe,
  Loader2,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { useProfileMe } from "@/shared/hooks/use-owner";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://quarry.ink";

export function SiteLiveCard() {
  const { data: profileData } = useProfileMe();
  const { data: site } = useSiteMe();
  const { href } = useTenantHref();
  const publishMutation = usePublishSite();

  const profileMe = profileData?.profile;
  const slug = generateSlug(profileMe?.full_name);
  const isPublished = !!site?.published_at;
  const siteUrl = slug ? `${APP_URL}/${slug}` : "";

  const handlePublish = () => {
    if (!slug) {
      toast.error(
        "Please fill in your Artist full name in Settings → Contacts first.",
      );
      return;
    }
    publishMutation.mutate(undefined, {
      onSuccess: (data) => {
        const total = Object.values(data.counts).reduce((a, b) => a + b, 0);
        toast.success(
          total > 0
            ? `Published ${total} items!`
            : "Site is up to date — nothing new to publish.",
        );
      },
      onError: () => {
        toast.error("Failed to publish. Please try again.");
      },
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(siteUrl);
    toast.success("Link copied!");
  };

  return (
    <div
      className={`rounded-2xl p-5 mb-6 ${isPublished ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200" : "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isPublished ? "bg-green-100" : "bg-blue-100"}`}
        >
          <Globe
            className={`w-5 h-5 ${isPublished ? "text-green-600" : "text-blue-600"}`}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm">
              {isPublished
                ? "Your site is live!"
                : "Your site is ready to publish"}
            </h3>
            {isPublished && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          </div>
          <p className="text-xs text-gray-500 mb-3">
            {isPublished
              ? "Your website is live. Share the link with clients."
              : "Fill in your content, then hit Publish to go live."}
          </p>

          {slug ? (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 truncate">
                {siteUrl}
              </div>
              {isPublished && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    className="border-green-200 text-green-700 hover:bg-green-50 gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </Button>
                  <a href={siteUrl} target="_blank" rel="noopener noreferrer">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open
                    </Button>
                  </a>
                </>
              )}

              <Link href={href("/preview")} target="_blank">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> Preview
                </Button>
              </Link>

              <Button
                size="sm"
                onClick={handlePublish}
                disabled={publishMutation.isPending}
                className={`gap-1.5 ${isPublished ? "bg-blue-500 hover:bg-blue-600" : "bg-green-600 hover:bg-green-700"}`}
              >
                {publishMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                    Publishing...
                  </>
                ) : isPublished ? (
                  <>
                    <Rocket className="w-3.5 h-3.5" /> Update
                  </>
                ) : (
                  <>
                    <Rocket className="w-3.5 h-3.5" /> Publish
                  </>
                )}
              </Button>
            </div>
          ) : (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              Set your Artist full name in Settings → Contacts first to get your
              free quarry.ink domain.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
