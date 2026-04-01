import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType } from 'generated/prisma/enums';

export class FaqItemResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    category_id: string;

    @ApiProperty()
    question: string;

    @ApiPropertyOptional({ nullable: true })
    answer?: string | null;

    @ApiProperty()
    sort_order: number;

    @ApiProperty()
    created_at: string;

    @ApiProperty()
    updated_at: string;
}

export class FaqCategoryResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    site_id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    sort_order: number;

    @ApiProperty({ enum: ContentType })
    type: ContentType;

    @ApiProperty({ type: [FaqItemResponseDto] })
    items: FaqItemResponseDto[];

    @ApiProperty()
    created_at: string;

    @ApiProperty()
    updated_at: string;
}
