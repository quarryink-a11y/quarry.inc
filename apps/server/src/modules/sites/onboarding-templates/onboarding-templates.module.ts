import { Module } from '@nestjs/common';

import { OnboardingTemplatesController } from './onboarding-templates.controller';
import { OnboardingTemplatesService } from './onboarding-templates.service';

@Module({
    controllers: [OnboardingTemplatesController],
    providers: [OnboardingTemplatesService],
})
export class OnboardingTemplatesModule {}
