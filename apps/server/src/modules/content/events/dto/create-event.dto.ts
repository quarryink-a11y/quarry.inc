import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { EventStatus } from 'generated/prisma/enums';

import { ImageAttachmentDto } from '@/shared/dto';

export class CreateEventDto {
    @ApiProperty()
    @IsString()
    location: string;

    @ApiProperty()
    @IsString()
    country: string;

    @ApiProperty()
    @IsString()
    city: string;

    @ApiProperty()
    @IsDateString()
    start_at: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    end_at?: string;

    @ApiPropertyOptional({ enum: EventStatus })
    @IsEnum(EventStatus)
    @IsOptional()
    status?: EventStatus;

    @ApiProperty({ type: ImageAttachmentDto })
    @ValidateNested()
    @Type(() => ImageAttachmentDto)
    image: ImageAttachmentDto;
}
