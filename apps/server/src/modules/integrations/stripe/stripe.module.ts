import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MailModule } from '../mail/mail.module';
import { StripeService } from './stripe.service';
import { StripeBillingService } from './stripe-billing.service';
import { StripeConnectService } from './stripe-connect.service';
import { StripeWebhookController } from './stripe-webhook.controller';

@Module({
    imports: [ConfigModule, MailModule],
    controllers: [StripeWebhookController],
    providers: [StripeService, StripeBillingService, StripeConnectService],
    exports: [StripeService],
})
export class StripeModule {}
