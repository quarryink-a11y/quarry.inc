import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType } from 'generated/prisma/enums';

export class ReviewResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    site_id: string;

    @ApiProperty()
    client_name: string;

    @ApiProperty()
    review_source: string;

    @ApiProperty()
    review_text: string;

    @ApiPropertyOptional({ nullable: true })
    client_profile_url?: string | null;

    @ApiPropertyOptional({ nullable: true })
    client_image_url?: string | null;

    @ApiPropertyOptional({ nullable: true })
    client_image_public_id?: string | null;

    @ApiProperty({ enum: ContentType })
    type: ContentType;

    @ApiProperty()
    created_at: string;

    @ApiProperty()
    updated_at: string;
}
