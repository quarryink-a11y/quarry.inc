import { Injectable, Logger } from '@nestjs/common';
import { ContentType, ReferralSource } from 'generated/prisma/enums';
import { CloudinaryService } from 'src/shared/infrastructure/modules/cloudinary/cloudinary.service';
import { PrismaService } from 'src/shared/infrastructure/modules/prisma/prisma.service';

import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';

import { MailService } from '../integrations/mail/mail.service';
import { StripeService } from '../integrations/stripe/stripe.service';
import { PublicCheckoutDto } from './dto/public-checkout.dto';
import { PublicMediaUploadResponseDto } from './dto/public-media-upload-response.dto';
import { SubmitInquiryDto } from './dto/submit-inquiry.dto';

@Injectable()
export class PublicService {
    private readonly logger = new Logger(PublicService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly mailService: MailService,
        private readonly cloudinary: CloudinaryService,
        private readonly stripeService: StripeService
    ) {}

    async getSiteInfo(siteId: string) {
        const site = await this.prisma.site.findUnique({
            where: { id: siteId },
            select: {
                id: true,
                onboarding_template: {
                    select: { kind: true },
                },
                settings: {
                    select: {
                        logo_url: true,
                        analytics_enabled: true,
                        site_sections: true,
                    },
                },
                site_domain: {
                    select: {
                        host: true,
                        kind: true,
                        is_primary: true,
                    },
                },
                owner: {
                    select: {
                        profile: {
                            select: {
                                full_name: true,
                                description: true,
                                country: true,
                                city: true,
                                studio_name: true,
                                studio_address: true,
                                email: true,
                                phone: true,
                                photo_url: true,
                                studio_photo_url: true,
                                about_text: true,
                                about_blocks: true,
                                about_photo_url: true,
                                social_media: true,
                            },
                        },
                    },
                },
                billing: {
                    select: { stripe_connect_account_id: true },
                },
            },
        });

        if (!site) return null;

        return {
            id: site.id,
            kind: site.onboarding_template?.kind ?? null,
            settings: site.settings,
            site_domain: site.site_domain,
            profile: site.owner.profile,
            stripe_connect_enabled: !!site.billing?.[0]?.stripe_connect_account_id,
        };
    }

    async createCheckout(siteId: string, dto: PublicCheckoutDto) {
        const billing = await this.prisma.siteBilling.findFirst({
            where: { site_id: siteId },
            select: { stripe_connect_account_id: true },
        });

        if (!billing?.stripe_connect_account_id) {
            throw new AppException({
                status: HttpStatus.BAD_REQUEST,
                code: ErrorCode.CONNECT_NOT_SETUP,
                message: 'Store payments are not configured',
            });
        }

        const catalogItems = await this.prisma.catalog.findMany({
            where: {
                id: { in: dto.items.map((i) => i.id) },
                site_id: siteId,
                is_active: true,
            },
        });

        const lineItems = dto.items.map((reqItem) => {
            const catalog = catalogItems.find((c) => c.id === reqItem.id);
            if (!catalog) {
                throw new AppException({
                    status: HttpStatus.BAD_REQUEST,
                    code: ErrorCode.CATALOG_ITEM_NOT_FOUND,
                    message: `Catalog item ${reqItem.id} not found`,
                });
            }

            // Use client price only for gift certificates, otherwise use DB price
            const isGiftCert = catalog.category === 'GIFT_CERTIFICATE';
            const unitPrice = isGiftCert && reqItem.price ? reqItem.price : Number(catalog.price);

            return {
                name: catalog.name,
                unitAmount: Math.round(unitPrice * 100),
                currency: catalog.currency.toLowerCase(),
                quantity: reqItem.quantity,
                images: catalog.image_url ? [catalog.image_url] : undefined,
            };
        });

        const totalCents = lineItems.reduce((sum, li) => sum + li.unitAmount * li.quantity, 0);
        const applicationFee = Math.round(totalCents * 0.05); // 5% platform fee

        const session = await this.stripeService.createCheckoutSession({
            lineItems,
            successUrl: dto.success_url,
            cancelUrl: dto.cancel_url,
            connectedAccountId: billing.stripe_connect_account_id,
            applicationFeeAmount: applicationFee,
            metadata: {
                siteId,
                itemIds: dto.items.map((i) => i.id).join(','),
            },
        });

        return { url: session.url };
    }

    async submitInquiry(siteId: string, dto: SubmitInquiryDto) {
        try {
            const inquiry = await this.prisma.inquiry.create({
                data: {
                    site_id: siteId,
                    first_name: dto.first_name,
                    last_name: dto.last_name ?? '',
                    client_email: dto.client_email,
                    client_phone: dto.client_phone ?? '',
                    idea_description: dto.idea_description ?? '',
                    placement: dto.placement ?? '',
                    size_value: dto.size_value ? Number(dto.size_value) : 0,
                    size_unit: dto.size_unit ?? '',
                    preferred_date: dto.preferred_date
                        ? new Date(dto.preferred_date).toISOString()
                        : new Date().toISOString(),
                    city: dto.city ?? '',
                    referral_source: dto.referral_source ?? ReferralSource.OTHER,
                    inspiration_urls: dto.inspiration_urls ?? [],
                },
            });

            await this.sendInquiryNotification(siteId, dto);

            return inquiry;
        } catch (error) {
            this.logger.error('submitInquiry failed', error instanceof Error ? error.stack : error);
            throw error;
        }
    }

    async uploadInquiryMedia(siteId: string, file: Express.Multer.File): Promise<PublicMediaUploadResponseDto> {
        const uploaded = await this.cloudinary.uploadBuffer({
            buffer: file.buffer,
            filename: file.originalname,
            mimetype: file.mimetype,
            folder: `inquiries_${siteId}`,
        });

        return { fileUrl: uploaded.secure_url };
    }

    async getSiteContent(siteId: string) {
        const settings = await this.prisma.siteSettings.findUnique({
            where: { site_id: siteId },
            select: { site_sections: true },
        });
        const sections = (settings?.site_sections as Record<string, boolean>) ?? {};

        const publishedWhere = { site_id: siteId, type: ContentType.PUBLISHED };

        const [portfolios, designs, events, reviews, catalogs, faqCategories, bookingSteps] = await Promise.all([
            sections.PORTFOLIO !== false
                ? this.prisma.portfolio.findMany({ where: publishedWhere, orderBy: { created_at: 'desc' } })
                : [],
            sections.DESIGNS !== false
                ? this.prisma.design.findMany({ where: publishedWhere, orderBy: { created_at: 'desc' } })
                : [],
            sections.EVENTS !== false
                ? this.prisma.event.findMany({ where: publishedWhere, orderBy: { start_at: 'asc' } })
                : [],
            sections.REVIEWS !== false
                ? this.prisma.review.findMany({ where: publishedWhere, orderBy: { created_at: 'desc' } })
                : [],
            sections.CATALOG !== false
                ? this.prisma.catalog.findMany({
                      where: { ...publishedWhere, is_active: true },
                      orderBy: { created_at: 'desc' },
                  })
                : [],
            sections.FAQ !== false
                ? this.prisma.faqCategory.findMany({
                      where: publishedWhere,
                      include: { items: { orderBy: { sort_order: 'asc' } } },
                      orderBy: { sort_order: 'asc' },
                  })
                : [],
            sections.HOW_TO_BOOK !== false
                ? this.prisma.bookingStep.findMany({
                      where: publishedWhere,
                      orderBy: { sort_order: 'asc' },
                  })
                : [],
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

    private async sendInquiryNotification(siteId: string, dto: SubmitInquiryDto): Promise<void> {
        try {
            const site = await this.prisma.site.findUnique({
                where: { id: siteId },
                select: { owner: { select: { user: { select: { email: true } } } } },
            });

            const ownerEmail = site?.owner?.user?.email;
            if (!ownerEmail) return;

            const inspirationUrls = dto.inspiration_urls ?? [];
            const clientName = [dto.first_name, dto.last_name].filter(Boolean).join(' ');
            const size = [dto.size_value, dto.size_unit].filter(Boolean).join(' ');

            await this.mailService.sendTemplateEmail({
                template: 'newInquiry',
                to: ownerEmail,
                replyTo: dto.client_email,
                subject: `New inquiry from ${clientName}`,
                context: {
                    clientName,
                    clientEmail: dto.client_email,
                    clientPhone: dto.client_phone ?? '',
                    firstName: dto.first_name,
                    lastName: dto.last_name ?? '',
                    ideaDescription: dto.idea_description ?? '',
                    placement: dto.placement ?? '',
                    size,
                    preferredDate: dto.preferred_date ?? '',
                    city: dto.city ?? '',
                    referralSource: dto.referral_source ?? '',
                    hasInspiration: inspirationUrls.length > 0,
                    inspirationUrls,
                },
            });
        } catch (error) {
            this.logger.error(
                'Failed to send inquiry notification email',
                error instanceof Error ? error.stack : error
            );
        }
    }
}
