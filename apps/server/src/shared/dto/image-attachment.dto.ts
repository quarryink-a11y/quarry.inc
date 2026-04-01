import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class ImageAttachmentDto {
    @ApiProperty()
    @IsUrl()
    image_url: string;

    @ApiProperty()
    @IsString()
    image_public_id: string;
}
