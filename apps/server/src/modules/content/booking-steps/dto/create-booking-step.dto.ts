import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateBookingStepDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    title: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ default: 0 })
    @IsNumber()
    @IsOptional()
    sort_order?: number;
}
