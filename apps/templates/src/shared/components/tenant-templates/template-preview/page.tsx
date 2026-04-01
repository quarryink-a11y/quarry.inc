"use client";

import type { TemplateAppProps } from "@shared/components/tenant-templates/registry";
import type { AboutBlock, SiteSectionsDto } from "@shared/types/api";

import { useRequiredTenant } from "@/shared/providers/TenantProvider";

import { AboutSection } from "./AboutSection";
import { BookingFormSection } from "./BookingFormSection";
import { ContactSection } from "./ContactSection";
import { CustomCursor } from "./CustomCursor";
import { DesignsSection } from "./DesignsSection";
import { EventsSection } from "./EventsSection";
import { FaqSection } from "./FaqSection";
import { FluidCanvas } from "./FluidCanvas";
import { HeroSection } from "./HeroSection";
import { HowToBookSection } from "./HowToBookSection";
import { PortfolioSection } from "./PortfolioSection";
import { ReviewsSection } from "./ReviewsSection";
import { ShopSection } from "./ShopSection";

export function Template1Page({ content, isPreview }: TemplateAppProps) {
  const tenant = useRequiredTenant();
  const profile = tenant.profile;
  const sections = tenant.settings?.site_sections as
    | SiteSectionsDto
    | undefined;

  return (
    <div>
      <CustomCursor />
      <FluidCanvas />
      <HeroSection
        headline={profile?.full_name ?? undefined}
        intro={profile?.description ?? undefined}
      />
      <AboutSection
        photoUrl={profile?.about_photo_url ?? profile?.photo_url}
        aboutText={profile?.about_text ?? undefined}
        aboutBlocks={
          Array.isArray(profile?.about_blocks)
            ? (profile.about_blocks as AboutBlock[])
            : undefined
        }
      />
      {sections?.PORTFOLIO !== false && (
        <PortfolioSection items={content?.portfolios} />
      )}
      {sections?.DESIGNS !== false && (content?.designs ?? []).length > 0 && (
        <DesignsSection items={content?.designs} />
      )}
      {sections?.EVENTS !== false && (content?.events ?? []).length > 0 && (
        <EventsSection events={content?.events} />
      )}
      {sections?.REVIEWS !== false && (content?.reviews ?? []).length > 0 && (
        <ReviewsSection reviews={content?.reviews} />
      )}
      {sections?.FAQ !== false && (
        <FaqSection categories={content?.faq_categories} />
      )}
      {sections?.HOW_TO_BOOK !== false && (
        <HowToBookSection steps={content?.booking_steps} />
      )}
      {sections?.BOOKING_FORM !== false && <BookingFormSection />}
      {sections?.CATALOG !== false &&
        ((isPreview ?? false) || (content?.catalogs ?? []).length > 0) && (
          <ShopSection
            items={content?.catalogs}
            isPreview={isPreview}
            stripeConnected={
              (tenant as unknown as { stripe_connect_enabled?: boolean })
                .stripe_connect_enabled ?? false
            }
            tenantHost={tenant.site_domain?.host}
          />
        )}
      <ContactSection
        contact={profile ?? undefined}
        ownerName={profile?.full_name ?? undefined}
        events={content?.events}
      />
    </div>
  );
}
