import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AboutBlockDto {
    @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() text?: string;
}

export class SocialMediaLinksDto {
    @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() INSTAGRAM?: string | null;
    @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() FACEBOOK?: string | null;
    @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() TIKTOK?: string | null;
    @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() WHATSAPP?: string | null;
    @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() YOUTUBE?: string | null;
    @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() TELEGRAM?: string | null;
}

export class UpdateProfileDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    full_name?: string;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    country?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    city?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    studio_name?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    studio_address?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    phone?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    email?: string | null;

    @ApiPropertyOptional({ type: SocialMediaLinksDto, description: 'Social media links per platform' })
    @IsOptional()
    social_media?: SocialMediaLinksDto;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    photo_url?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    studio_photo_url?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    about_text?: string | null;

    @ApiPropertyOptional({ type: [AboutBlockDto], description: 'Array of about blocks [{title, text}]' })
    @IsOptional()
    about_blocks?: AboutBlockDto[];

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    about_photo_url?: string | null;
}
