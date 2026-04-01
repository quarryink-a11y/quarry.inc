import { Module } from '@nestjs/common';
import { UtilityService } from 'src/shared/infrastructure/modules/utilities/utility.service';

import { AuthModule } from '../access/auth/auth.module';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { OnboardingContextService } from './onboarding-context.service';
@Module({
    imports: [AuthModule],
    controllers: [OnboardingController],
    providers: [OnboardingService, OnboardingContextService, UtilityService],
})
export class OnboardingModule {}
