import { Injectable } from '@nestjs/common';
import { ContentType } from 'generated/prisma/enums';

import { MediaService } from '@/modules/media/media.service';
import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';
import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';
import { SiteContextService } from '@/shared/services/site-context.service';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly siteContext: SiteContextService,
        private readonly mediaService: MediaService
    ) {}

    async create(userId: string, dto: CreateEventDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const { image, start_at, end_at, ...rest } = dto;

        const event = await this.prisma.event.create({
            data: {
                ...rest,
                start_at: new Date(start_at),
                end_at: end_at ? new Date(end_at) : null,
                image_url: image.image_url,
                image_public_id: image.image_public_id,
                site_id,
            },
        });

        await this.mediaService.confirmAttachment([image.image_public_id], site_id);

        return event;
    }

    async findAll(userId: string, type?: ContentType) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const where = type ? { site_id, type } : { site_id };
        return this.prisma.event.findMany({ where });
    }

    async findOne(userId: string, id: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const event = await this.prisma.event.findFirst({ where: { id, site_id } });
        if (!event) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: `Event #${id} not found`,
            });
        }
        return event;
    }

    async update(userId: string, id: string, dto: UpdateEventDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const { image, start_at, end_at, ...rest } = dto;

        const data: Record<string, unknown> = { ...rest };
        if (start_at) data.start_at = new Date(start_at);
        if (end_at !== undefined) data.end_at = end_at ? new Date(end_at) : null;
        if (image) {
            data.image_url = image.image_url;
            data.image_public_id = image.image_public_id;
        }

        await this.prisma.event.updateMany({ where: { id, site_id, type: ContentType.DRAFT }, data });

        if (image) {
            await this.mediaService.confirmAttachment([image.image_public_id], site_id);
        }

        return this.prisma.event.findFirst({ where: { id, site_id } });
    }

    async remove(userId: string, id: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        return this.prisma.event.deleteMany({ where: { id, site_id, type: ContentType.DRAFT } });
    }
}
