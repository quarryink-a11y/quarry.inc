import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role, Status } from 'generated/prisma/enums';

import { AboutBlockDto, SocialMediaLinksDto } from './update-profile.dto';

class OwnerDto {
    @ApiProperty()
    id: string;

    @ApiProperty({ enum: Role })
    role: Role;

    @ApiProperty({ enum: Status })
    status: Status;
}

export class ProfileDto {
    @ApiProperty()
    id: string;

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
    phone: string | null;

    @ApiPropertyOptional({ nullable: true })
    email: string | null;

    @ApiProperty({ type: SocialMediaLinksDto })
    social_media: SocialMediaLinksDto;

    @ApiPropertyOptional({ nullable: true })
    photo_url: string | null;

    @ApiPropertyOptional({ nullable: true })
    studio_photo_url: string | null;

    @ApiPropertyOptional({ nullable: true })
    about_text: string | null;

    @ApiPropertyOptional({ type: [AboutBlockDto], description: 'Array of about blocks [{title, text}]' })
    about_blocks: AboutBlockDto[];

    @ApiPropertyOptional({ nullable: true })
    about_photo_url: string | null;
}

export class ProfileMeResponseDto {
    @ApiProperty({ type: OwnerDto })
    owner: OwnerDto;

    @ApiPropertyOptional({ type: ProfileDto, nullable: true })
    profile: ProfileDto | null;
}
