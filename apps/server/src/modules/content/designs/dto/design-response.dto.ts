import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType, Currency, SizeUnit } from 'generated/prisma/enums';

export class DesignResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    site_id: string;

    @ApiPropertyOptional({ nullable: true })
    name?: string | null;

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

    @ApiProperty({ type: [String] })
    preferred_body_placement: string[];

    @ApiProperty({ enum: ContentType })
    type: ContentType;

    @ApiProperty()
    created_at: string;

    @ApiProperty()
    updated_at: string;
}
