-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "TemplateKind" AS ENUM ('TEMPLATE1', 'TEMPLATE2');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'OWNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('PENDING', 'ATTACHED');

-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('ONBOARDING_STARTED', 'TEMPLATE_SELECTED', 'PROFILE_COMPLETED', 'BILLING_SETUP_COMPLETED', 'ONBOARDING_COMPLETED');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BillingStatus" AS ENUM ('PENDING', 'ACTIVE', 'TRIALING', 'PAST_DUE', 'FAILED', 'COMPLETED', 'REFUNDED', 'CANCELED');

-- CreateEnum
CREATE TYPE "TrafficSource" AS ENUM ('INSTAGRAM', 'FACEBOOK', 'GOOGLE', 'DIRECT', 'OTHER');

-- CreateEnum
CREATE TYPE "ReferralSource" AS ENUM ('INSTAGRAM', 'FACEBOOK', 'GOOGLE', 'TIKTOK', 'REFERRAL', 'OTHER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PAID', 'PENDING', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'CAD', 'EUR', 'UAH');

-- CreateEnum
CREATE TYPE "CatalogCategory" AS ENUM ('MERCH', 'GIFT_CERTIFICATE', 'PRINT', 'STICKER', 'OTHER');

-- CreateEnum
CREATE TYPE "ColorScheme" AS ENUM ('BENTO', 'DARK');

-- CreateEnum
CREATE TYPE "SizeUnit" AS ENUM ('INCH', 'CM');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('OPEN', 'CLOSED', 'WAITLIST', 'SOON');

-- CreateEnum
CREATE TYPE "AdminPermission" AS ENUM ('MANAGE_PORTFOLIO', 'MANAGE_EVENTS', 'MANAGE_REVIEWS', 'MANAGE_CATALOG', 'VIEW_INQUIRIES', 'MANAGE_SITE_SETTINGS');

-- CreateEnum
CREATE TYPE "DomainKind" AS ENUM ('CUSTOM', 'PLATFORM_SUBDOMAIN', 'PREVIEW');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('GOOGLE', 'APPLE', 'PASSWORD');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('PRO', 'BASIC');

-- CreateEnum
CREATE TYPE "SocialMediaPlatform" AS ENUM ('INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'WHATSAPP', 'YOUTUBE', 'TELEGRAM');

-- CreateEnum
CREATE TYPE "OwnerOnboardingStatus" AS ENUM ('ONBOARDING_STARTED', 'ONBOARDING_COMPLETED');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "SiteSection" AS ENUM ('HERO', 'ABOUT', 'HOW_TO_BOOK', 'PORTFOLIO', 'DESIGNS', 'CATALOG', 'EVENTS', 'REVIEWS', 'FAQ', 'ADMINS', 'ANALYTICS', 'BOOKING_FORM', 'ARTIST_PROFILE', 'WELCOME', 'ORDERS');

-- CreateTable
CREATE TABLE "auth_identities" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "provider_subject" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credential_secrets" (
    "user_id" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credential_secrets_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "email_verification_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "display_name" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_contents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "status" "MediaStatus" NOT NULL DEFAULT 'PENDING',
    "public_id" TEXT NOT NULL,
    "format" TEXT,
    "bytes" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "duration" DOUBLE PRECISION,
    "site_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboarding_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "preview_image" TEXT,
    "preview_screens" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sections" "SiteSection"[] DEFAULT ARRAY[]::"SiteSection"[],
    "kind" "TemplateKind" NOT NULL DEFAULT 'TEMPLATE1',
    "color_scheme" "ColorScheme",
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnerProfile" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "description" TEXT,
    "country" TEXT,
    "city" TEXT,
    "studio_name" TEXT,
    "studio_address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "social_media" JSONB NOT NULL DEFAULT '{}',
    "photo_url" TEXT,
    "studio_photo_url" TEXT,
    "about_text" TEXT,
    "about_blocks" JSONB,
    "about_photo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "owners" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'OWNER',
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "owners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_billings" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "stripe_connect_account_id" TEXT,
    "stripe_payment_method_id" TEXT,
    "billing_status" "BillingStatus",
    "plan_code" "SubscriptionPlan",
    "subscription_status" TEXT,
    "billing_email" TEXT,
    "trial_ends_at" TIMESTAMP(3),
    "current_period_end" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_billings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_domains" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "kind" "DomainKind" NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_seos" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "keywords" TEXT,
    "og_image_url" TEXT,
    "og_title" TEXT,
    "og_description" TEXT,
    "site_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_seos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "logo_url" TEXT,
    "analytics_enabled" BOOLEAN NOT NULL DEFAULT true,
    "site_sections" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sites" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "onboarding_template_id" TEXT,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "completed_modules" "SiteSection"[] DEFAULT ARRAY[]::"SiteSection"[],
    "onboarding_status" "OnboardingStatus" NOT NULL DEFAULT 'ONBOARDING_STARTED',
    "owner_onboarding_status" "OwnerOnboardingStatus" NOT NULL DEFAULT 'ONBOARDING_STARTED',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "super_admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'SUPER_ADMIN',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "super_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "client_email" TEXT NOT NULL,
    "client_phone" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "idea_description" TEXT NOT NULL,
    "placement" TEXT NOT NULL,
    "size_value" DOUBLE PRECISION NOT NULL,
    "size_unit" TEXT NOT NULL,
    "preferred_date" TIMESTAMP(3) NOT NULL,
    "city" TEXT NOT NULL,
    "referral_source" "ReferralSource" NOT NULL,
    "inspiration_urls" TEXT[],
    "final_price" DECIMAL(10,2),
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone_code" TEXT,
    "phone_country_code" TEXT,
    "phone_number" TEXT,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "access_modules" "AdminPermission"[] DEFAULT ARRAY[]::"AdminPermission"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_steps" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "type" "ContentType" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogs" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "category" "CatalogCategory" NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_public_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "type" "ContentType" NOT NULL DEFAULT 'DRAFT',
    "stock_quantity" INTEGER,
    "gift_amounts" INTEGER[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "catalog_id" TEXT,
    "stripe_session_id" TEXT NOT NULL,
    "stripe_payment_intent_id" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "catalog_id" TEXT,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designs" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "name" TEXT,
    "price" DECIMAL(10,2),
    "currency" "Currency",
    "size" DOUBLE PRECISION,
    "size_unit" "SizeUnit",
    "preferred_body_placement" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "image_url" TEXT NOT NULL,
    "image_public_id" TEXT,
    "type" "ContentType" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "designs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3),
    "image_url" TEXT NOT NULL,
    "image_public_id" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'OPEN',
    "type" "ContentType" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_categories" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "type" "ContentType" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faq_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_items" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faq_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolios" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "price" DECIMAL(10,2),
    "currency" "Currency",
    "size" DOUBLE PRECISION,
    "size_unit" "SizeUnit",
    "image_url" TEXT NOT NULL,
    "image_public_id" TEXT,
    "type" "ContentType" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "review_source" TEXT NOT NULL,
    "review_text" TEXT NOT NULL,
    "client_profile_url" TEXT,
    "client_image_url" TEXT,
    "client_image_public_id" TEXT,
    "type" "ContentType" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track_visits" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "visitor_key" TEXT,
    "referrer" TEXT,
    "traffic_source" "TrafficSource" NOT NULL,
    "user_agent" TEXT,
    "visited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "track_visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "auth_identities_user_id_idx" ON "auth_identities"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_identities_provider_provider_subject_key" ON "auth_identities"("provider", "provider_subject");

-- CreateIndex
CREATE UNIQUE INDEX "email_verification_tokens_code_hash_key" ON "email_verification_tokens"("code_hash");

-- CreateIndex
CREATE INDEX "email_verification_tokens_user_id_idx" ON "email_verification_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_hash_key" ON "password_reset_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "password_reset_tokens_user_id_idx" ON "password_reset_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_sessions_token_hash_key" ON "refresh_sessions"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_sessions_user_id_idx" ON "refresh_sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "media_contents_public_id_key" ON "media_contents"("public_id");

-- CreateIndex
CREATE INDEX "media_contents_site_id_idx" ON "media_contents"("site_id");

-- CreateIndex
CREATE INDEX "media_contents_status_idx" ON "media_contents"("status");

-- CreateIndex
CREATE INDEX "media_contents_created_at_idx" ON "media_contents"("created_at");

-- CreateIndex
CREATE INDEX "onboarding_templates_id_idx" ON "onboarding_templates"("id");

-- CreateIndex
CREATE INDEX "onboarding_templates_created_at_idx" ON "onboarding_templates"("created_at");

-- CreateIndex
CREATE INDEX "onboarding_templates_updated_at_idx" ON "onboarding_templates"("updated_at");

-- CreateIndex
CREATE INDEX "onboarding_templates_is_active_idx" ON "onboarding_templates"("is_active");

-- CreateIndex
CREATE INDEX "onboarding_templates_sort_order_idx" ON "onboarding_templates"("sort_order");

-- CreateIndex
CREATE INDEX "onboarding_templates_sort_order_created_at_idx" ON "onboarding_templates"("sort_order", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "OwnerProfile_owner_id_key" ON "OwnerProfile"("owner_id");

-- CreateIndex
CREATE INDEX "OwnerProfile_owner_id_idx" ON "OwnerProfile"("owner_id");

-- CreateIndex
CREATE INDEX "OwnerProfile_created_at_idx" ON "OwnerProfile"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "owners_user_id_key" ON "owners"("user_id");

-- CreateIndex
CREATE INDEX "owners_status_idx" ON "owners"("status");

-- CreateIndex
CREATE UNIQUE INDEX "site_billings_site_id_key" ON "site_billings"("site_id");

-- CreateIndex
CREATE UNIQUE INDEX "site_billings_stripe_customer_id_key" ON "site_billings"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "site_billings_stripe_subscription_id_key" ON "site_billings"("stripe_subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "site_billings_stripe_connect_account_id_key" ON "site_billings"("stripe_connect_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "site_billings_stripe_payment_method_id_key" ON "site_billings"("stripe_payment_method_id");

-- CreateIndex
CREATE INDEX "site_billings_site_id_idx" ON "site_billings"("site_id");

-- CreateIndex
CREATE UNIQUE INDEX "site_domains_site_id_key" ON "site_domains"("site_id");

-- CreateIndex
CREATE UNIQUE INDEX "site_domains_host_key" ON "site_domains"("host");

-- CreateIndex
CREATE INDEX "site_domains_site_id_idx" ON "site_domains"("site_id");

-- CreateIndex
CREATE INDEX "site_domains_host_idx" ON "site_domains"("host");

-- CreateIndex
CREATE UNIQUE INDEX "site_seos_site_id_key" ON "site_seos"("site_id");

-- CreateIndex
CREATE INDEX "site_seos_id_idx" ON "site_seos"("id");

-- CreateIndex
CREATE INDEX "site_seos_site_id_idx" ON "site_seos"("site_id");

-- CreateIndex
CREATE INDEX "site_seos_created_at_idx" ON "site_seos"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_site_id_key" ON "site_settings"("site_id");

-- CreateIndex
CREATE INDEX "site_settings_site_id_idx" ON "site_settings"("site_id");

-- CreateIndex
CREATE INDEX "site_settings_id_idx" ON "site_settings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sites_owner_id_key" ON "sites"("owner_id");

-- CreateIndex
CREATE INDEX "sites_owner_id_idx" ON "sites"("owner_id");

-- CreateIndex
CREATE INDEX "sites_status_idx" ON "sites"("status");

-- CreateIndex
CREATE INDEX "sites_created_at_idx" ON "sites"("created_at");

-- CreateIndex
CREATE INDEX "sites_updated_at_idx" ON "sites"("updated_at");

-- CreateIndex
CREATE INDEX "sites_onboarding_status_idx" ON "sites"("onboarding_status");

-- CreateIndex
CREATE INDEX "sites_owner_onboarding_status_idx" ON "sites"("owner_onboarding_status");

-- CreateIndex
CREATE INDEX "sites_onboarding_template_id_idx" ON "sites"("onboarding_template_id");

-- CreateIndex
CREATE UNIQUE INDEX "super_admins_email_key" ON "super_admins"("email");

-- CreateIndex
CREATE INDEX "inquiries_site_id_idx" ON "inquiries"("site_id");

-- CreateIndex
CREATE INDEX "inquiries_created_at_idx" ON "inquiries"("created_at");

-- CreateIndex
CREATE INDEX "inquiries_updated_at_idx" ON "inquiries"("updated_at");

-- CreateIndex
CREATE INDEX "inquiries_status_idx" ON "inquiries"("status");

-- CreateIndex
CREATE INDEX "inquiries_final_price_idx" ON "inquiries"("final_price");

-- CreateIndex
CREATE INDEX "inquiries_client_email_idx" ON "inquiries"("client_email");

-- CreateIndex
CREATE INDEX "inquiries_created_at_status_idx" ON "inquiries"("created_at", "status");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE INDEX "admins_id_idx" ON "admins"("id");

-- CreateIndex
CREATE INDEX "admins_created_at_idx" ON "admins"("created_at");

-- CreateIndex
CREATE INDEX "admins_updated_at_idx" ON "admins"("updated_at");

-- CreateIndex
CREATE INDEX "booking_steps_site_id_idx" ON "booking_steps"("site_id");

-- CreateIndex
CREATE INDEX "booking_steps_site_id_type_idx" ON "booking_steps"("site_id", "type");

-- CreateIndex
CREATE INDEX "catalogs_site_id_idx" ON "catalogs"("site_id");

-- CreateIndex
CREATE INDEX "catalogs_site_id_type_idx" ON "catalogs"("site_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "orders_stripe_session_id_key" ON "orders"("stripe_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_stripe_payment_intent_id_key" ON "orders"("stripe_payment_intent_id");

-- CreateIndex
CREATE INDEX "orders_catalog_id_idx" ON "orders"("catalog_id");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "order_items_catalog_id_idx" ON "order_items"("catalog_id");

-- CreateIndex
CREATE INDEX "designs_id_idx" ON "designs"("id");

-- CreateIndex
CREATE INDEX "designs_created_at_idx" ON "designs"("created_at");

-- CreateIndex
CREATE INDEX "designs_updated_at_idx" ON "designs"("updated_at");

-- CreateIndex
CREATE INDEX "designs_site_id_type_idx" ON "designs"("site_id", "type");

-- CreateIndex
CREATE INDEX "events_id_idx" ON "events"("id");

-- CreateIndex
CREATE INDEX "events_created_at_idx" ON "events"("created_at");

-- CreateIndex
CREATE INDEX "events_updated_at_idx" ON "events"("updated_at");

-- CreateIndex
CREATE INDEX "events_country_idx" ON "events"("country");

-- CreateIndex
CREATE INDEX "events_city_idx" ON "events"("city");

-- CreateIndex
CREATE INDEX "events_start_at_idx" ON "events"("start_at");

-- CreateIndex
CREATE INDEX "events_end_at_idx" ON "events"("end_at");

-- CreateIndex
CREATE INDEX "events_site_id_type_idx" ON "events"("site_id", "type");

-- CreateIndex
CREATE INDEX "faq_categories_site_id_idx" ON "faq_categories"("site_id");

-- CreateIndex
CREATE INDEX "faq_categories_site_id_type_idx" ON "faq_categories"("site_id", "type");

-- CreateIndex
CREATE INDEX "faq_items_category_id_idx" ON "faq_items"("category_id");

-- CreateIndex
CREATE INDEX "portfolios_id_idx" ON "portfolios"("id");

-- CreateIndex
CREATE INDEX "portfolios_created_at_idx" ON "portfolios"("created_at");

-- CreateIndex
CREATE INDEX "portfolios_updated_at_idx" ON "portfolios"("updated_at");

-- CreateIndex
CREATE INDEX "portfolios_currency_idx" ON "portfolios"("currency");

-- CreateIndex
CREATE INDEX "portfolios_size_unit_idx" ON "portfolios"("size_unit");

-- CreateIndex
CREATE INDEX "portfolios_price_idx" ON "portfolios"("price");

-- CreateIndex
CREATE INDEX "portfolios_site_id_type_idx" ON "portfolios"("site_id", "type");

-- CreateIndex
CREATE INDEX "reviews_id_idx" ON "reviews"("id");

-- CreateIndex
CREATE INDEX "reviews_created_at_idx" ON "reviews"("created_at");

-- CreateIndex
CREATE INDEX "reviews_updated_at_idx" ON "reviews"("updated_at");

-- CreateIndex
CREATE INDEX "reviews_site_id_type_idx" ON "reviews"("site_id", "type");

-- CreateIndex
CREATE INDEX "track_visits_site_id_idx" ON "track_visits"("site_id");

-- CreateIndex
CREATE INDEX "track_visits_visited_at_idx" ON "track_visits"("visited_at");

-- CreateIndex
CREATE INDEX "track_visits_visitor_key_idx" ON "track_visits"("visitor_key");

-- CreateIndex
CREATE INDEX "track_visits_site_id_visitor_key_path_visited_at_idx" ON "track_visits"("site_id", "visitor_key", "path", "visited_at");

-- AddForeignKey
ALTER TABLE "auth_identities" ADD CONSTRAINT "auth_identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credential_secrets" ADD CONSTRAINT "credential_secrets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_sessions" ADD CONSTRAINT "refresh_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_contents" ADD CONSTRAINT "media_contents_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerProfile" ADD CONSTRAINT "OwnerProfile_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "owners" ADD CONSTRAINT "owners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_billings" ADD CONSTRAINT "site_billings_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_domains" ADD CONSTRAINT "site_domains_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_seos" ADD CONSTRAINT "site_seos_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sites" ADD CONSTRAINT "sites_onboarding_template_id_fkey" FOREIGN KEY ("onboarding_template_id") REFERENCES "onboarding_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sites" ADD CONSTRAINT "sites_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_steps" ADD CONSTRAINT "booking_steps_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalogs" ADD CONSTRAINT "catalogs_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_catalog_id_fkey" FOREIGN KEY ("catalog_id") REFERENCES "catalogs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_catalog_id_fkey" FOREIGN KEY ("catalog_id") REFERENCES "catalogs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designs" ADD CONSTRAINT "designs_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faq_categories" ADD CONSTRAINT "faq_categories_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faq_items" ADD CONSTRAINT "faq_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "faq_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_visits" ADD CONSTRAINT "track_visits_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

