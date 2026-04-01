import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
} from '@nestjs/swagger';

import { JwtPayload } from '@/shared/types';

import { CurrentUser } from '../access/permissions/decorators';
import { OnboardingCompleteProfileDto, OnboardingSelectTemplateDto } from './dto';
import { OnboardingContextResponseDto } from './entities/onboarding-context-response.dto';
import { OnboardingService } from './onboarding.service';
import { OnboardingContextService } from './onboarding-context.service';
import { OnboardingCompleteProfileResponseDto } from './response/onboarding-complete-profile-response.dto';
import { OnboardingLaunchResponseDto } from './response/onboarding-launch-response.dto';
import { OnboardingSelectTemplateResponseDto } from './response/onboarding-select-template-response.dto';

@ApiBearerAuth()
@Controller('onboarding')
export class OnboardingController {
    constructor(
        private readonly onboardingService: OnboardingService,
        private readonly onboardingContextService: OnboardingContextService
    ) {}

    @Patch('select-template')
    @ApiOperation({ summary: 'Select onboarding template for the site' })
    @ApiOkResponse({ type: OnboardingSelectTemplateResponseDto })
    @ApiNotFoundResponse({ description: 'Onboarding template not found' })
    selectTemplate(
        @CurrentUser() user: JwtPayload,
        @Body() dto: OnboardingSelectTemplateDto
    ): Promise<OnboardingSelectTemplateResponseDto> {
        return this.onboardingService.selectTemplate(user.sub, dto);
    }

    @Post('complete-profile')
    @ApiOperation({ summary: 'Complete owner profile and generate site slug' })
    @ApiCreatedResponse({ type: OnboardingCompleteProfileResponseDto })
    @ApiBadRequestResponse({ description: 'Invalid onboarding state or validation error' })
    @ApiConflictResponse({ description: 'Unable to generate unique slug' })
    completeProfile(
        @CurrentUser() user: JwtPayload,
        @Body() dto: OnboardingCompleteProfileDto
    ): Promise<OnboardingCompleteProfileResponseDto> {
        return this.onboardingService.completeProfile(user.sub, dto);
    }

    @Post('launch')
    @ApiOperation({ summary: 'Launch site and complete onboarding' })
    @ApiBadRequestResponse({ description: 'Invalid onboarding state' })
    @ApiOkResponse({
        description: 'Site launched successfully',
        type: OnboardingLaunchResponseDto,
    })
    launchSite(@CurrentUser() user: JwtPayload) {
        return this.onboardingService.launchSite(user.sub);
    }

    @Get('context')
    @ApiOperation({ summary: 'Get onboarding context with navigation' })
    @ApiOkResponse({ type: OnboardingContextResponseDto })
    context(@CurrentUser() user: JwtPayload) {
        return this.onboardingContextService.getContext(user.sub);
    }
}
