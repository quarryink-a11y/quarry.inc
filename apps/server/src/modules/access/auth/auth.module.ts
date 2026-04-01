import 'dotenv/config';

import { Module } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DEFAULT_JWT_EXPIRES_IN } from 'src/shared/constants';
import { UtilityService } from 'src/shared/infrastructure/modules/utilities/utility.service';

import { MailService } from '@/modules/integrations/mail/mail.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthContextService } from './auth-context.service';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET as string,
            signOptions: { expiresIn: DEFAULT_JWT_EXPIRES_IN },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, UtilityService, Logger, MailService, AuthContextService],
    exports: [AuthService, AuthContextService],
})
export class AuthModule {}
