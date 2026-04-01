import { Injectable } from '@nestjs/common';
import { ContentType } from 'generated/prisma/enums';

import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';
import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';
import { SiteContextService } from '@/shared/services/site-context.service';

import { CreateBookingStepDto, UpdateBookingStepDto } from './dto';

@Injectable()
export class BookingStepsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly siteContext: SiteContextService
    ) {}

    async create(userId: string, dto: CreateBookingStepDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        return this.prisma.bookingStep.create({
            data: { ...dto, site_id },
        });
    }

    async findAll(userId: string, type?: ContentType) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const where = type ? { site_id, type } : { site_id };
        return this.prisma.bookingStep.findMany({ where, orderBy: { sort_order: 'asc' } });
    }

    async findOne(userId: string, id: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const step = await this.prisma.bookingStep.findFirst({ where: { id, site_id } });
        if (!step) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: `Booking step not found`,
            });
        }
        return step;
    }

    async update(userId: string, id: string, dto: UpdateBookingStepDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const step = await this.prisma.bookingStep.findFirst({ where: { id, site_id, type: ContentType.DRAFT } });
        if (!step) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: `Booking step not found`,
            });
        }
        return this.prisma.bookingStep.update({ where: { id }, data: dto });
    }

    async remove(userId: string, id: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const step = await this.prisma.bookingStep.findFirst({ where: { id, site_id, type: ContentType.DRAFT } });
        if (!step) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: `Booking step not found`,
            });
        }
        return this.prisma.bookingStep.delete({ where: { id } });
    }
}
