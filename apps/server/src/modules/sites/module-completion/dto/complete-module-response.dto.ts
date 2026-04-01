import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SiteSection } from 'generated/prisma/enums';

export class CompleteModuleResponseDto {
    @ApiProperty({ enum: SiteSection, isArray: true })
    completed_modules: SiteSection[];

    @ApiPropertyOptional()
    owner_onboarding_status?: string;
}
