import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DomainKind, TemplateKind } from 'generated/prisma/enums';

import { AboutBlockDto } from '../../owners/profile/dto/update-profile.dto';
import { SiteSectionsDto } from '../../sites/site-settings/dto/update-settings.dto';

class PublicSiteDomainDto {
    @ApiProperty()
    host: string;

    @ApiProperty({ enum: DomainKind, enumName: 'DomainKind' })
    kind: DomainKind;

    @ApiProperty()
    is_primary: boolean;
}

class PublicSiteSettingsDto {
    @ApiPropertyOptional({ nullable: true })
    logo_url: string | null;

    @ApiProperty()
    analytics_enabled: boolean;

    @ApiProperty({ type: SiteSectionsDto })
    site_sections: SiteSectionsDto;
}

class PublicSocialMediaDto {
    @ApiPropertyOptional({ nullable: true })
    INSTAGRAM?: string | null;

    @ApiPropertyOptional({ nullable: true })
    FACEBOOK?: string | null;

    @ApiPropertyOptional({ nullable: true })
    TIKTOK?: string | null;

    @ApiPropertyOptional({ nullable: true })
    WHATSAPP?: string | null;

    @ApiPropertyOptional({ nullable: true })
    YOUTUBE?: string | null;

    @ApiPropertyOptional({ nullable: true })
    TELEGRAM?: string | null;
}

class PublicOwnerProfileDto {
    @ApiProperty()
    full_name: string;

    @ApiPropertyOptional({ nullable: true })
    description: string | null;

    @ApiPropertyOptional({ nullable: true })
    country: string | null;

    @ApiPropertyOptional({ nullable: true })
    city: string | null;

    @ApiPropertyOptional({ nullable: true })
    studio_name: string | null;

    @ApiPropertyOptional({ nullable: true })
    studio_address: string | null;

    @ApiPropertyOptional({ nullable: true })
    email: string | null;

    @ApiPropertyOptional({ nullable: true })
    phone: string | null;

    @ApiPropertyOptional({ nullable: true })
    photo_url: string | null;

    @ApiPropertyOptional({ nullable: true })
    studio_photo_url: string | null;

    @ApiPropertyOptional({ nullable: true })
    about_text: string | null;

    @ApiPropertyOptional({ type: [AboutBlockDto], nullable: true })
    about_blocks: AboutBlockDto[] | null;

    @ApiPropertyOptional({ nullable: true })
    about_photo_url: string | null;

    @ApiProperty({ type: PublicSocialMediaDto })
    social_media: PublicSocialMediaDto;
}

export class PublicSiteResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ enum: TemplateKind, enumName: 'TemplateKind', nullable: true })
    kind: TemplateKind | null;

    @ApiPropertyOptional({ type: PublicSiteSettingsDto, nullable: true })
    settings: PublicSiteSettingsDto | null;

    @ApiPropertyOptional({ type: PublicSiteDomainDto, nullable: true })
    site_domain: PublicSiteDomainDto | null;

    @ApiPropertyOptional({ type: PublicOwnerProfileDto, nullable: true })
    profile: PublicOwnerProfileDto | null;

    @ApiProperty({ description: 'Whether Stripe Connect is enabled for catalog purchases' })
    stripe_connect_enabled: boolean;
}
