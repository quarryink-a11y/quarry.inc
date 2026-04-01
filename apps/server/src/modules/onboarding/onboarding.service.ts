import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DomainKind, OnboardingStatus, SiteSection } from 'generated/prisma/enums';

import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';
import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';
import { UtilityService } from '@/shared/infrastructure/modules/utilities/utility.service';

import { AuthContextService } from '../access/auth/auth-context.service';
import { OnboardingCompleteProfileDto, OnboardingSelectTemplateDto } from './dto';
import { slugify } from './utils/slugify';

const OPTIONAL_SECTIONS: SiteSection[] = [
    SiteSection.EVENTS,
    SiteSection.REVIEWS,
    SiteSection.CATALOG,
    SiteSection.DESIGNS,
];

const MAX_SLUG_ATTEMPTS = 10;

@Injectable()
export class OnboardingService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authContextService: AuthContextService,
        private readonly configService: ConfigService,
        private readonly util: UtilityService
    ) {}

    async selectTemplate(userId: string, dto: OnboardingSelectTemplateDto) {
        const { onboardingTemplateId } = dto;
        const { site } = await this.authContextService.getUserOwnerSiteOrThrow(userId);

        const onboardingTemplate = await this.prisma.onboardingTemplate.findFirst({
            where: {
                id: onboardingTemplateId,
                is_active: true,
            },
        });

        if (!onboardingTemplate) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: 'Onboarding template not found',
            });
        }

        const siteSections = Object.fromEntries(
            onboardingTemplate.sections.map((s) => [s, !OPTIONAL_SECTIONS.includes(s)])
        );
        const [updatedSite] = await this.prisma.$transaction([
            this.prisma.site.update({
                where: { id: site.id },
                data: {
                    onboarding_template_id: onboardingTemplateId,
                    onboarding_status: OnboardingStatus.TEMPLATE_SELECTED,
                },
                include: {
                    onboarding_template: true,
                },
            }),

            this.prisma.siteSettings.upsert({
                where: { site_id: site.id },
                update: {
                    site_sections: siteSections,
                },
                create: {
                    site_id: site.id,
                    site_sections: siteSections,
                },
            }),
        ]);

        return {
            site: updatedSite,
            success: true,
        };
    }

    async completeProfile(userId: string, dto: OnboardingCompleteProfileDto) {
        const { owner, site } = await this.authContextService.getUserOwnerSiteOrThrow(userId);

        if (site.onboarding_status !== OnboardingStatus.TEMPLATE_SELECTED) {
            throw new AppException({
                status: HttpStatus.BAD_REQUEST,
                code: ErrorCode.INVALID_ONBOARDING_STATE,
                message: `Expected onboarding status TEMPLATE_SELECTED, got ${site.onboarding_status}`,
            });
        }

        const slug = await this.resolveUniqueSlug(dto.fullName);

        await this.prisma.$transaction([
            this.prisma.ownerProfile.upsert({
                where: { owner_id: owner.id },
                create: {
                    owner_id: owner.id,
                    full_name: dto.fullName,
                    description: dto.description,
                    country: dto.country,
                    city: dto.city,
                    studio_name: dto.studioName,
                    studio_address: dto.studioAddress,
                    phone: dto.phone,
                    email: dto.email,
                    social_media: this.util.stripUndefined(dto.socialMedia) ?? {},
                    photo_url: dto.photoUrl,
                    studio_photo_url: dto.studioPhotoUrl,
                },
                update: {
                    full_name: dto.fullName,
                    description: dto.description,
                    country: dto.country,
                    city: dto.city,
                    studio_name: dto.studioName,
                    studio_address: dto.studioAddress,
                    phone: dto.phone,
                    email: dto.email,
                    social_media: this.util.stripUndefined(dto.socialMedia) ?? {},
                    photo_url: dto.photoUrl,
                    studio_photo_url: dto.studioPhotoUrl,
                },
            }),
            this.prisma.siteDomain.upsert({
                where: { host: slug },
                update: {
                    host: slug,
                },
                create: {
                    host: slug,
                    site_id: site.id,
                    kind: DomainKind.PLATFORM_SUBDOMAIN,
                    is_primary: true,
                    is_verified: true,
                },
            }),
            this.prisma.site.update({
                where: { id: site.id },
                data: { onboarding_status: OnboardingStatus.PROFILE_COMPLETED },
            }),
        ]);

        const baseDomain = this.configService.getOrThrow<string>('PLATFORM_BASE_DOMAIN');
        const siteUrl = `${baseDomain}/${slug}`;

        return {
            success: true,
            slug,
            siteUrl,
        };
    }

    async launchSite(userId: string) {
        const { site } = await this.authContextService.getUserOwnerSiteOrThrow(userId);

        if (site.onboarding_status !== OnboardingStatus.BILLING_SETUP_COMPLETED) {
            throw new AppException({
                status: HttpStatus.BAD_REQUEST,
                code: ErrorCode.INVALID_ONBOARDING_STATE,
                message: `Expected onboarding status BILLING_SETUP_COMPLETED, got ${site.onboarding_status}`,
            });
        }

        await this.prisma.site.update({
            where: { id: site.id },
            data: {
                status: 'ACTIVE',
                onboarding_status: OnboardingStatus.ONBOARDING_COMPLETED,
            },
        });

        return { success: true };
    }

    private async resolveUniqueSlug(fullName: string): Promise<string> {
        const baseSlug = slugify(fullName);

        if (!baseSlug) {
            throw new AppException({
                status: HttpStatus.BAD_REQUEST,
                code: ErrorCode.VALIDATION_ERROR,
                message: 'Cannot generate slug from provided name',
            });
        }

        const existing = await this.prisma.siteDomain.findUnique({
            where: { host: baseSlug },
        });

        if (!existing) {
            return baseSlug;
        }

        for (let i = 2; i <= MAX_SLUG_ATTEMPTS + 1; i++) {
            const candidate = `${baseSlug}-${i}`;
            const taken = await this.prisma.siteDomain.findUnique({
                where: { host: candidate },
            });

            if (!taken) {
                return candidate;
            }
        }

        throw new AppException({
            status: HttpStatus.CONFLICT,
            code: ErrorCode.SLUG_UNAVAILABLE,
            message: `Unable to generate unique slug for "${fullName}"`,
        });
    }
}
