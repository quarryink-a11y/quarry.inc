import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType, Currency, SizeUnit } from 'generated/prisma/enums';

export class PortfolioResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    site_id: string;

    @ApiProperty()
    image_url: string;

    @ApiPropertyOptional({ nullable: true })
    image_public_id?: string | null;

    @ApiPropertyOptional({ nullable: true })
    price?: number | null;

    @ApiPropertyOptional({ enum: Currency, nullable: true })
    currency?: Currency | null;

    @ApiPropertyOptional({ nullable: true })
    size?: number | null;

    @ApiPropertyOptional({ enum: SizeUnit, nullable: true })
    size_unit?: SizeUnit | null;

    @ApiProperty({ enum: ContentType })
    type: ContentType;

    @ApiProperty()
    created_at: string;

    @ApiProperty()
    updated_at: string;
}
