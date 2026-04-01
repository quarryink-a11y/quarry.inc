import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { join } from 'path';

import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
    imports: [
        ConfigModule,
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const host = configService.get<string>('SMTP_HOST');
                const port = configService.get<number>('SMTP_PORT');
                const secure = configService.get<boolean>('SMTP_SECURE');
                const user = configService.get<string>('SMTP_USER');

                return {
                    transport: {
                        host,
                        port,
                        secure,
                        from: configService.get<string>('SMTP_FROM'),
                        auth: {
                            user,
                            pass: configService.get<string>('SMTP_PASS'),
                        },
                    },
                    template: {
                        dir: join(__dirname, 'templates'),
                        adapter: new HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                };
            },
        }),
    ],
    controllers: [MailController],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
