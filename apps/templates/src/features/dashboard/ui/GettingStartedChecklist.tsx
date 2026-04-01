"use client";

import { Progress } from "@shared/components/ui/progress";
import { useTenantHref } from "@shared/hooks/use-tenant-href";
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  FileText,
  HelpCircle,
  Lock,
  Palette,
  ShoppingBag,
  Sparkles,
  Star,
  UserCircle,
  Users,
} from "lucide-react";
import Link from "next/link";

import type { SiteSection } from "@/shared/constants/enums";
import { ESSENTIAL_MODULES } from "@/shared/hooks/use-complete-module";
import { useSiteMe } from "@/shared/hooks/use-site";

interface StepMeta {
  label: string;
  desc: string;
  icon: LucideIcon;
  page: string;
  pageTab?: string;
}

const STEP_META: Partial<Record<SiteSection, StepMeta>> = {
  ARTIST_PROFILE: {
    label: "Artist Profile",
    desc: "Your name, contacts & socials",
    icon: UserCircle,
    page: "settings",
    pageTab: "contacts",
  },
  ABOUT: {
    label: "About",
    desc: "Tell your story",
    icon: FileText,
    page: "about-me",
  },
  HOW_TO_BOOK: {
    label: "How to Book",
    desc: "Booking steps for clients",
    icon: ClipboardList,
    page: "how-to-book",
  },
  PORTFOLIO: {
    label: "Portfolio",
    desc: "Showcase your best works",
    icon: Briefcase,
    page: "portfolio",
  },
  FAQ: {
    label: "FAQ",
    desc: "Frequently asked questions",
    icon: HelpCircle,
    page: "faq",
  },
  WELCOME: {
    label: "Team & Admins",
    desc: "Add your assistant or manager",
    icon: Users,
    page: "admins",
  },
  DESIGNS: {
    label: "Designs",
    desc: "Flash designs & sketches",
    icon: Palette,
    page: "designs",
  },
  CATALOG: {
    label: "Catalog",
    desc: "Merch, gift cards & prints",
    icon: ShoppingBag,
    page: "catalog",
  },
  EVENTS: {
    label: "Events",
    desc: "Guest spots & conventions",
    icon: CalendarDays,
    page: "events",
  },
  REVIEWS: {
    label: "Reviews",
    desc: "Client testimonials",
    icon: Star,
    page: "reviews",
  },
};

interface StepItem extends StepMeta {
  key: SiteSection;
}

export function GettingStartedChecklist() {
  const { data: siteMe } = useSiteMe();
  const completed = siteMe?.completed_modules ?? [];
  const isOnboardingComplete =
    siteMe?.owner_onboarding_status === "ONBOARDING_COMPLETED";

  const essentialSteps: StepItem[] = ESSENTIAL_MODULES.map((key) => ({
    key,
    ...STEP_META[key]!,
  }));
  const essentialCompleted = essentialSteps.filter((s) =>
    completed.includes(s.key),
  ).length;
  const essentialProgress = Math.round(
    (essentialCompleted / essentialSteps.length) * 100,
  );

  const nextEssentialIndex = essentialSteps.findIndex(
    (s) => !completed.includes(s.key),
  );

  return (
    <div className="space-y-6">
      {!isOnboardingComplete && (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <p className="text-sm font-semibold text-gray-900">
                    Essential Setup
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {essentialCompleted} of {essentialSteps.length} — complete
                  these to publish your site
                </p>
              </div>
              <span className="text-lg font-bold text-blue-500">
                {essentialProgress}%
              </span>
            </div>
            <Progress value={essentialProgress} className="h-2" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
            {essentialSteps.map((step, i) => {
              const isCompleted = completed.includes(step.key);
              const isNext = i === nextEssentialIndex;
              const isLocked =
                !isCompleted &&
                i > nextEssentialIndex &&
                nextEssentialIndex !== -1;
              return (
                <StepRow
                  key={step.key}
                  step={step}
                  isCompleted={isCompleted}
                  isNext={isNext}
                  isLocked={isLocked}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

interface StepRowProps {
  step: StepItem;
  isCompleted: boolean;
  isNext: boolean;
  isLocked: boolean;
}

function StepRow({ step, isCompleted, isNext, isLocked }: StepRowProps) {
  const { href: tenantHref } = useTenantHref();
  const Icon = step.icon;

  const content = (
    <div
      className={`flex items-center gap-4 px-5 py-4 transition-all duration-200 ${
        isLocked
          ? "opacity-40 cursor-default"
          : "hover:bg-blue-50/40 cursor-pointer"
      } ${isNext ? "bg-blue-50/60" : ""}`}
    >
      <div
        className={`relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          isCompleted ? "bg-green-100" : isNext ? "bg-blue-100" : "bg-gray-100"
        }`}
      >
        {isCompleted ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : isLocked ? (
          <Lock className="w-3.5 h-3.5 text-gray-400" />
        ) : (
          <Icon className="w-4 h-4 text-blue-500" />
        )}
        {isNext && !isCompleted && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${isCompleted ? "text-gray-400 line-through" : "text-gray-800"}`}
        >
          {step.label}
        </p>
        <p className="text-xs text-gray-400 truncate">{step.desc}</p>
      </div>

      {isNext && !isCompleted && (
        <span className="shrink-0 bg-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
          Continue →
        </span>
      )}
      {!isLocked && !isCompleted && !isNext && (
        <ChevronRight className="w-4 h-4 shrink-0 text-gray-300" />
      )}
      {isCompleted && (
        <span className="text-xs text-green-500 font-medium shrink-0">
          Done
        </span>
      )}
    </div>
  );

  if (isLocked) return <div>{content}</div>;

  const href = step.pageTab
    ? tenantHref(`/admin/${step.page}?tab=${step.pageTab}`)
    : tenantHref(`/admin/${step.page}`);

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}
