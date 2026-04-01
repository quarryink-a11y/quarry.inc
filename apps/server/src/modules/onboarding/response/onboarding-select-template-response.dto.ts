import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SiteSection, TemplateKind } from 'generated/prisma/enums';

import { OnboardingTemplateResponseDto } from '@/modules/sites/onboarding-templates/entities/onboarding-template-response.dto';

export class SelectTemplateSiteResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    onboarding_status: string;

    @ApiProperty()
    owner_onboarding_status: string;

    @ApiProperty({ enum: SiteSection, isArray: true })
    completed_modules: SiteSection[];

    @ApiPropertyOptional({ enum: TemplateKind, nullable: true })
    template_kind?: TemplateKind | null;

    @ApiPropertyOptional({ type: Date, nullable: true })
    published_at?: Date | null;

    @ApiProperty({ type: () => OnboardingTemplateResponseDto, nullable: true })
    onboarding_template: OnboardingTemplateResponseDto | null;
}

export class OnboardingSelectTemplateResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ type: () => SelectTemplateSiteResponseDto })
    site: SelectTemplateSiteResponseDto;
}
