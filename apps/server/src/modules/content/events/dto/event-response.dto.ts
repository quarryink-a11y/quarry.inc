import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType, EventStatus } from 'generated/prisma/enums';

export class EventResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    site_id: string;

    @ApiProperty()
    location: string;

    @ApiProperty()
    country: string;

    @ApiProperty()
    city: string;

    @ApiProperty()
    start_at: string;

    @ApiPropertyOptional({ nullable: true })
    end_at?: string | null;

    @ApiProperty()
    image_url: string;

    @ApiPropertyOptional({ nullable: true })
    image_public_id?: string | null;

    @ApiProperty({ enum: EventStatus })
    status: EventStatus;

    @ApiProperty({ enum: ContentType })
    type: ContentType;

    @ApiProperty()
    created_at: string;

    @ApiProperty()
    updated_at: string;
}
