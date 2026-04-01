import { Injectable } from '@nestjs/common';
import { ContentType } from 'generated/prisma/enums';

import { MediaService } from '@/modules/media/media.service';
import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';
import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';
import { SiteContextService } from '@/shared/services/site-context.service';

import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfoliosService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly siteContext: SiteContextService,
        private readonly mediaService: MediaService
    ) {}

    async create(userId: string, dto: CreatePortfolioDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const { image, ...rest } = dto;

        const portfolio = await this.prisma.portfolio.create({
            data: {
                ...rest,
                image_url: image.image_url,
                image_public_id: image.image_public_id,
                site_id,
            },
        });

        await this.mediaService.confirmAttachment([image.image_public_id], site_id);

        return portfolio;
    }

    async findAll(userId: string, type?: ContentType) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const where = type ? { site_id, type } : { site_id };
        return this.prisma.portfolio.findMany({ where });
    }

    async findOne(userId: string, id: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const portfolio = await this.prisma.portfolio.findFirst({ where: { id, site_id } });
        if (!portfolio) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: `Portfolio #${id} not found`,
            });
        }
        return portfolio;
    }

    async update(userId: string, id: string, dto: UpdatePortfolioDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const { image, ...rest } = dto;

        const data: Record<string, unknown> = { ...rest };
        if (image) {
            data.image_url = image.image_url;
            data.image_public_id = image.image_public_id;
        }

        await this.prisma.portfolio.updateMany({ where: { id, site_id, type: ContentType.DRAFT }, data });

        if (image) {
            await this.mediaService.confirmAttachment([image.image_public_id], site_id);
        }

        return this.prisma.portfolio.findFirst({ where: { id, site_id } });
    }

    async remove(userId: string, id: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        return this.prisma.portfolio.deleteMany({ where: { id, site_id, type: ContentType.DRAFT } });
    }
}
