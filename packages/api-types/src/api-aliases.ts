/**
 * Re-exports from generated OpenAPI types for convenient imports.
 * This file is the SINGLE bridge between api.d.ts and the rest of the frontends.
 *
 * Usage: import type { Portfolio, CreatePortfolioDto } from "@quarry/api-types/aliases";
 */
import type { components } from "./api";

// ── Entity response types ────────────────────────────────────
export type Portfolio = components["schemas"]["PortfolioResponseDto"];
export type Design = components["schemas"]["DesignResponseDto"];
export type Review = components["schemas"]["ReviewResponseDto"];
export type Event = components["schemas"]["EventResponseDto"];
export type Admin = components["schemas"]["AdminResponseDto"];
export type FaqCategory = components["schemas"]["FaqCategoryResponseDto"];
export type FaqItem = components["schemas"]["FaqItemResponseDto"];
export type BookingStep = components["schemas"]["BookingStepResponseDto"];

// ── Create DTOs ──────────────────────────────────────────────
export type CreatePortfolioDto = components["schemas"]["CreatePortfolioDto"];
export type CreateDesignDto = components["schemas"]["CreateDesignDto"];
export type CreateReviewDto = components["schemas"]["CreateReviewDto"];
export type CreateEventDto = components["schemas"]["CreateEventDto"];
export type CreateAdminDto = components["schemas"]["CreateAdminDto"];
export type CreateFaqCategoryDto =
  components["schemas"]["CreateFaqCategoryDto"];
export type CreateFaqItemDto = components["schemas"]["CreateFaqItemDto"];
export type CreateBookingStepDto =
  components["schemas"]["CreateBookingStepDto"];

// ── Update DTOs ──────────────────────────────────────────────
export type UpdatePortfolioDto = components["schemas"]["UpdatePortfolioDto"];
export type UpdateDesignDto = components["schemas"]["UpdateDesignDto"];
export type UpdateReviewDto = components["schemas"]["UpdateReviewDto"];
export type UpdateEventDto = components["schemas"]["UpdateEventDto"];
export type UpdateAdminDto = components["schemas"]["UpdateAdminDto"];
export type UpdateFaqCategoryDto =
  components["schemas"]["UpdateFaqCategoryDto"];
export type UpdateFaqItemDto = components["schemas"]["UpdateFaqItemDto"];
export type UpdateBookingStepDto =
  components["schemas"]["UpdateBookingStepDto"];

// ── Auth / Profile ───────────────────────────────────────────
export type AuthUser = components["schemas"]["AuthUserDto"];
export type OwnerContext = components["schemas"]["OwnerContextDto"];
export type SiteContext = components["schemas"]["SiteContextDto"];
export type ProfileMe = components["schemas"]["ProfileMeResponseDto"];
export type ProfileDto = components["schemas"]["ProfileDto"];
export type UpdateProfileDto = components["schemas"]["UpdateProfileDto"];
export type AuthContext = components["schemas"]["AuthContextResponseDto"];

// ── Settings ─────────────────────────────────────────────────
export type ResponseSettings = components["schemas"]["ResponseSettingsDto"];
export type UpdateSettings = components["schemas"]["UpdateSettingsDto"];
export type PublicSiteResponse = components["schemas"]["PublicSiteResponseDto"];
export type PublicSiteSettings = components["schemas"]["PublicSiteSettingsDto"];
export type PublicOwnerProfile = components["schemas"]["PublicOwnerProfileDto"];

// ── About ────────────────────────────────────────────────────
export type AboutBlock = components["schemas"]["AboutBlockDto"];

// ── Public profile ────────────────────────────────────────────
export type PublicSocialMedia = components["schemas"]["PublicSocialMediaDto"];

// ── Media ────────────────────────────────────────────────────
export type MediaUploadResponse =
  components["schemas"]["MediaUploadResponseDto"];
export type ImageAttachment = components["schemas"]["ImageAttachmentDto"];

// ── Catalog ───────────────────────────────────────────────
export type Catalog = components["schemas"]["CatalogResponseDto"];
export type CreateCatalogDto = components["schemas"]["CreateCatalogDto"];
export type UpdateCatalogDto = components["schemas"]["UpdateCatalogDto"];

// ── Orders ────────────────────────────────────────────────
export type Order = components["schemas"]["OrderResponseDto"];
export type OrderItem = components["schemas"]["OrderItemResponseDto"];

// ── Inquiries ────────────────────────────────────────────
export type Inquiry = components["schemas"]["InquiryResponseDto"];
export type InquiryStatus = NonNullable<
  components["schemas"]["InquiryResponseDto"]["status"]
>;
export type CreateInquiryDto = components["schemas"]["CreateInquiryDto"];
export type UpdateInquiryDto = components["schemas"]["UpdateInquiryDto"];

// ── Public site content ─────────────────────────────────────
export type PublicSiteContent =
  components["schemas"]["PublicSiteContentResponseDto"];

// ── Site ─────────────────────────────────────────────────────
export type SiteResponse = components["schemas"]["SiteResponseDto"];
export type SiteSectionsDto = components["schemas"]["SiteSectionsDto"];

// ── Module completion ────────────────────────────────────────
export type CompleteModuleDto = components["schemas"]["CompleteModuleDto"];
export type CompleteModuleResponse =
  components["schemas"]["CompleteModuleResponseDto"];

// ── Analytics ────────────────────────────────────────────────
export type AnalyticsDashboard =
  components["schemas"]["AnalyticsDashboardResponseDto"];
export type ReferralSourceData = components["schemas"]["ReferralSourceItem"];
export type SourceConversionData =
  components["schemas"]["SourceConversionItem"];
export type ClientInsightsData = components["schemas"]["ClientInsightsDto"];
export type TrafficSourceCount = components["schemas"]["TrafficSourceCount"];
export type TrafficSource = components["schemas"]["TrafficSource"];

// ── Onboarding ───────────────────────────────────────────────
export type OnboardingContext =
  components["schemas"]["OnboardingContextResponseDto"];
export type OnboardingNavigation =
  components["schemas"]["OnboardingNavigationDto"];
export type OnboardingNavigationStep =
  components["schemas"]["OnboardingNavigationStepDto"];

export type OnboardingCompleteProfileDto =
  components["schemas"]["OnboardingCompleteProfileDto"];

export type OnboardingCompleteProfileResponseDto =
  components["schemas"]["OnboardingCompleteProfileResponseDto"];

export type OnboardingSelectTemplateDto =
  components["schemas"]["OnboardingSelectTemplateDto"];

export type OnboardingSelectTemplateResponseDto =
  components["schemas"]["OnboardingSelectTemplateResponseDto"];

export type OnboardingLaunchResponseDto =
  components["schemas"]["OnboardingLaunchResponseDto"];

export type OnboardingTemplate =
  components["schemas"]["OnboardingContextResponseDto"]["availableTemplates"][number];
// ── Billing ──────────────────────────────────────────────────
export type BillingStartTrialDto =
  components["schemas"]["BillingStartTrialDto"];
export type BillingStartTrialResponseDto =
  components["schemas"]["BillingStartTrialResponseDto"];
export type SubscriptionPlan = components["schemas"]["SubscriptionPlan"];
export type BillingCreateSetupIntentDto =
  components["schemas"]["BillingCreateSetupIntentDto"];
export type BillingCreateSetupIntentResponseDto =
  components["schemas"]["BillingCreateSetupIntentResponseDto"];
