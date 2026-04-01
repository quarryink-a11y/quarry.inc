import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BillingStatus, OnboardingStatus } from 'generated/prisma/enums';
import { SubscriptionPlan } from 'generated/prisma/enums';

import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';
import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';

import { AuthContextService } from '../access/auth/auth-context.service';
import { MailService } from '../integrations/mail/mail.service';
import { StripeService } from '../integrations/stripe/stripe.service';
import { BillingCreateSetupIntentDto, BillingStartTrialDto, ConnectOnboardDto } from './dto';

@Injectable()
export class BillingService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly stripe: StripeService,
        private readonly authContext: AuthContextService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService
    ) {}

    async createSetupIntentForUser(userId: string, dto: BillingCreateSetupIntentDto) {
        const { site, user } = await this.authContext.getUserOwnerSiteOrThrow(userId);

        const billingEmail = dto.billingEmail ?? user.email;
        const existingBilling = await this.prisma.siteBilling.findUnique({
            where: {
                site_id: site.id,
            },
        });
        let stripeCustomerId = existingBilling?.stripe_customer_id ?? null;

        if (!stripeCustomerId) {
            const customer = await this.stripe.createCustomer({
                email: billingEmail,
                name: user.display_name ?? undefined,
                metadata: {
                    siteId: site.id,
                    userId: user.id,
                },
            });
            stripeCustomerId = customer.id;
        }

        const billing = await this.prisma.siteBilling.upsert({
            where: {
                site_id: site.id,
            },
            update: {
                stripe_customer_id: stripeCustomerId,
                plan_code: dto.planCode,
                billing_email: billingEmail,
                billing_status: existingBilling?.billing_status ?? BillingStatus.PENDING,
            },
            create: {
                site_id: site.id,
                stripe_customer_id: stripeCustomerId,
                plan_code: dto.planCode,
                billing_email: billingEmail,
                billing_status: BillingStatus.PENDING,
            },
        });

        const setupIntent = await this.stripe.createSetupIntent({
            customerId: stripeCustomerId,
        });

        if (!setupIntent.client_secret) {
            throw new AppException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                code: ErrorCode.STRIPE_SETUP_INTENT_ERROR,
                message: 'Failed to create Stripe setup intent',
            });
        }

        return {
            success: true,
            setupIntent: {
                clientSecret: setupIntent.client_secret,
                customerId: stripeCustomerId,
            },
            billing,
        };
    }

    async startTrialForUser(userId: string, dto: BillingStartTrialDto) {
        const { site, user } = await this.authContext.getUserOwnerSiteOrThrow(userId);
        const STRIPE_PRICE_BY_PLAN = this.getStripePriceByPlan();

        const priceId = STRIPE_PRICE_BY_PLAN[dto.planCode];
        if (!priceId) {
            throw new AppException({
                status: HttpStatus.BAD_REQUEST,
                code: ErrorCode.INVALID_PLAN_CODE,
                message: `Stripe price is not configured for plan`,
            });
        }

        let billing = await this.prisma.siteBilling.findUnique({
            where: {
                site_id: site.id,
            },
        });

        billing ??= await this.prisma.siteBilling.create({
            data: {
                site_id: site.id,
                plan_code: dto.planCode,
                billing_email: dto.billingEmail ?? user.email,
                billing_status: BillingStatus.PENDING,
            },
        });

        let stripeCustomerId = billing.stripe_customer_id;

        if (!stripeCustomerId) {
            const customer = await this.stripe.createCustomer({
                email: dto.billingEmail ?? user.email,
                name: user.display_name ?? undefined,
                metadata: {
                    siteId: site.id,
                    userId: user.id,
                },
            });
            stripeCustomerId = customer.id;
        }

        // Stripe recommends attaching the payment method to the customer first, then setting it as default, before creating the subscription
        await this.stripe.attachPaymentMethodToCustomer({
            customerId: stripeCustomerId,
            paymentMethodId: dto.paymentMethodId,
        });

        await this.stripe.setDefaultPaymentMethodForCustomer({
            customerId: stripeCustomerId,
            paymentMethodId: dto.paymentMethodId,
        });

        const subscription = await this.stripe.createTrialSubscription({
            customerId: stripeCustomerId,
            priceId,
            paymentMethodId: dto.paymentMethodId,
            trialPeriodDays: 14,
            metadata: {
                siteId: site.id,
                userId: user.id,
                planCode: dto.planCode,
            },
        });

        const trialEndDate = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null;

        const currentPeriodEndDate = subscription.items.data[0]?.current_period_end
            ? new Date(subscription.items.data[0].current_period_end * 1000)
            : null;

        const updatedBilling = await this.prisma.siteBilling.upsert({
            where: {
                site_id: site.id,
            },
            update: {
                stripe_customer_id: stripeCustomerId,
                stripe_subscription_id: subscription.id,
                stripe_payment_method_id: dto.paymentMethodId,
                billing_email: dto.billingEmail ?? user.email,
                plan_code: dto.planCode,
                billing_status: BillingStatus.TRIALING,
                subscription_status: subscription.status,
                trial_ends_at: trialEndDate,
                current_period_end: currentPeriodEndDate,
            },
            create: {
                site_id: site.id,
                stripe_customer_id: stripeCustomerId,
                stripe_subscription_id: subscription.id,
                stripe_payment_method_id: dto.paymentMethodId,
                billing_email: dto.billingEmail ?? user.email,
                plan_code: dto.planCode,
                billing_status: BillingStatus.TRIALING,
                subscription_status: subscription.status,
                trial_ends_at: trialEndDate,
                current_period_end: currentPeriodEndDate,
            },
            select: {
                site_id: true,
            },
        });

        await this.prisma.site.update({
            where: { id: site.id },
            data: {
                onboarding_status: OnboardingStatus.BILLING_SETUP_COMPLETED,
            },
        });

        await this.sendTrialWelcomeEmail(user, dto.planCode, trialEndDate);

        return {
            success: true,
            data: updatedBilling,
        };
    }

    async startConnectOnboarding(userId: string, dto: ConnectOnboardDto) {
        const { site, user } = await this.authContext.getUserOwnerSiteOrThrow(userId);

        const billing = await this.prisma.siteBilling.findUnique({
            where: { site_id: site.id },
            select: { stripe_connect_account_id: true },
        });

        let accountId = billing?.stripe_connect_account_id ?? null;

        if (!accountId) {
            const account = await this.stripe.createConnectAccount({
                email: user.email,
                metadata: { siteId: site.id, userId: user.id },
            });
            accountId = account.id;

            await this.prisma.siteBilling.upsert({
                where: { site_id: site.id },
                update: { stripe_connect_account_id: accountId },
                create: { site_id: site.id, stripe_connect_account_id: accountId },
            });
        }

        const accountLink = await this.stripe.createAccountLink({
            accountId,
            refreshUrl: dto.returnUrl,
            returnUrl: dto.returnUrl,
        });

        return { url: accountLink.url };
    }

    async getConnectStatus(userId: string) {
        const { site } = await this.authContext.getUserOwnerSiteOrThrow(userId);

        const billing = await this.prisma.siteBilling.findUnique({
            where: { site_id: site.id },
            select: { stripe_connect_account_id: true },
        });

        if (!billing?.stripe_connect_account_id) {
            return { connected: false, charges_enabled: false };
        }

        const account = await this.stripe.getConnectAccount(billing.stripe_connect_account_id);

        return {
            connected: true,
            charges_enabled: account.charges_enabled ?? false,
        };
    }

    async getBillingForUser(userId: string) {
        const { site } = await this.authContext.getUserOwnerSiteOrThrow(userId);

        const billing = await this.prisma.siteBilling.findUnique({
            where: { site_id: site.id },
            select: {
                billing_status: true,
                plan_code: true,
                subscription_status: true,
                trial_ends_at: true,
                current_period_end: true,
                canceled_at: true,
                stripe_connect_account_id: true,
            },
        });

        return { billing: billing ?? null };
    }

    private getStripePriceByPlan(): Record<SubscriptionPlan, string> {
        return {
            [SubscriptionPlan.BASIC]: this.configService.getOrThrow<string>('STRIPE_PRICE_BASIC'),
            [SubscriptionPlan.PRO]: this.configService.getOrThrow<string>('STRIPE_PRICE_PRO'),
        };
    }

    private async sendTrialWelcomeEmail(
        user: { email: string; display_name: string | null },
        planCode: SubscriptionPlan,
        trialEndDate: Date | null
    ): Promise<void> {
        try {
            const platformDomain = this.configService.get<string>('PLATFORM_BASE_DOMAIN') ?? 'quarry.ink';

            await this.mailService.sendTemplateEmail({
                template: 'trialWelcome',
                to: user.email,
                context: {
                    userName: user.display_name ?? 'there',
                    planName: planCode === SubscriptionPlan.PRO ? 'Pro' : 'Basic',
                    trialEndDate:
                        trialEndDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) ??
                        '',
                    loginLink: `https://${platformDomain}`,
                },
            });
        } catch (error) {
            console.error('[Billing] Failed to send trial welcome email', error);
        }
    }
}
