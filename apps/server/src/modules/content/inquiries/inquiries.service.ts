import { Injectable } from '@nestjs/common';
import { InquiryStatus } from 'generated/prisma/enums';

import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';
import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';
import { SiteContextService } from '@/shared/services/site-context.service';

import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';

@Injectable()
export class InquiriesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly siteContext: SiteContextService
    ) {}

    async create(userId: string, dto: CreateInquiryDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        return this.prisma.inquiry.create({
            data: { ...dto, site_id },
        });
    }

    async findAll(userId: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        return this.prisma.inquiry.findMany({
            where: { site_id },
            orderBy: { created_at: 'desc' },
        });
    }

    async findOne(userId: string, id: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const inquiry = await this.prisma.inquiry.findFirst({ where: { id, site_id } });
        if (!inquiry) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: `Inquiry #${id} not found`,
            });
        }
        return inquiry;
    }

    async update(userId: string, id: string, dto: UpdateInquiryDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);

        const data: { status?: InquiryStatus; final_price?: number } = {};

        if (dto.final_price !== undefined) {
            data.final_price = dto.final_price;
            data.status = InquiryStatus.COMPLETED;
        } else if (dto.status === InquiryStatus.COMPLETED) {
            const existing = await this.prisma.inquiry.findFirst({
                where: { id, site_id },
                select: { final_price: true },
            });
            if (!existing?.final_price) {
                throw new AppException({
                    status: HttpStatus.BAD_REQUEST,
                    code: ErrorCode.VALIDATION_ERROR,
                    message: 'Cannot set status to COMPLETED without a final price',
                });
            }
            data.status = InquiryStatus.COMPLETED;
        } else if (dto.status !== undefined) {
            data.status = dto.status;
        }

        await this.prisma.inquiry.updateMany({ where: { id, site_id }, data });
        return this.prisma.inquiry.findFirst({ where: { id, site_id } });
    }

    async remove(userId: string, id: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        return this.prisma.inquiry.deleteMany({ where: { id, site_id } });
    }
}
