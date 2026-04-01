import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TrafficSource } from 'generated/prisma/enums';

export class CreateTrackVisitDto {
    @ApiProperty({
        example: '/portfolio',
        description: 'Page path visited',
    })
    @IsString()
    @MaxLength(500)
    path: string;

    @ApiProperty({
        example: 'abc123nanoid',
        description: 'Persistent anonymous visitor identifier',
    })
    @IsString()
    @MaxLength(50)
    visitorKey: string;

    @ApiPropertyOptional({
        example: 'https://google.com',
        description: 'Referrer URL',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    referrer?: string;

    @ApiProperty({
        enum: TrafficSource,
        enumName: 'TrafficSource',
        example: TrafficSource.DIRECT,
        description: 'Detected traffic source',
    })
    @IsEnum(TrafficSource)
    trafficSource: TrafficSource;
}
