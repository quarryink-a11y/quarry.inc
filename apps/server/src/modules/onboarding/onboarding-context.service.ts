import { Injectable } from '@nestjs/common';
import { OnboardingStatus } from 'generated/prisma/enums';

import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';

import { AuthContextService } from '../access/auth/auth-context.service';
import type { OnboardingNavigationDto } from './entities/onboarding-context-response.dto';

enum StepStatus {
    COMPLETED = 'completed',
    CURRENT = 'current',
    LOCKED = 'locked',
}
const ONBOARDING_STEPS = [
    { key: 'template', label: 'Template' },
    { key: 'profile', label: 'Your Profile' },
    { key: 'trial', label: 'Free Trial' },
    { key: 'done', label: 'Done!' },
] as const;

const STATUS_TO_STEP: Record<OnboardingStatus, string> = {
    ONBOARDING_STARTED: 'template',
    TEMPLATE_SELECTED: 'profile',
    PROFILE_COMPLETED: 'trial',
    BILLING_SETUP_COMPLETED: 'done',
    ONBOARDING_COMPLETED: 'done',
};

@Injectable()
export class OnboardingContextService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authContextService: AuthContextService
    ) {}

    async getContext(userId: string) {
        const { site, user, owner } = await this.authContextService.getUserOwnerSiteOrThrow(userId);
        const availableTemplates = await this.prisma.onboardingTemplate.findMany({
            where: {
                is_active: true,
            },
            orderBy: [
                {
                    sort_order: 'asc',
                },
                {
                    created_at: 'desc',
                },
            ],
        });

        let selectedTemplate = null;

        if (site.onboarding_template_id) {
            selectedTemplate = await this.prisma.onboardingTemplate.findUnique({
                where: { id: site.onboarding_template_id },
            });
        }

        const siteBilling = await this.prisma.siteBilling.findUnique({
            where: {
                site_id: site.id,
            },
        });

        const profile = await this.prisma.ownerProfile.findUnique({
            where: { owner_id: owner.id },
        });

        const siteDomain = await this.prisma.siteDomain.findFirst({
            where: { site_id: site.id, is_primary: true },
        });

        const navigation = this.buildNavigation(site.onboarding_status);

        return {
            site,
            user,
            owner,
            selectedTemplate,
            availableTemplates,
            siteBilling,
            profile,
            siteDomain,
            navigation,
        };
    }

    private buildNavigation(status: OnboardingStatus): OnboardingNavigationDto {
        const currentStepKey = STATUS_TO_STEP[status];
        const currentIndex = ONBOARDING_STEPS.findIndex((s) => s.key === currentStepKey);
        const isCompleted = status === OnboardingStatus.ONBOARDING_COMPLETED;

        const steps = ONBOARDING_STEPS.map((step, i) => ({
            key: step.key,
            label: step.label,
            status:
                i < currentIndex ? StepStatus.COMPLETED : i === currentIndex ? StepStatus.CURRENT : StepStatus.LOCKED,
        }));

        const nextStep =
            !isCompleted && currentIndex < ONBOARDING_STEPS.length - 1 ? ONBOARDING_STEPS[currentIndex + 1].key : null;

        const prevStep = !isCompleted && currentIndex > 0 ? ONBOARDING_STEPS[currentIndex - 1].key : null;

        return {
            currentStep: currentStepKey,
            steps,
            nextStep,
            prevStep,
            isCompleted,
        };
    }
}
