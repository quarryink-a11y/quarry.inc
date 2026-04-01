/**
 * Runtime enum definitions mirroring Prisma/server enums.
 *
 * Rules:
 * - Only enum declarations here.
 * - All display labels, option arrays, color/style maps → mappers.ts
 */

// ── Currency ─────────────────────────────────────────────────

export enum Currency {
  USD = "USD",
  CAD = "CAD",
  EUR = "EUR",
  UAH = "UAH",
}

// ── SizeUnit ─────────────────────────────────────────────────

export enum SizeUnit {
  CM = "CM",
  INCH = "INCH",
}

// ── EventStatus ──────────────────────────────────────────────

export enum EventStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  WAITLIST = "WAITLIST",
  SOON = "SOON",
}

// ── Role ─────────────────────────────────────────────────────

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  OWNER = "OWNER",
  ADMIN = "ADMIN",
}

// ── OnboardingStatus ─────────────────────────────────────────

export enum OnboardingStatus {
  ONBOARDING_STARTED = "ONBOARDING_STARTED",
  TEMPLATE_SELECTED = "TEMPLATE_SELECTED",
  PROFILE_COMPLETED = "PROFILE_COMPLETED",
  BILLING_SETUP_COMPLETED = "BILLING_SETUP_COMPLETED",
  ONBOARDING_COMPLETED = "ONBOARDING_COMPLETED",
}

// ── SocialMediaPlatform ──────────────────────────────────────

export enum SocialMediaPlatform {
  INSTAGRAM = "INSTAGRAM",
  FACEBOOK = "FACEBOOK",
  TIKTOK = "TIKTOK",
  WHATSAPP = "WHATSAPP",
  YOUTUBE = "YOUTUBE",
  TELEGRAM = "TELEGRAM",
}

// ── AdminPermission ──────────────────────────────────────────

export enum AdminPermission {
  MANAGE_PORTFOLIO = "MANAGE_PORTFOLIO",
  MANAGE_EVENTS = "MANAGE_EVENTS",
  MANAGE_REVIEWS = "MANAGE_REVIEWS",
  MANAGE_CATALOG = "MANAGE_CATALOG",
  VIEW_INQUIRIES = "VIEW_INQUIRIES",
  MANAGE_SITE_SETTINGS = "MANAGE_SITE_SETTINGS",
}

// ── ColorScheme ──────────────────────────────────────────────

export enum ColorScheme {
  BENTO = "BENTO",
  DARK = "DARK",
}

// ── TemplateKind ─────────────────────────────────────────────

export enum TemplateKind {
  TEMPLATE1 = "TEMPLATE1",
  TEMPLATE2 = "TEMPLATE2",
}

// ── InquiryStatus ────────────────────────────────────────────

export enum InquiryStatus {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

// ── OrderStatus ──────────────────────────────────────────────

export enum OrderStatus {
  PAID = "PAID",
  PENDING = "PENDING",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

// ── TrafficSource ────────────────────────────────────────────

export enum TrafficSource {
  INSTAGRAM = "INSTAGRAM",
  FACEBOOK = "FACEBOOK",
  GOOGLE = "GOOGLE",
  DIRECT = "DIRECT",
  OTHER = "OTHER",
}

// ── ReferralSource ───────────────────────────────────────────
// Stored value is the enum key. Display label is in mappers.ts.

export enum ReferralSource {
  INSTAGRAM = "INSTAGRAM",
  FACEBOOK = "FACEBOOK",
  GOOGLE = "GOOGLE",
  TIKTOK = "TIKTOK",
  REFERRAL = "REFERRAL",
  OTHER = "OTHER",
}

// ── BodyPlacement ────────────────────────────────────────────
// Stored value is the enum key. Display label is in mappers.ts.

export enum BodyPlacement {
  FOREARM = "FOREARM",
  UPPER_ARM = "UPPER_ARM",
  LEG = "LEG",
  BACK = "BACK",
  CHEST = "CHEST",
  THIGH = "THIGH",
  CALF = "CALF",
  SHOULDER = "SHOULDER",
  RIBCAGE = "RIBCAGE",
  ANKLE = "ANKLE",
  COLLARBONE = "COLLARBONE",
  OTHER = "OTHER",
}

// ── ReviewSource ─────────────────────────────────────────────
// Stored value is the enum key. Display label is in mappers.ts.

export enum ReviewSource {
  INSTAGRAM = "INSTAGRAM",
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
  OTHER = "OTHER",
}

// ── CatalogCategory ──────────────────────────────────────────

export enum CatalogCategory {
  MERCH = "MERCH",
  GIFT_CERTIFICATE = "GIFT_CERTIFICATE",
  PRINT = "PRINT",
  STICKER = "STICKER",
  OTHER = "OTHER",
}

// ── SiteSection ──────────────────────────────────────────────

export enum SiteSection {
  HERO = "HERO",
  ABOUT = "ABOUT",
  HOW_TO_BOOK = "HOW_TO_BOOK",
  PORTFOLIO = "PORTFOLIO",
  DESIGNS = "DESIGNS",
  CATALOG = "CATALOG",
  EVENTS = "EVENTS",
  REVIEWS = "REVIEWS",
  FAQ = "FAQ",
  ADMINS = "ADMINS",
  ANALYTICS = "ANALYTICS",
  BOOKING_FORM = "BOOKING_FORM",
  ARTIST_PROFILE = "ARTIST_PROFILE",
  WELCOME = "WELCOME",
  ORDERS = "ORDERS",
}

// ── TemplateSection ──────────────────────────────────────────

export enum TemplateSection {
  HERO = "HERO",
  ABOUT = "ABOUT",
  HOW_TO_BOOK = "HOW_TO_BOOK",
  PORTFOLIO = "PORTFOLIO",
  DESIGNS = "DESIGNS",
  CATALOG = "CATALOG",
  EVENTS = "EVENTS",
  REVIEWS = "REVIEWS",
  FAQ = "FAQ",
  BOOKING_FORM = "BOOKING_FORM",
}
