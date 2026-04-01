import { Controller, Headers, HttpCode, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

interface RawBodyRequest extends Request {
    rawBody?: Buffer;
}
import { IsPublic } from 'src/modules/access/permissions/decorators';

import { StripeService } from './stripe.service';
import { StripeBillingService } from './stripe-billing.service';
import { StripeConnectService } from './stripe-connect.service';

@IsPublic()
@Controller('stripe')
export class StripeWebhookController {
    constructor(
        private readonly stripeService: StripeService,
        private readonly stripeBillingService: StripeBillingService,
        private readonly stripeConnectService: StripeConnectService
    ) {}

    @Post('webhook')
    @HttpCode(200)
    async handleWebhook(
        @Req() req: RawBodyRequest,
        @Res() res: Response,
        @Headers('stripe-signature') signature: string
    ) {
        if (!signature) {
            return res.status(400).send('Missing Stripe signature');
        }

        let event;
        try {
            if (!req.rawBody) {
                return res.status(400).send('Missing raw body');
            }
            event = this.stripeService.constructWebhookEvent(req.rawBody, signature);
        } catch (error) {
            return res.status(400).send(`Webhook Error: ${(error as Error).message}`);
        }

        switch (event.type) {
            case 'invoice.paid':
                await this.stripeBillingService.handleInvoicePaid(event);
                break;
            case 'invoice.payment_failed':
                await this.stripeBillingService.handleInvoicePaymentFailed(event);
                break;
            case 'customer.subscription.updated':
                await this.stripeBillingService.handleSubscriptionUpdated(event);
                break;
            case 'customer.subscription.deleted':
                await this.stripeBillingService.handleSubscriptionDeleted(event);
                break;
            case 'checkout.session.completed':
                await this.stripeConnectService.handleCheckoutSessionCompleted(event);
                break;
            case 'account.updated':
                this.stripeConnectService.handleAccountUpdated(event);
                break;
        }

        return res.json({ received: true });
    }
}
