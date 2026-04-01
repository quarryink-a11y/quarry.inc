import { Injectable } from '@nestjs/common';
import { ContentType } from 'generated/prisma/enums';

import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';
import { SiteContextService } from '@/shared/services/site-context.service';

import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SiteService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly siteContext: SiteContextService
    ) {}

    async getByCurrentUser(userId: string) {
        const siteId = await this.siteContext.getSiteIdByUser(userId);

        const site = await this.prisma.site.findUnique({
            where: { id: siteId },
            select: {
                id: true,
                status: true,
                onboarding_status: true,
                owner_onboarding_status: true,
                completed_modules: true,
                published_at: true,
                onboarding_template: { select: { kind: true } },
            },
        });

        if (!site) return null;
        return { ...site, template_kind: site.onboarding_template?.kind ?? null };
    }

    async updateByCurrentUser(userId: string, dto: UpdateSiteDto) {
        const siteId = await this.siteContext.getSiteIdByUser(userId);

        const site = await this.prisma.site.update({
            where: { id: siteId },
            data: dto,
            select: {
                id: true,
                status: true,
                onboarding_status: true,
                owner_onboarding_status: true,
                completed_modules: true,
                published_at: true,
                onboarding_template: { select: { kind: true } },
            },
        });

        return { ...site, template_kind: site.onboarding_template?.kind ?? null };
    }

    async publishAll(userId: string) {
        const siteId = await this.siteContext.getSiteIdByUser(userId);

        return this.prisma.$transaction(async (tx) => {
            const deleteWhere = { site_id: siteId, type: ContentType.PUBLISHED };
            const draftWhere = { site_id: siteId, type: ContentType.DRAFT };

            // 1. Delete all PUBLISHED records
            await Promise.all([
                tx.portfolio.deleteMany({ where: deleteWhere }),
                tx.design.deleteMany({ where: deleteWhere }),
                tx.event.deleteMany({ where: deleteWhere }),
                tx.review.deleteMany({ where: deleteWhere }),
                tx.catalog.deleteMany({ where: deleteWhere }),
                tx.faqCategory.deleteMany({ where: deleteWhere }),
                tx.bookingStep.deleteMany({ where: deleteWhere }),
            ]);

            // 2. Fetch all DRAFT records
            const [portfolios, designs, events, reviews, catalogs, faqCategories, bookingSteps] = await Promise.all([
                tx.portfolio.findMany({ where: draftWhere }),
                tx.design.findMany({ where: draftWhere }),
                tx.event.findMany({ where: draftWhere }),
                tx.review.findMany({ where: draftWhere }),
                tx.catalog.findMany({ where: draftWhere }),
                tx.faqCategory.findMany({ where: draftWhere, include: { items: true } }),
                tx.bookingStep.findMany({ where: draftWhere }),
            ]);

            // 3. Clone simple models as PUBLISHED

            const cloneSimple = (
                items: Array<Record<string, unknown> & { id: string; created_at: Date; updated_at: Date }>,
                model: { create(args: { data: Record<string, unknown> }): Promise<unknown> }
            ) =>
                Promise.all(
                    items.map(({ id: _id, created_at: _ca, updated_at: _ua, ...data }) =>
                        model.create({ data: { ...data, type: ContentType.PUBLISHED } })
                    )
                );

            await Promise.all([
                cloneSimple(portfolios, tx.portfolio),
                cloneSimple(designs, tx.design),
                cloneSimple(events, tx.event),
                cloneSimple(reviews, tx.review),
                cloneSimple(catalogs, tx.catalog),
                cloneSimple(bookingSteps, tx.bookingStep),
            ]);

            // 4. Clone FaqCategory + FaqItems (nested, needs ID remapping)
            for (const cat of faqCategories) {
                const { id: _id, created_at: _ca, updated_at: _ua, items, ...catData } = cat;
                const newCat = await tx.faqCategory.create({
                    data: { ...catData, type: ContentType.PUBLISHED },
                });
                if (items.length) {
                    await tx.faqItem.createMany({
                        data: items.map(
                            ({ id: _iid, category_id: _cid, created_at: _ica, updated_at: _iua, ...itemData }) => ({
                                ...itemData,
                                category_id: newCat.id,
                            })
                        ),
                    });
                }
            }

            // 5. Update published_at
            const publishedAt = new Date();
            await tx.site.update({
                where: { id: siteId },
                data: { published_at: publishedAt },
            });

            return {
                published_at: publishedAt.toISOString(),
                counts: {
                    portfolios: portfolios.length,
                    designs: designs.length,
                    events: events.length,
                    reviews: reviews.length,
                    catalogs: catalogs.length,
                    faq_categories: faqCategories.length,
                    booking_steps: bookingSteps.length,
                },
            };
        });
    }

    async getContent(userId: string, type: ContentType) {
        const siteId = await this.siteContext.getSiteIdByUser(userId);
        const where = { site_id: siteId, type };

        const [portfolios, designs, events, reviews, catalogs, faqCategories, bookingSteps] = await Promise.all([
            this.prisma.portfolio.findMany({ where, orderBy: { created_at: 'desc' } }),
            this.prisma.design.findMany({ where, orderBy: { created_at: 'desc' } }),
            this.prisma.event.findMany({ where, orderBy: { start_at: 'asc' } }),
            this.prisma.review.findMany({ where, orderBy: { created_at: 'desc' } }),
            this.prisma.catalog.findMany({ where, orderBy: { created_at: 'desc' } }),
            this.prisma.faqCategory.findMany({
                where,
                include: { items: { orderBy: { sort_order: 'asc' } } },
                orderBy: { sort_order: 'asc' },
            }),
            this.prisma.bookingStep.findMany({ where, orderBy: { sort_order: 'asc' } }),
        ]);

        return {
            portfolios,
            designs,
            events,
            reviews,
            catalogs,
            faq_categories: faqCategories,
            booking_steps: bookingSteps,
        };
    }
}
