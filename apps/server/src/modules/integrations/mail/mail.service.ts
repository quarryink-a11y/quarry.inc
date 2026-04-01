import 'dotenv/config';

import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { EmailAddressLike, MAIL_TEMPLATES, SendTemplateMailOptions, TemplateName } from './types';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private readonly mailerService: MailerService) {}

    async sendTemplateEmail<TTemplate extends TemplateName>(params: SendTemplateMailOptions<TTemplate>): Promise<void> {
        const { template, to, from, replyTo, subject, context } = params;

        const config = MAIL_TEMPLATES[template];

        try {
            await this.mailerService.sendMail({
                to,
                from: from ?? process.env.SMTP_FROM,
                replyTo,
                subject: subject ?? config.subject,
                template: config.template,
                context,
            });

            this.logger.log(`Email "${template}" sent to ${this.formatEmailAddressLike(to)}`);
        } catch (error) {
            this.logger.error(
                `Failed to send email "${template}" to ${this.formatEmailAddressLike(to)}`,
                error instanceof Error ? error.stack : error
            );
            throw error;
        }
    }

    private formatEmailAddressLike(value: EmailAddressLike): string {
        if (Array.isArray(value)) {
            return value.map((item) => (typeof item === 'string' ? item : `${item.name} <${item.address}>`)).join(', ');
        }

        return typeof value === 'string' ? value : `${value.name} <${value.address}>`;
    }
}
