import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';
import { Currency, SizeUnit } from 'generated/prisma/enums';

import { ImageAttachmentDto } from '@/shared/dto';

export class CreatePortfolioDto {
    @ApiProperty({ type: ImageAttachmentDto })
    @ValidateNested()
    @Type(() => ImageAttachmentDto)
    image: ImageAttachmentDto;

    @ApiPropertyOptional({ enum: Currency })
    @IsEnum(Currency)
    @IsOptional()
    currency?: Currency;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    @Min(0)
    price?: number;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    size?: number;

    @ApiPropertyOptional({ enum: SizeUnit })
    @IsEnum(SizeUnit)
    @IsOptional()
    size_unit?: SizeUnit;
}
