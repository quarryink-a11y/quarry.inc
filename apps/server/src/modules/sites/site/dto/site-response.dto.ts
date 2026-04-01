import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SiteSection, TemplateKind } from 'generated/prisma/enums';

export class SiteResponseDto {
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

    @ApiPropertyOptional({ nullable: true })
    published_at?: string | null;
}
