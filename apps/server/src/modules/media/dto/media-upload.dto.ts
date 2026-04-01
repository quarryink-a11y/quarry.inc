import { ApiProperty } from '@nestjs/swagger';
import type { MediaContent } from 'generated/prisma/client';
import { MediaStatus, MediaType } from 'generated/prisma/enums';

export class MediaUploadResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty({ format: 'uri' })
    url: string;

    @ApiProperty({ enum: MediaType, enumName: 'MediaType' })
    type: MediaType;

    @ApiProperty({ enum: MediaStatus, enumName: 'MediaStatus' })
    status: MediaStatus;

    @ApiProperty()
    publicId: string;

    @ApiProperty({ nullable: true })
    format: string | null;

    @ApiProperty({ nullable: true })
    bytes: number | null;

    @ApiProperty({ nullable: true })
    width: number | null;

    @ApiProperty({ nullable: true })
    height: number | null;

    @ApiProperty({ nullable: true })
    duration: number | null;

    @ApiProperty()
    siteId: string;

    @ApiProperty({ format: 'date-time' })
    createdAt: Date;

    @ApiProperty({ format: 'date-time' })
    updatedAt: Date;

    static fromPrisma(media: MediaContent): MediaUploadResponseDto {
        const dto = new MediaUploadResponseDto();
        dto.id = media.id;
        dto.name = media.name;
        dto.url = media.url;
        dto.type = media.type;
        dto.status = media.status;
        dto.publicId = media.public_id;
        dto.format = media.format;
        dto.bytes = media.bytes;
        dto.width = media.width;
        dto.height = media.height;
        dto.duration = media.duration;
        dto.siteId = media.site_id;
        dto.createdAt = media.created_at;
        dto.updatedAt = media.updated_at;
        return dto;
    }
}
