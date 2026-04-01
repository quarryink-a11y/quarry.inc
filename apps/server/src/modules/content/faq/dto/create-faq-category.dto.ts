import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateFaqCategoryDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    title: string;

    @ApiPropertyOptional({ default: 0 })
    @IsNumber()
    @IsOptional()
    sort_order?: number;
}
