import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateFaqItemDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    category_id: string;

    @ApiProperty()
    @IsString()
    @MinLength(1)
    question: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    answer?: string;

    @ApiPropertyOptional({ default: 0 })
    @IsNumber()
    @IsOptional()
    sort_order?: number;
}
