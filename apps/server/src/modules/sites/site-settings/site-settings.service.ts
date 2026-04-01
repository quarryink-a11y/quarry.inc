import { Injectable } from '@nestjs/common';

import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';
import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';
import { UtilityService } from '@/shared/infrastructure/modules/utilities/utility.service';
import { SiteContextService } from '@/shared/services/site-context.service';

import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SiteSettingsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly siteContext: SiteContextService,
        private readonly util: UtilityService
    ) {}

    async getByCurrentUser(userId: string) {
        const siteId = await this.siteContext.getSiteIdByUser(userId);
        const settings = await this.prisma.siteSettings.findUnique({
            where: { site_id: siteId },
        });

        if (!settings) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: 'Site settings not found',
            });
        }

        return settings;
    }

    async updateByCurrentUser(userId: string, dto: UpdateSettingsDto) {
        const siteId = await this.siteContext.getSiteIdByUser(userId);

        const data = {
            ...dto,
            site_sections: this.util.stripUndefined(dto.site_sections) ?? undefined,
        };

        return this.prisma.siteSettings.upsert({
            where: { site_id: siteId },
            update: data,
            create: { site_id: siteId, ...data },
        });
    }
}
