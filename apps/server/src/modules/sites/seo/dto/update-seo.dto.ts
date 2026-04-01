import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSeoDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    keywords?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    og_image_url?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    og_title?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    og_description?: string;
}
