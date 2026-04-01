import { Injectable } from '@nestjs/common';

import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';
import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';
import { SiteContextService } from '@/shared/services/site-context.service';

import { UpdateSiteDomainDto } from './dto/update-site-domain.dto';

@Injectable()
export class SiteDomainService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly siteContext: SiteContextService
    ) {}

    async getByCurrentUser(userId: string) {
        const siteId = await this.siteContext.getSiteIdByUser(userId);

        const domain = await this.prisma.siteDomain.findUnique({
            where: { site_id: siteId },
        });

        if (!domain) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: 'Site domain not found',
            });
        }

        return domain;
    }

    async updateByCurrentUser(userId: string, dto: UpdateSiteDomainDto) {
        const siteId = await this.siteContext.getSiteIdByUser(userId);

        return this.prisma.siteDomain.upsert({
            where: { site_id: siteId },
            update: dto,
            create: {
                site_id: siteId,
                host: dto.host ?? '',
                kind: dto.kind ?? 'PLATFORM_SUBDOMAIN',
                ...dto,
            },
        });
    }
}
