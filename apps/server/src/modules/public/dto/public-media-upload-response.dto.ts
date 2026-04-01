import { ApiProperty } from '@nestjs/swagger';

export class PublicMediaUploadResponseDto {
    @ApiProperty({ format: 'uri' })
    fileUrl: string;
}
