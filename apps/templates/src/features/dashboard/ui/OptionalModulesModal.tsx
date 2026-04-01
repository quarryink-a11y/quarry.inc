"use client";

import { Button } from "@shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@shared/components/ui/dialog";
import { useSiteMe } from "@shared/hooks/use-site";
import {
  useSiteSettings,
  useUpdateSiteSettings,
} from "@shared/hooks/use-site-settings";
import { useTenantHref } from "@shared/hooks/use-tenant-href";
import { cn } from "@shared/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  CheckCircle2,
  Palette,
  ShoppingBag,
  SkipForward,
  Star,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { SiteSection } from "@/shared/constants/enums";
import { useCompleteModule } from "@/shared/hooks/use-complete-module";

interface OptionalFlowItem {
  key: SiteSection;
  title: string;
  description: string;
  icon: LucideIcon;
  page: string;
}

const OPTIONAL_FLOW: OptionalFlowItem[] = [
  {
    key: SiteSection.DESIGNS,
    title: "Designs",
    description:
      "Showcase your available tattoo designs that clients can pick and book directly.",
    icon: Palette,
    page: "designs",
  },
  {
    key: SiteSection.EVENTS,
    title: "Events",
    description:
      "Share your upcoming guest spots, conventions, and travel dates with clients.",
    icon: CalendarDays,
    page: "events",
  },
  {
    key: SiteSection.REVIEWS,
    title: "Reviews",
    description:
      "Display client testimonials and reviews to build trust with potential clients.",
    icon: Star,
    page: "reviews",
  },
  {
    key: SiteSection.CATALOG,
    title: "Catalog",
    description:
      "Sell merch, gift certificates, prints, stickers and other products from your store.",
    icon: ShoppingBag,
    page: "catalog",
  },
  {
    key: SiteSection.WELCOME,
    title: "Team & Admins",
    description:
      "Add your assistant or manager so they can help you manage the site.",
    icon: Users,
    page: "admins",
  },
];

interface OptionalModulesModalProps {
  open: boolean;
  onClose: () => void;
}

export function OptionalModulesModal({
  open,
  onClose,
}: OptionalModulesModalProps) {
  const { data: siteMe } = useSiteMe();
  const { data: siteSettings } = useSiteSettings();
  const { mutateAsync: updateSettings } = useUpdateSiteSettings();
  const { completeModule } = useCompleteModule();
  const router = useRouter();
  const { href } = useTenantHref();
  const [loading, setLoading] = useState(false);

  const completed = useMemo(
    () => siteMe?.completed_modules ?? [],
    [siteMe?.completed_modules],
  );
  const sections = useMemo(
    () =>
      (siteSettings?.site_sections ?? {}) as Record<
        string,
        boolean | undefined
      >,
    [siteSettings?.site_sections],
  );

  const currentModule = useMemo(() => {
    return OPTIONAL_FLOW.find((m) => !completed.includes(m.key));
  }, [completed]);

  if (!open || !currentModule) return null;

  const currentIndex = OPTIONAL_FLOW.findIndex(
    (m) => m.key === currentModule.key,
  );

  const handleActivate = async () => {
    setLoading(true);
    await updateSettings({
      site_sections: { ...sections, [currentModule.key]: true },
    });
    await completeModule(currentModule.key);
    setLoading(false);
    router.push(href(`/admin/${currentModule.page}`));
  };

  const handleSkip = async () => {
    setLoading(true);
    await completeModule(currentModule.key);
    if (sections[currentModule.key]) {
      await updateSettings({
        site_sections: { ...sections, [currentModule.key]: false },
      });
    }
    setLoading(false);
  };

  const Icon = currentModule.icon;

  return (
    <Dialog
      open
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogTitle className="sr-only">Optional modules</DialogTitle>
        <div className="flex items-center justify-center gap-2 pt-6 pb-2">
          {OPTIONAL_FLOW.map((m, i) => {
            const isCompleted = completed.includes(m.key);
            const isActive = i === currentIndex;
            const isSetUp = isCompleted && sections[m.key];
            const isSkipped = isCompleted && !sections[m.key];

            return (
              <div
                key={m.key}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  isCompleted || isActive ? "w-6" : "w-4",
                  isSetUp && "bg-green-400",
                  isSkipped && "bg-red-400",
                  isActive && "bg-blue-500",
                  !isCompleted && !isActive && "bg-gray-200",
                )}
              />
            );
          })}
        </div>

        <div className="px-8 pb-8 pt-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
            <Icon className="w-7 h-7 text-blue-500" />
          </div>

          <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">
            {currentIndex + 1} of {OPTIONAL_FLOW.length}
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Add {currentModule.title} to your site?
          </h2>

          <p className="text-sm text-gray-500 mb-2 leading-relaxed">
            {currentModule.description}
          </p>

          <p className="text-xs text-gray-400 mb-8">
            You can always enable this later in Settings → Modules
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleActivate}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 rounded-full px-8 text-sm font-semibold gap-2 w-full"
            >
              <CheckCircle2 className="w-4 h-4" />
              Yes, set it up
            </Button>
            <Button
              variant="ghost"
              onClick={handleSkip}
              disabled={loading}
              className="rounded-full px-8 text-sm font-medium text-gray-400 gap-2 w-full"
            >
              <SkipForward className="w-4 h-4" />
              {loading ? "Skipping..." : "Skip"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
