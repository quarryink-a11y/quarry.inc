import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SeoResponseDto {
    @ApiProperty()
    id: string;

    @ApiPropertyOptional()
    title: string | null;

    @ApiPropertyOptional()
    description: string | null;

    @ApiPropertyOptional()
    keywords: string | null;

    @ApiPropertyOptional()
    og_image_url: string | null;

    @ApiPropertyOptional()
    og_title: string | null;

    @ApiPropertyOptional()
    og_description: string | null;
}
