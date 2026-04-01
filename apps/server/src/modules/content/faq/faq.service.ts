import { Injectable } from '@nestjs/common';
import { ContentType } from 'generated/prisma/enums';

import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';
import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';
import { SiteContextService } from '@/shared/services/site-context.service';

import { CreateFaqCategoryDto, CreateFaqItemDto, UpdateFaqCategoryDto, UpdateFaqItemDto } from './dto';

@Injectable()
export class FaqService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly siteContext: SiteContextService
    ) {}

    async createCategory(userId: string, dto: CreateFaqCategoryDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        return this.prisma.faqCategory.create({
            data: { ...dto, site_id },
        });
    }

    async getCategories(userId: string, type?: ContentType) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const where = type ? { site_id, type } : { site_id };
        return this.prisma.faqCategory.findMany({
            where,
            include: { items: { orderBy: { sort_order: 'asc' } } },
            orderBy: { sort_order: 'asc' },
        });
    }

    async updateCategory(userId: string, id: string, dto: UpdateFaqCategoryDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const category = await this.prisma.faqCategory.findFirst({ where: { id, site_id, type: ContentType.DRAFT } });
        if (!category) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: `FAQ category not found`,
            });
        }
        return this.prisma.faqCategory.update({ where: { id }, data: dto });
    }

    async deleteCategory(userId: string, id: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const category = await this.prisma.faqCategory.findFirst({ where: { id, site_id, type: ContentType.DRAFT } });
        if (!category) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: `FAQ category not found`,
            });
        }
        return this.prisma.faqCategory.delete({ where: { id } });
    }

    async createItem(userId: string, dto: CreateFaqItemDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const category = await this.prisma.faqCategory.findFirst({
            where: { id: dto.category_id, site_id },
        });
        if (!category) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: `FAQ category not found`,
            });
        }
        return this.prisma.faqItem.create({
            data: {
                category_id: dto.category_id,
                question: dto.question,
                answer: dto.answer,
                sort_order: dto.sort_order,
            },
        });
    }

    async updateItem(userId: string, id: string, dto: UpdateFaqItemDto) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const item = await this.prisma.faqItem.findFirst({
            where: { id, category: { site_id } },
        });
        if (!item) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: `FAQ item not found`,
            });
        }
        const { category_id: _category_id, ...updateData } = dto;
        return this.prisma.faqItem.update({ where: { id }, data: updateData });
    }

    async deleteItem(userId: string, id: string) {
        const site_id = await this.siteContext.getSiteIdByUser(userId);
        const item = await this.prisma.faqItem.findFirst({
            where: { id, category: { site_id } },
        });
        if (!item) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: `FAQ item not found`,
            });
        }
        return this.prisma.faqItem.delete({ where: { id } });
    }
}
