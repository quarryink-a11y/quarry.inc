// STATUS: done

"use client";

import {
  DesignsCard,
  EventsCard,
  ExploreModulesBanner,
  GettingStartedChecklist,
  OptionalModulesModal,
  PortfolioCard,
  ReviewsCard,
  SiteLiveCard,
  WelcomeBanner,
} from "@features/dashboard/ui";
import { Skeleton } from "@shared/components/ui/skeleton";
import { useProfileMe } from "@shared/hooks/use-owner";
import { useSiteMe } from "@shared/hooks/use-site";
import { useState } from "react";

import { useDesigns } from "@/features/designs";
import { useEvents } from "@/features/events";
import { usePortfolios } from "@/features/portfolio";
import { useReviews } from "@/features/reviews";
import { SiteSection } from "@/shared/constants/enums";
import { useSiteSettings } from "@/shared/hooks/use-site-settings";

export default function DashboardPage() {
  const { data: profileMe } = useProfileMe();
  const { data: siteMe } = useSiteMe();
  const { data: siteSettings } = useSiteSettings();
  const sections = siteSettings?.site_sections ?? {};

  const isOnboardingComplete =
    siteMe?.owner_onboarding_status === "ONBOARDING_COMPLETED";

  const [showModulesModal, setShowModulesModal] = useState(false);

  const { data: portfolioItems = [], isLoading: loadingPortfolio } =
    usePortfolios();
  const { data: designItems = [], isLoading: loadingDesigns } = useDesigns();
  const { data: events = [], isLoading: loadingEvents } = useEvents();
  const { data: reviews = [], isLoading: loadingReviews } = useReviews();

  const isLoading =
    loadingPortfolio || loadingDesigns || loadingEvents || loadingReviews;

  const fullName = profileMe?.profile?.full_name;
  const userName = fullName?.split(" ")[0] ?? "User";

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Hi {userName}! 👋
        </h1>

        {!isOnboardingComplete ? (
          <>
            <div className="mb-6">
              <WelcomeBanner />
            </div>
            <GettingStartedChecklist />
          </>
        ) : (
          <>
            <SiteLiveCard />
            <ExploreModulesBanner onExplore={() => setShowModulesModal(true)} />
            <OptionalModulesModal
              open={showModulesModal}
              onClose={() => setShowModulesModal(false)}
            />

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                    <Skeleton className="h-6 w-24 mb-4" />
                    <Skeleton className="h-40 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {portfolioItems.length > 0 && (
                  <PortfolioCard items={portfolioItems} />
                )}
                {sections[SiteSection.DESIGNS] && designItems.length > 0 && (
                  <DesignsCard items={designItems} />
                )}
                {sections[SiteSection.EVENTS] && events.length > 0 && (
                  <EventsCard events={events} />
                )}
                {sections[SiteSection.REVIEWS] && reviews.length > 0 && (
                  <ReviewsCard reviews={reviews} />
                )}
              </div>
            )}
          </>
        )}

        <div className="text-center mt-10 py-6">
          <p className="text-sm text-gray-500">Have ideas for improvement?</p>
          <p className="text-sm text-gray-500">
            Email us at Quarry.ink@gmail.com. We&apos;d love to hear from you 🫶🏻
          </p>
        </div>
      </div>
    </div>
  );
}
