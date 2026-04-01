import { Module } from '@nestjs/common';

import { AuthModule } from '../access/auth/auth.module';
import { MailModule } from '../integrations/mail/mail.module';
import { StripeModule } from '../integrations/stripe/stripe.module';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

@Module({
    imports: [AuthModule, StripeModule, MailModule],
    controllers: [BillingController],
    providers: [BillingService],
})
export class BillingModule {}
