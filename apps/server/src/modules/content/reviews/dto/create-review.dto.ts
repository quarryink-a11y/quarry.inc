import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUrl, ValidateIf, ValidateNested } from 'class-validator';

import { ImageAttachmentDto } from '@/shared/dto';

export class CreateReviewDto {
    @ApiProperty()
    @IsString()
    client_name: string;

    @ApiProperty()
    @IsString()
    review_source: string;

    @ApiProperty()
    @IsString()
    review_text: string;

    @ApiPropertyOptional()
    @IsUrl()
    @ValidateIf((o) => !!o.client_profile_url)
    @IsOptional()
    client_profile_url?: string;

    @ApiPropertyOptional({ type: ImageAttachmentDto })
    @ValidateNested()
    @Type(() => ImageAttachmentDto)
    @IsOptional()
    client_image?: ImageAttachmentDto;
}
