import { Injectable } from '@nestjs/common';

import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';
import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';

@Injectable()
export class SiteContextService {
    constructor(private readonly prisma: PrismaService) {}

    async getSiteIdByUser(userId: string): Promise<string> {
        const owner = await this.prisma.owner.findUnique({
            where: { user_id: userId },
            select: { site: { select: { id: true } } },
        });

        if (!owner?.site) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.SITE_NOT_FOUND,
                message: 'Site not found for current user',
            });
        }

        return owner.site.id;
    }
}
