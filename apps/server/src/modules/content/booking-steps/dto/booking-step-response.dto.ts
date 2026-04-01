import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType } from 'generated/prisma/enums';

export class BookingStepResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    site_id: string;

    @ApiProperty()
    title: string;

    @ApiPropertyOptional({ nullable: true })
    description?: string | null;

    @ApiProperty()
    sort_order: number;

    @ApiProperty({ enum: ContentType })
    type: ContentType;

    @ApiProperty()
    created_at: string;

    @ApiProperty()
    updated_at: string;
}
