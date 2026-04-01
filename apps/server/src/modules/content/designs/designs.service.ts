import { Injectable } from '@nestjs/common';
import { ContentType } from 'generated/prisma/enums';

import { MediaService } from '@/modules/media/media.service';
import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';
import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';
import { SiteContextService } from '@/shared/services/site-context.service';

import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';

@Injectable()
export class DesignsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly siteContext: SiteContextService,
        private readonly mediaService: MediaService
    ) {}

    async create(userId: string, dto: CreateDesignDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const { image, ...rest } = dto;

        const design = await this.prisma.design.create({
            data: {
                ...rest,
                image_url: image.image_url,
                image_public_id: image.image_public_id,
                site_id,
            },
        });

        await this.mediaService.confirmAttachment([image.image_public_id], site_id);

        return design;
    }

    async findAll(userId: string, type?: ContentType) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const where = type ? { site_id, type } : { site_id };
        return this.prisma.design.findMany({ where });
    }

    async findOne(userId: string, id: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const design = await this.prisma.design.findFirst({ where: { id, site_id } });
        if (!design) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: `Design #${id} not found`,
            });
        }
        return design;
    }

    async update(userId: string, id: string, dto: UpdateDesignDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const { image, ...rest } = dto;

        const data: Record<string, unknown> = { ...rest };
        if (image) {
            data.image_url = image.image_url;
            data.image_public_id = image.image_public_id;
        }

        await this.prisma.design.updateMany({ where: { id, site_id, type: ContentType.DRAFT }, data });

        if (image) {
            await this.mediaService.confirmAttachment([image.image_public_id], site_id);
        }

        return this.prisma.design.findFirst({ where: { id, site_id } });
    }

    async remove(userId: string, id: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        return this.prisma.design.deleteMany({ where: { id, site_id, type: ContentType.DRAFT } });
    }
}
