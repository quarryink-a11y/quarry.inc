import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MediaRemoveRequestDto {
    @ApiProperty({ example: 'cloudinary_public_id' })
    @IsString()
    publicId!: string;
}
