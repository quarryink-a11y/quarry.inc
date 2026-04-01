import 'dotenv/config';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { OpenApiModule } from './docs/openapi/open-api.module';
import { AuthModule } from './modules/access/auth/auth.module';
import { BearerAuthGuard, RolesGuard, TenantResolutionGuard } from './modules/access/permissions/guards';
import { AnalyticsDashboardModule } from './modules/analytics/dashboard/analytics-dashboard.module';
import { TrackVisitsModule } from './modules/analytics/track-visits/track-visits.module';
import { BillingModule } from './modules/billing/billing.module';
import { AdminsModule } from './modules/content/admins/admins.module';
import { BookingStepsModule } from './modules/content/booking-steps/booking-steps.module';
import { CatalogsModule } from './modules/content/catalogs/catalogs.module';
import { DesignsModule } from './modules/content/designs/designs.module';
import { EventsModule } from './modules/content/events/events.module';
import { FaqModule } from './modules/content/faq/faq.module';
import { InquiriesModule } from './modules/content/inquiries/inquiries.module';
import { PortfoliosModule } from './modules/content/portfolios/portfolios.module';
import { ReviewsModule } from './modules/content/reviews/reviews.module';
import { MailModule } from './modules/integrations/mail/mail.module';
import { StripeModule } from './modules/integrations/stripe/stripe.module';
import { MediaModule } from './modules/media/media.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { ProfileModule } from './modules/owners/profile/profile.module';
import { PublicModule } from './modules/public/public.module';
import { ModuleCompletionModule } from './modules/sites/module-completion/module-completion.module';
import { OnboardingTemplatesModule } from './modules/sites/onboarding-templates/onboarding-templates.module';
import { SeoModule } from './modules/sites/seo/seo.module';
import { SiteModule } from './modules/sites/site/site.module';
import { SiteDomainModule } from './modules/sites/site-domain/site-domain.module';
import { SiteSettingsModule } from './modules/sites/site-settings/site-settings.module';
import { TenantResolutionModule } from './modules/sites/tenant-resolution/tenant-resolution.module';
import { ENV_FILE_PATH } from './shared/constants';
import { PrismaModule } from './shared/infrastructure/modules/prisma/prisma.module';
import { SiteContextModule } from './shared/services/site-context.module';

@Module({
    imports: [
        ConfigModule?.forRoot({ isGlobal: true, envFilePath: ENV_FILE_PATH }),
        ScheduleModule.forRoot(),
        PrismaModule,
        SiteContextModule,
        AuthModule,
        MediaModule,
        OpenApiModule,
        MailModule,
        OnboardingTemplatesModule,
        OnboardingModule,
        StripeModule,
        BillingModule,
        TenantResolutionModule,
        PublicModule,
        ProfileModule,
        SiteModule,
        SiteSettingsModule,
        SiteDomainModule,
        SeoModule,
        ModuleCompletionModule,
        PortfoliosModule,
        ReviewsModule,
        EventsModule,
        DesignsModule,
        AdminsModule,
        FaqModule,
        BookingStepsModule,
        AnalyticsDashboardModule,
        TrackVisitsModule,
        CatalogsModule,
        InquiriesModule,
    ],
    providers: [
        { provide: APP_GUARD, useClass: BearerAuthGuard },
        { provide: APP_GUARD, useClass: TenantResolutionGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
    ],
})
export class AppModule {}
