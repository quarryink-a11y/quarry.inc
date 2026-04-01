import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';
import { SiteContextService } from '@/shared/services/site-context.service';

import { UpdateSeoDto } from './dto/update-seo.dto';

@Injectable()
export class SeoService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly siteContext: SiteContextService
    ) {}

    async getByCurrentUser(userId: string) {
        const siteId = await this.siteContext.getSiteIdByUser(userId);

        return this.prisma.siteSeo.findUnique({
            where: { site_id: siteId },
        });
    }

    async updateByCurrentUser(userId: string, dto: UpdateSeoDto) {
        const siteId = await this.siteContext.getSiteIdByUser(userId);

        return this.prisma.siteSeo.upsert({
            where: { site_id: siteId },
            update: dto,
            create: {
                site_id: siteId,
                ...dto,
            },
        });
    }
}
