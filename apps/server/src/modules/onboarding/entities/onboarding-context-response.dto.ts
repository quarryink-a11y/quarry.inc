import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AuthUserDto } from '../../access/auth/dto/auth-user.dto';
import { ProfileDto } from '../../owners/profile/dto/profile-me-response.dto';
import { OnboardingTemplateResponseDto } from '../../sites/onboarding-templates/entities/onboarding-template-response.dto';
import { SiteResponseDto } from '../../sites/site/dto/site-response.dto';
import { SiteDomainResponseDto } from '../../sites/site-domain/dto/site-domain-response.dto';

export class OnboardingNavigationStepDto {
    @ApiProperty({ example: 'template' })
    key: string;

    @ApiProperty({ example: 'Template' })
    label: string;

    @ApiProperty({ enum: ['completed', 'current', 'locked'], example: 'current' })
    status: 'completed' | 'current' | 'locked';
}

export class OnboardingNavigationDto {
    @ApiProperty({ example: 'template' })
    currentStep: string;

    @ApiProperty({ type: [OnboardingNavigationStepDto] })
    steps: OnboardingNavigationStepDto[];

    @ApiPropertyOptional({ nullable: true, example: 'profile' })
    nextStep: string | null;

    @ApiPropertyOptional({ nullable: true, example: null })
    prevStep: string | null;

    @ApiProperty({ example: false })
    isCompleted: boolean;
}

export class OnboardingContextResponseDto {
    @ApiProperty({ type: SiteResponseDto })
    site: SiteResponseDto;

    @ApiProperty({ type: AuthUserDto })
    user: AuthUserDto;

    @ApiProperty()
    owner: Record<string, unknown>;

    @ApiPropertyOptional({ type: OnboardingTemplateResponseDto, nullable: true })
    selectedTemplate: OnboardingTemplateResponseDto | null;

    @ApiProperty({ type: [OnboardingTemplateResponseDto] })
    availableTemplates: OnboardingTemplateResponseDto[];

    @ApiPropertyOptional({ nullable: true })
    siteBilling: Record<string, unknown> | null;

    @ApiPropertyOptional({ type: ProfileDto, nullable: true })
    profile: ProfileDto | null;

    @ApiPropertyOptional({ type: SiteDomainResponseDto, nullable: true })
    siteDomain: SiteDomainResponseDto | null;

    @ApiProperty({ type: OnboardingNavigationDto })
    navigation: OnboardingNavigationDto;
}
