import { Injectable } from '@nestjs/common';
import { OwnerOnboardingStatus, SiteSection } from 'generated/prisma/enums';

import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';
import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';

const ESSENTIAL_MODULES: SiteSection[] = [
    SiteSection.ARTIST_PROFILE,
    SiteSection.ABOUT,
    SiteSection.HOW_TO_BOOK,
    SiteSection.PORTFOLIO,
    SiteSection.FAQ,
];

@Injectable()
export class ModuleCompletionService {
    constructor(private readonly prisma: PrismaService) {}

    async completeModule(userId: string, module: SiteSection) {
        const owner = await this.prisma.owner.findUnique({
            where: { user_id: userId },
            select: {
                site: {
                    select: {
                        id: true,
                        completed_modules: true,
                        owner_onboarding_status: true,
                    },
                },
            },
        });

        if (!owner?.site) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.SITE_NOT_FOUND,
                message: 'Site not found for current user',
            });
        }

        const { id: siteId, completed_modules, owner_onboarding_status } = owner.site;

        if (completed_modules.includes(module)) {
            return { completed_modules };
        }

        const newModules = [...completed_modules, module];

        const allEssentialComplete = ESSENTIAL_MODULES.every((m) => newModules.includes(m));
        const shouldCompleteOnboarding =
            allEssentialComplete && owner_onboarding_status === OwnerOnboardingStatus.ONBOARDING_STARTED;

        const updated = await this.prisma.site.update({
            where: { id: siteId },
            data: {
                completed_modules: { push: module },
                ...(shouldCompleteOnboarding && {
                    owner_onboarding_status: OwnerOnboardingStatus.ONBOARDING_COMPLETED,
                }),
            },
            select: {
                completed_modules: true,
                owner_onboarding_status: true,
            },
        });

        return updated;
    }
}
