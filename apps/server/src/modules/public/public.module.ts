import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/shared/infrastructure/modules/cloudinary/cloudinary.module';

import { MailModule } from '../integrations/mail/mail.module';
import { StripeModule } from '../integrations/stripe/stripe.module';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';

@Module({
    imports: [MailModule, CloudinaryModule, StripeModule],
    controllers: [PublicController],
    providers: [PublicService],
})
export class PublicModule {}
