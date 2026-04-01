/**
 * Display-level mappers for enum values.
 *
 * Converts stored enum keys into human-readable labels, UI tokens,
 * option arrays for selects, and color/style maps.
 *
 * Enum declarations live in enums.ts — this file only contains mappers.
 */

import {
  BodyPlacement,
  CatalogCategory,
  Currency,
  EventStatus,
  InquiryStatus,
  OrderStatus,
  ReferralSource,
  ReviewSource,
  Role,
  SizeUnit,
  TrafficSource,
} from "@shared/constants/enums";
import type { Event } from "@shared/types/api";

import type { EventStatusStyle } from "../types/local-types";

// ── Currency ─────────────────────────────────────────────────

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.USD]: "$",
  [Currency.CAD]: "C$",
  [Currency.EUR]: "€",
  [Currency.UAH]: "₴",
};

export const CURRENCY_OPTIONS = (Object.values(Currency) as Currency[]).map(
  (value) => ({ value, label: `${CURRENCY_SYMBOLS[value]} ${value}` }),
);

// ── SizeUnit ─────────────────────────────────────────────────

export const SIZE_UNIT_LABELS: Record<SizeUnit, string> = {
  [SizeUnit.CM]: "Centimeters",
  [SizeUnit.INCH]: "Inches",
};

export const SIZE_UNIT_OPTIONS = (Object.values(SizeUnit) as SizeUnit[]).map(
  (value) => ({ value, label: SIZE_UNIT_LABELS[value] }),
);

// ── EventStatus ──────────────────────────────────────────────

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  [EventStatus.OPEN]: "Bookings open",
  [EventStatus.CLOSED]: "Closed",
  [EventStatus.WAITLIST]: "Waiting list",
  [EventStatus.SOON]: "Soon",
};

// Keep for backward compat — prefer EVENT_STATUS_LABELS going forward
type ApiEventStatus = Event["status"];
export const EVENT_STATUS_DISPLAY_LABELS: Record<ApiEventStatus, string> =
  EVENT_STATUS_LABELS as Record<ApiEventStatus, string>;

export const EVENT_STATUS_STYLES: Record<ApiEventStatus, EventStatusStyle> = {
  OPEN: {
    bg: "bg-[#D0FD0A]/15",
    text: "text-[#D0FD0A]",
    dot: "bg-[#D0FD0A]",
  },
  WAITLIST: {
    bg: "bg-[#D0FD0A]/15",
    text: "text-[#D0FD0A]",
    dot: "bg-[#D0FD0A]",
  },
  SOON: {
    bg: "bg-orange-500/15",
    text: "text-orange-400",
    dot: "bg-orange-400",
  },
  CLOSED: {
    bg: "bg-white/5",
    text: "text-white/30",
    dot: "bg-white/30",
  },
};

// ── Role ─────────────────────────────────────────────────────

export const ROLE_LABELS: Record<Role, string> = {
  [Role.SUPER_ADMIN]: "Super Admin",
  [Role.OWNER]: "Owner",
  [Role.ADMIN]: "Admin",
};

// ── InquiryStatus ────────────────────────────────────────────

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  [InquiryStatus.NEW]: "New",
  [InquiryStatus.IN_PROGRESS]: "In Progress",
  [InquiryStatus.COMPLETED]: "Completed",
  [InquiryStatus.CANCELLED]: "Cancelled",
};

export const INQUIRY_STATUS_STYLES: Record<InquiryStatus, string> = {
  [InquiryStatus.NEW]: "bg-blue-100 text-blue-700",
  [InquiryStatus.IN_PROGRESS]: "bg-yellow-100 text-yellow-700",
  [InquiryStatus.COMPLETED]: "bg-green-100 text-green-700",
  [InquiryStatus.CANCELLED]: "bg-red-50 text-red-600",
};

// ── OrderStatus ──────────────────────────────────────────────

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PAID]: "Paid",
  [OrderStatus.PENDING]: "Pending",
  [OrderStatus.FAILED]: "Failed",
  [OrderStatus.REFUNDED]: "Refunded",
};

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  [OrderStatus.PAID]: "bg-green-100 text-green-700",
  [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-700",
  [OrderStatus.FAILED]: "bg-red-100 text-red-700",
  [OrderStatus.REFUNDED]: "bg-gray-100 text-gray-700",
};

// ── TrafficSource ────────────────────────────────────────────

export const TRAFFIC_SOURCE_LABELS: Record<TrafficSource, string> = {
  [TrafficSource.INSTAGRAM]: "Instagram",
  [TrafficSource.FACEBOOK]: "Facebook",
  [TrafficSource.GOOGLE]: "Google",
  [TrafficSource.DIRECT]: "Direct",
  [TrafficSource.OTHER]: "Other",
};

// ── ReferralSource ───────────────────────────────────────────

export const REFERRAL_SOURCE_LABELS: Record<ReferralSource, string> = {
  [ReferralSource.INSTAGRAM]: "Instagram advertising",
  [ReferralSource.FACEBOOK]: "Facebook advertising",
  [ReferralSource.GOOGLE]: "Google search",
  [ReferralSource.TIKTOK]: "TikTok",
  [ReferralSource.REFERRAL]: "Recommendations, colleagues, etc.",
  [ReferralSource.OTHER]: "Other",
};

export const REFERRAL_SOURCE_OPTIONS = (
  Object.values(ReferralSource) as ReferralSource[]
).map((value) => ({ value, label: REFERRAL_SOURCE_LABELS[value] }));

export const REFERRAL_SOURCE_COLORS: Record<ReferralSource, string> = {
  [ReferralSource.INSTAGRAM]: "#E1306C",
  [ReferralSource.FACEBOOK]: "#4267B2",
  [ReferralSource.GOOGLE]: "#34A853",
  [ReferralSource.TIKTOK]: "#000000",
  [ReferralSource.REFERRAL]: "#8B5CF6",
  [ReferralSource.OTHER]: "#9CA3AF",
};

export const REFERRAL_SOURCE_BADGE_STYLES: Record<ReferralSource, string> = {
  [ReferralSource.INSTAGRAM]: "bg-pink-50 text-pink-700",
  [ReferralSource.FACEBOOK]: "bg-blue-50 text-blue-700",
  [ReferralSource.GOOGLE]: "bg-green-50 text-green-700",
  [ReferralSource.TIKTOK]: "bg-gray-100 text-gray-700",
  [ReferralSource.REFERRAL]: "bg-purple-50 text-purple-700",
  [ReferralSource.OTHER]: "bg-gray-50 text-gray-600",
};

// ── BodyPlacement ────────────────────────────────────────────

export const BODY_PLACEMENT_LABELS: Record<BodyPlacement, string> = {
  [BodyPlacement.FOREARM]: "Forearm",
  [BodyPlacement.UPPER_ARM]: "Upper arm",
  [BodyPlacement.LEG]: "Leg",
  [BodyPlacement.BACK]: "Back",
  [BodyPlacement.CHEST]: "Chest",
  [BodyPlacement.THIGH]: "Thigh",
  [BodyPlacement.CALF]: "Calf",
  [BodyPlacement.SHOULDER]: "Shoulder",
  [BodyPlacement.RIBCAGE]: "Ribcage",
  [BodyPlacement.ANKLE]: "Ankle",
  [BodyPlacement.COLLARBONE]: "Collarbone",
  [BodyPlacement.OTHER]: "Other",
};

export const BODY_PLACEMENT_OPTIONS = (
  Object.values(BodyPlacement) as BodyPlacement[]
).map((value) => ({ value, label: BODY_PLACEMENT_LABELS[value] }));

// ── ReviewSource ─────────────────────────────────────────────

export const REVIEW_SOURCE_LABELS: Record<ReviewSource, string> = {
  [ReviewSource.INSTAGRAM]: "Instagram",
  [ReviewSource.GOOGLE]: "Google review",
  [ReviewSource.FACEBOOK]: "Facebook",
  [ReviewSource.OTHER]: "Other (Email, Reddit, etc.)",
};

export const REVIEW_SOURCE_OPTIONS = (
  Object.values(ReviewSource) as ReviewSource[]
).map((value) => ({ value, label: REVIEW_SOURCE_LABELS[value] }));

// ── CatalogCategory ──────────────────────────────────────────

export const CATALOG_CATEGORY_LABELS: Record<CatalogCategory, string> = {
  [CatalogCategory.MERCH]: "Merch",
  [CatalogCategory.GIFT_CERTIFICATE]: "Gift Certificate",
  [CatalogCategory.PRINT]: "Print",
  [CatalogCategory.STICKER]: "Sticker",
  [CatalogCategory.OTHER]: "Other",
};

export const CATALOG_CATEGORY_OPTIONS = (
  Object.values(CatalogCategory) as CatalogCategory[]
).map((value) => ({ value, label: CATALOG_CATEGORY_LABELS[value] }));
