"use client";

import type { TemplateAppProps } from "@shared/components/tenant-templates/registry";
import type { AboutBlock, SiteSectionsDto } from "@shared/types/api";

import { useRequiredTenant } from "@/shared/providers/TenantProvider";

import { BentoAboutSection } from "./BentoAboutSection";
import { BentoContactSection } from "./BentoContactSection";
import { BentoCursor } from "./BentoCursor";
import { BentoDesignsSection } from "./BentoDesignsSection";
import { BentoEventsSection } from "./BentoEventsSection";
import { BentoFaqSection } from "./BentoFaqSection";
import { BentoFluidCanvas } from "./BentoFluidCanvas";
import { BentoHeroSection } from "./BentoHeroSection";
import { BentoHowToBookSection } from "./BentoHowToBookSection";
import { BentoPortfolioSection } from "./BentoPortfolioSection";
import { BentoReviewsSection } from "./BentoReviewsSection";
import { BentoShopSection } from "./BentoShopSection";

export function Template2Page({ content, isPreview }: TemplateAppProps) {
  const tenant = useRequiredTenant();
  const profile = tenant.profile;
  const sections = tenant.settings?.site_sections as
    | SiteSectionsDto
    | undefined;

  return (
    <div>
      <BentoFluidCanvas />
      <BentoCursor />
      <BentoHeroSection
        headline={profile?.full_name ?? undefined}
        intro={profile?.description ?? undefined}
      />
      <BentoAboutSection
        photoUrl={profile?.about_photo_url ?? profile?.photo_url ?? undefined}
        aboutText={profile?.about_text ?? undefined}
        aboutBlocks={
          Array.isArray(profile?.about_blocks)
            ? (profile.about_blocks as AboutBlock[])
            : undefined
        }
      />
      {sections?.PORTFOLIO !== false && (
        <BentoPortfolioSection items={content?.portfolios} />
      )}
      {sections?.DESIGNS !== false && (content?.designs ?? []).length > 0 && (
        <BentoDesignsSection items={content?.designs} />
      )}
      {sections?.EVENTS !== false && (content?.events ?? []).length > 0 && (
        <BentoEventsSection events={content?.events} />
      )}
      {sections?.REVIEWS !== false && (content?.reviews ?? []).length > 0 && (
        <BentoReviewsSection reviews={content?.reviews} />
      )}
      {sections?.FAQ !== false && (
        <BentoFaqSection categories={content?.faq_categories} />
      )}
      {sections?.HOW_TO_BOOK !== false && (
        <BentoHowToBookSection steps={content?.booking_steps} />
      )}
      {sections?.CATALOG !== false && (content?.catalogs ?? []).length > 0 && (
        <BentoShopSection
          items={content?.catalogs}
          isPreview={isPreview}
          stripeConnected={
            ((tenant as Record<string, unknown>)
              .stripe_connect_enabled as boolean) ?? false
          }
          tenantHost={tenant.site_domain?.host}
        />
      )}
      <BentoContactSection
        contact={profile ?? undefined}
        ownerName={profile?.full_name ?? undefined}
        events={content?.events}
      />
    </div>
  );
}
