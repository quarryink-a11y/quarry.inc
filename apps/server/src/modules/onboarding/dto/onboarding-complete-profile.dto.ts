import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

import { SocialMediaLinksDto } from '@/modules/owners/profile/dto/update-profile.dto';

export class OnboardingCompleteProfileDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    @ApiProperty({
        description: 'Full name of the owner',
        example: 'John Smith',
    })
    fullName: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    @ApiPropertyOptional({
        description: 'Short description or bio',
        example: 'Professional photographer based in NYC',
    })
    description?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ example: 'United States' })
    country?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ example: 'New York' })
    city?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ example: 'Smith Photography' })
    studioName?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ example: '123 Main St, New York, NY' })
    studioAddress?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ example: '+1234567890' })
    phone?: string;

    @IsOptional()
    @IsEmail()
    @ApiPropertyOptional({ example: 'john@example.com' })
    email?: string;

    @IsOptional()
    @ApiPropertyOptional({ type: SocialMediaLinksDto, description: 'Social media links per platform' })
    socialMedia?: SocialMediaLinksDto;

    @IsOptional()
    @IsUrl()
    @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
    photoUrl?: string;

    @IsOptional()
    @IsUrl()
    @ApiPropertyOptional({ example: 'https://example.com/studio.jpg' })
    studioPhotoUrl?: string;
}
