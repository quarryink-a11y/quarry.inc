import { Injectable } from '@nestjs/common';
import { ContentType } from 'generated/prisma/enums';

import { MediaService } from '@/modules/media/media.service';
import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';
import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';
import { SiteContextService } from '@/shared/services/site-context.service';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly siteContext: SiteContextService,
        private readonly mediaService: MediaService
    ) {}

    async create(userId: string, dto: CreateReviewDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const { client_image, ...rest } = dto;

        const review = await this.prisma.review.create({
            data: {
                ...rest,
                client_image_url: client_image?.image_url ?? null,
                client_image_public_id: client_image?.image_public_id ?? null,
                site_id,
            },
        });

        if (client_image) {
            await this.mediaService.confirmAttachment([client_image.image_public_id], site_id);
        }

        return review;
    }

    async findAll(userId: string, type?: ContentType) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const where = type ? { site_id, type } : { site_id };
        return this.prisma.review.findMany({ where });
    }

    async findOne(userId: string, id: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const review = await this.prisma.review.findFirst({ where: { id, site_id } });
        if (!review) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: `Review #${id} not found`,
            });
        }
        return review;
    }

    async update(userId: string, id: string, dto: UpdateReviewDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const { client_image, ...rest } = dto;

        const data: Record<string, unknown> = { ...rest };
        if (client_image) {
            data.client_image_url = client_image.image_url;
            data.client_image_public_id = client_image.image_public_id;
        }

        await this.prisma.review.updateMany({ where: { id, site_id, type: ContentType.DRAFT }, data });

        if (client_image) {
            await this.mediaService.confirmAttachment([client_image.image_public_id], site_id);
        }

        return this.prisma.review.findFirst({ where: { id, site_id } });
    }

    async remove(userId: string, id: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        return this.prisma.review.deleteMany({ where: { id, site_id, type: ContentType.DRAFT } });
    }
}
