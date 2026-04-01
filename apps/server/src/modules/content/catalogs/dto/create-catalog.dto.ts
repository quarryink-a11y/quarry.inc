import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { CatalogCategory, Currency } from 'generated/prisma/enums';

import { ImageAttachmentDto } from '@/shared/dto';

export class CreateCatalogDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    name: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ enum: Currency })
    @IsEnum(Currency)
    currency: Currency;

    @ApiProperty({ enum: CatalogCategory })
    @IsEnum(CatalogCategory)
    category: CatalogCategory;

    @ApiProperty({ type: ImageAttachmentDto })
    @ValidateNested()
    @Type(() => ImageAttachmentDto)
    image: ImageAttachmentDto;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    is_active?: boolean;

    @ApiPropertyOptional()
    @IsInt()
    @Min(0)
    @IsOptional()
    stock_quantity?: number;

    @ApiPropertyOptional({ type: [Number] })
    @IsArray()
    @IsInt({ each: true })
    @IsOptional()
    gift_amounts?: number[];
}
