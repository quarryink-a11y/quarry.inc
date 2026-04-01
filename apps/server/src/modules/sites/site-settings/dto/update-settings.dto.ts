import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SiteSectionsDto {
    @ApiPropertyOptional() @IsOptional() @IsBoolean() HERO?: boolean;
    @ApiPropertyOptional() @IsOptional() @IsBoolean() ABOUT?: boolean;
    @ApiPropertyOptional() @IsOptional() @IsBoolean() HOW_TO_BOOK?: boolean;
    @ApiPropertyOptional() @IsOptional() @IsBoolean() PORTFOLIO?: boolean;
    @ApiPropertyOptional() @IsOptional() @IsBoolean() DESIGNS?: boolean;
    @ApiPropertyOptional() @IsOptional() @IsBoolean() CATALOG?: boolean;
    @ApiPropertyOptional() @IsOptional() @IsBoolean() EVENTS?: boolean;
    @ApiPropertyOptional() @IsOptional() @IsBoolean() REVIEWS?: boolean;
    @ApiPropertyOptional() @IsOptional() @IsBoolean() FAQ?: boolean;
    @ApiPropertyOptional() @IsOptional() @IsBoolean() ADMINS?: boolean;
    @ApiPropertyOptional() @IsOptional() @IsBoolean() ANALYTICS?: boolean;
    @ApiPropertyOptional() @IsOptional() @IsBoolean() BOOKING_FORM?: boolean;
}

export class UpdateSettingsDto {
    @ApiPropertyOptional({ description: 'URL of the site logo', nullable: true })
    @IsString()
    @IsOptional()
    logo_url?: string | null;

    @ApiPropertyOptional({ description: 'Flag indicating if analytics is enabled for the site' })
    @IsBoolean()
    @IsOptional()
    analytics_enabled?: boolean;

    @ApiPropertyOptional({ type: SiteSectionsDto, description: 'Which sections are enabled on the site' })
    @IsOptional()
    site_sections?: SiteSectionsDto;
}
