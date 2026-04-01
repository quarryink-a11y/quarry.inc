import { Injectable } from '@nestjs/common';
import { ContentType } from 'generated/prisma/enums';

import { MediaService } from '@/modules/media/media.service';
import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';
import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';
import { SiteContextService } from '@/shared/services/site-context.service';

import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';

@Injectable()
export class CatalogsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly siteContext: SiteContextService,
        private readonly mediaService: MediaService
    ) {}

    async create(userId: string, dto: CreateCatalogDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const { image, ...rest } = dto;

        const catalog = await this.prisma.catalog.create({
            data: {
                ...rest,
                image_url: image.image_url,
                image_public_id: image.image_public_id,
                site_id,
            },
        });

        await this.mediaService.confirmAttachment([image.image_public_id], site_id);

        return catalog;
    }

    async findAll(userId: string, type?: ContentType) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const where = type ? { site_id, type } : { site_id };
        return this.prisma.catalog.findMany({ where, orderBy: { created_at: 'desc' } });
    }

    async findOne(userId: string, id: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const catalog = await this.prisma.catalog.findFirst({ where: { id, site_id } });
        if (!catalog) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: `Catalog item #${id} not found`,
            });
        }
        return catalog;
    }

    async update(userId: string, id: string, dto: UpdateCatalogDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const { image, ...rest } = dto;

        const data: Record<string, unknown> = { ...rest };
        if (image) {
            data.image_url = image.image_url;
            data.image_public_id = image.image_public_id;
        }

        await this.prisma.catalog.updateMany({ where: { id, site_id, type: ContentType.DRAFT }, data });

        if (image) {
            await this.mediaService.confirmAttachment([image.image_public_id], site_id);
        }

        return this.prisma.catalog.findFirst({ where: { id, site_id } });
    }

    async remove(userId: string, id: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        return this.prisma.catalog.deleteMany({ where: { id, site_id, type: ContentType.DRAFT } });
    }

    async findAllOrders(userId: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);

        const catalogIds = await this.prisma.catalog.findMany({
            where: { site_id },
            select: { id: true },
        });

        if (catalogIds.length === 0) return [];

        return this.prisma.order.findMany({
            where: { catalog_id: { in: catalogIds.map((c) => c.id) } },
            include: { items: true },
            orderBy: { created_at: 'desc' },
        });
    }
}
