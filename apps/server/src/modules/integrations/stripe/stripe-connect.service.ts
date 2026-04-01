import { Injectable } from '@nestjs/common';
import { Order } from 'generated/prisma/client';
import { Currency, OrderStatus } from 'generated/prisma/enums';
import Stripe from 'stripe';

import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';

import { MailService } from '../mail/mail.service';
import { StripeService } from './stripe.service';

@Injectable()
export class StripeConnectService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly stripeService: StripeService,
        private readonly mailService: MailService
    ) {}

    async handleCheckoutSessionCompleted(event: Stripe.Event) {
        const session = event.data.object as Stripe.Checkout.Session;

        const siteId = session.metadata?.siteId;
        if (!siteId) return;

        const itemIds = session.metadata?.itemIds?.split(',').filter(Boolean) ?? [];

        // Idempotency: skip if Order already exists for this session
        const existingOrder = await this.prisma.order.findUnique({
            where: { stripe_session_id: session.id },
        });
        if (existingOrder) return;

        const catalogItems = await this.prisma.catalog.findMany({
            where: { id: { in: itemIds }, site_id: siteId },
        });

        const fullSession = await this.stripeService.retrieveCheckoutSession(session.id);
        const paymentIntentId =
            typeof fullSession.payment_intent === 'string'
                ? fullSession.payment_intent
                : (fullSession.payment_intent?.id ?? '');

        const currency = ((session.currency ?? 'usd').toUpperCase() as Currency) || Currency.USD;

        const order = await this.prisma.$transaction(async (tx) => {
            const createdOrder = await tx.order.create({
                data: {
                    catalog_id: catalogItems[0]?.id ?? null,
                    stripe_session_id: session.id,
                    stripe_payment_intent_id: paymentIntentId,
                    customer_name: session.customer_details?.name ?? 'Unknown',
                    customer_email: session.customer_details?.email ?? '',
                    total_amount: (session.amount_total ?? 0) / 100,
                    currency,
                    status: OrderStatus.PAID,
                },
            });

            for (const item of catalogItems) {
                const lineItem = fullSession.line_items?.data.find((li) => li.description === item.name);

                await tx.orderItem.create({
                    data: {
                        order_id: createdOrder.id,
                        catalog_id: item.id,
                        name: item.name,
                        price: lineItem ? (lineItem.amount_total ?? 0) / 100 : Number(item.price),
                        currency,
                        quantity: lineItem?.quantity ?? 1,
                    },
                });
            }

            return createdOrder;
        });

        await this.notifyOwnerOfPurchase(siteId, order);
    }
    handleAccountUpdated(_event: Stripe.Event) {
        // MVP: no-op. getConnectStatus() always fetches live from Stripe.
    }

    private async notifyOwnerOfPurchase(
        siteId: string,
        order: Pick<Order, 'id' | 'customer_name' | 'customer_email' | 'total_amount' | 'currency'>
    ): Promise<void> {
        try {
            const site = await this.prisma.site.findUnique({
                where: { id: siteId },
                select: {
                    owner: {
                        select: { user: { select: { email: true, display_name: true } } },
                    },
                },
            });

            const ownerEmail = site?.owner?.user?.email;
            if (!ownerEmail) return;

            await this.mailService.sendTemplateEmail({
                template: 'newOrder',
                to: ownerEmail,
                subject: `New order from ${order.customer_name}`,
                context: {
                    ownerName: site.owner.user.display_name ?? 'there',
                    customerName: order.customer_name,
                    customerEmail: order.customer_email,
                    totalAmount: String(order.total_amount),
                    currency: order.currency,
                    orderId: order.id,
                },
            });
        } catch (error) {
            console.error('[Connect] Failed to send order notification', error);
        }
    }
}
