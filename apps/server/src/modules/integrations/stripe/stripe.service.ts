import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private readonly stripe: Stripe;

    constructor(private readonly configService: ConfigService) {
        this.stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'), {
            apiVersion: '2026-02-25.clover',
        });
    }

    async createCustomer(params: { email: string; name?: string; metadata?: Record<string, string> }) {
        return this.stripe.customers.create(params);
    }

    async attachPaymentMethodToCustomer(params: { customerId: string; paymentMethodId: string }) {
        return this.stripe.paymentMethods.attach(params.paymentMethodId, {
            customer: params.customerId,
        });
    }

    async setDefaultPaymentMethodForCustomer(params: { customerId: string; paymentMethodId: string }) {
        return this.stripe.customers.update(params.customerId, {
            invoice_settings: {
                default_payment_method: params.paymentMethodId,
            },
        });
    }

    async createTrialSubscription(params: {
        customerId: string;
        priceId: string;
        paymentMethodId: string;
        trialPeriodDays: number;
        trialEnd?: number; // Unix timestamp
        metadata?: Record<string, string>;
    }) {
        return this.stripe.subscriptions.create({
            customer: params.customerId,
            items: [
                {
                    price: params.priceId,
                },
            ],
            default_payment_method: params.paymentMethodId,
            trial_period_days: params.trialPeriodDays,
            trial_end: params.trialEnd,
            metadata: params.metadata,
        });
    }

    async createSetupIntent(params: { customerId: string }) {
        return this.stripe.setupIntents.create({
            customer: params.customerId,
            usage: 'off_session',
        });
    }

    // ── Stripe Connect ────────────────────────────────────────

    async createConnectAccount(params: { email: string; metadata?: Record<string, string> }) {
        return this.stripe.accounts.create({
            type: 'express',
            email: params.email,
            metadata: params.metadata,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });
    }

    async createAccountLink(params: { accountId: string; refreshUrl: string; returnUrl: string }) {
        return this.stripe.accountLinks.create({
            account: params.accountId,
            refresh_url: params.refreshUrl,
            return_url: params.returnUrl,
            type: 'account_onboarding',
        });
    }

    async getConnectAccount(accountId: string) {
        return this.stripe.accounts.retrieve(accountId);
    }

    // ── Checkout Sessions ───────────────────────────────────

    async createCheckoutSession(params: {
        lineItems: Array<{
            name: string;
            unitAmount: number;
            currency: string;
            quantity: number;
            images?: string[];
        }>;
        successUrl: string;
        cancelUrl: string;
        connectedAccountId: string;
        applicationFeeAmount: number;
        metadata?: Record<string, string>;
    }) {
        return this.stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: params.lineItems.map((item) => ({
                price_data: {
                    currency: item.currency.toLowerCase(),
                    product_data: {
                        name: item.name,
                        images: item.images,
                    },
                    unit_amount: item.unitAmount,
                },
                quantity: item.quantity,
            })),
            payment_intent_data: {
                application_fee_amount: params.applicationFeeAmount,
                transfer_data: { destination: params.connectedAccountId },
            },
            success_url: params.successUrl,
            cancel_url: params.cancelUrl,
            metadata: params.metadata,
        });
    }

    async retrieveCheckoutSession(sessionId: string) {
        return this.stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items', 'payment_intent'],
        });
    }

    // ── Webhooks ────────────────────────────────────────────

    constructWebhookEvent(payload: Buffer, signature: string) {
        const endpointSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
        if (!endpointSecret) {
            throw new Error('Stripe webhook secret is not configured');
        }

        return this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    }
}
