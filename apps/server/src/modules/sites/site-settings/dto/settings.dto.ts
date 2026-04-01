import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { SiteSectionsDto } from './update-settings.dto';

export class ResponseSettingsDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    site_id: string;

    @ApiPropertyOptional({ description: 'URL of the site logo', nullable: true })
    logo_url: string | null;

    @ApiProperty({ description: 'Flag indicating if analytics is enabled for the site' })
    analytics_enabled: boolean;

    @ApiProperty({ type: SiteSectionsDto, description: 'Which sections are enabled on the site' })
    site_sections: SiteSectionsDto;
}
