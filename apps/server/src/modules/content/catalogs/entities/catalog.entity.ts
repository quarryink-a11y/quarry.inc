import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CatalogCategory, ContentType, Currency } from 'generated/prisma/enums';

export class CatalogResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    site_id: string;

    @ApiProperty()
    name: string;

    @ApiPropertyOptional({ nullable: true })
    description?: string | null;

    @ApiProperty()
    price: number;

    @ApiProperty({ enum: Currency })
    currency: Currency;

    @ApiProperty({ enum: CatalogCategory })
    category: CatalogCategory;

    @ApiProperty()
    image_url: string;

    @ApiProperty()
    is_active: boolean;

    @ApiProperty({ enum: ContentType })
    type: ContentType;

    @ApiPropertyOptional({ nullable: true })
    stock_quantity?: number | null;

    @ApiProperty({ type: [Number] })
    gift_amounts: number[];

    @ApiProperty()
    created_at: string;

    @ApiProperty()
    updated_at: string;
}
