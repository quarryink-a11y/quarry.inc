import { Injectable } from '@nestjs/common';
import { BillingStatus, Status } from 'generated/prisma/enums';
import Stripe from 'stripe';

import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';

import { MailService } from '../mail/mail.service';

@Injectable()
export class StripeBillingService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mailService: MailService
    ) {}

    async handleInvoicePaid(event: Stripe.Event) {
        const invoice = event.data.object as Stripe.Invoice;

        const rawInvoice = invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null };
        const subscriptionId = typeof rawInvoice.subscription === 'string' ? rawInvoice.subscription : null;

        if (!subscriptionId) {
            console.warn(`Invoice ${invoice.id} does not have a valid subscription ID.`);
            return;
        }

        await this.prisma.siteBilling.updateMany({
            where: {
                stripe_subscription_id: subscriptionId,
            },
            data: {
                billing_status: BillingStatus.ACTIVE,
                subscription_status: 'active',
            },
        });

        const owner = await this.findOwnerBySubscription(subscriptionId);
        if (owner) {
            const amountPaid = (invoice.amount_paid ?? 0) / 100;
            const periodEnd = invoice.lines?.data[0]?.period?.end;

            await this.sendPaymentSucceededEmail(owner.email, {
                userName: owner.displayName,
                planName: owner.planName,
                amount: `$${amountPaid.toFixed(2)}`,
                nextBillingDate: periodEnd
                    ? new Date(periodEnd * 1000).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                      })
                    : '',
            });
        }
    }

    async handleInvoicePaymentFailed(event: Stripe.Event) {
        const invoice = event.data.object as Stripe.Invoice;

        const rawInvoice = invoice as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null };
        const subscriptionId = typeof rawInvoice.subscription === 'string' ? rawInvoice.subscription : null;

        if (!subscriptionId) {
            console.warn(`Invoice ${invoice.id} does not have a valid subscription ID.`);
            return;
        }

        await this.prisma.siteBilling.updateMany({
            where: {
                stripe_subscription_id: subscriptionId,
            },
            data: {
                billing_status: BillingStatus.PAST_DUE,
                subscription_status: 'past_due',
            },
        });

        const owner = await this.findOwnerBySubscription(subscriptionId);
        if (owner) {
            await this.sendPaymentFailedEmail(owner.email, {
                userName: owner.displayName,
                planName: owner.planName,
                retryInfo: 'Stripe will automatically retry the payment over the next few days.',
            });
        }
    }

    async handleSubscriptionUpdated(event: Stripe.Event) {
        const subscription = event.data.object as Stripe.Subscription;

        await this.prisma.siteBilling.updateMany({
            where: {
                stripe_subscription_id: subscription.id,
            },
            data: {
                subscription_status: subscription.status,
                trial_ends_at: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
                current_period_end: subscription.items.data[0]?.current_period_end
                    ? new Date(subscription.items.data[0].current_period_end * 1000)
                    : null,
            },
        });
    }

    async handleSubscriptionDeleted(event: Stripe.Event) {
        const subscription = event.data.object as Stripe.Subscription;

        await this.prisma.siteBilling.updateMany({
            where: {
                stripe_subscription_id: subscription.id,
            },
            data: {
                subscription_status: subscription.status,
                canceled_at: new Date(),
                billing_status: BillingStatus.CANCELED,
            },
        });

        // Deactivate the site when subscription is canceled
        await this.prisma.site.updateMany({
            where: {
                billing: { some: { stripe_subscription_id: subscription.id } },
            },
            data: { status: Status.SUSPENDED },
        });

        const owner = await this.findOwnerBySubscription(subscription.id);
        if (owner) {
            await this.sendSubscriptionCanceledEmail(owner.email, {
                userName: owner.displayName,
                planName: owner.planName,
                supportEmail: 'support@quarry.ink',
            });
        }
    }

    private async findOwnerBySubscription(
        subscriptionId: string
    ): Promise<{ email: string; displayName: string; planName: string } | null> {
        const billing = await this.prisma.siteBilling.findFirst({
            where: { stripe_subscription_id: subscriptionId },
            select: {
                plan_code: true,
                site: {
                    select: {
                        owner: {
                            select: {
                                user: { select: { email: true, display_name: true } },
                            },
                        },
                    },
                },
            },
        });

        const user = billing?.site?.owner?.user;
        if (!user) return null;

        return {
            email: user.email,
            displayName: user.display_name ?? 'there',
            planName: billing.plan_code === 'PRO' ? 'Pro' : 'Basic',
        };
    }

    private async sendPaymentSucceededEmail(
        to: string,
        context: { userName: string; planName: string; amount: string; nextBillingDate: string }
    ): Promise<void> {
        try {
            await this.mailService.sendTemplateEmail({ template: 'paymentSucceeded', to, context });
        } catch (error) {
            console.error(`[Billing] Failed to send paymentSucceeded email to ${to}`, error);
        }
    }

    private async sendPaymentFailedEmail(
        to: string,
        context: { userName: string; planName: string; retryInfo: string }
    ): Promise<void> {
        try {
            await this.mailService.sendTemplateEmail({ template: 'paymentFailed', to, context });
        } catch (error) {
            console.error(`[Billing] Failed to send paymentFailed email to ${to}`, error);
        }
    }

    private async sendSubscriptionCanceledEmail(
        to: string,
        context: { userName: string; planName: string; supportEmail: string }
    ): Promise<void> {
        try {
            await this.mailService.sendTemplateEmail({ template: 'subscriptionCanceled', to, context });
        } catch (error) {
            console.error(`[Billing] Failed to send subscriptionCanceled email to ${to}`, error);
        }
    }
}
