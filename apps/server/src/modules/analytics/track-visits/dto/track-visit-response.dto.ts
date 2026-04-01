import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrafficSource } from 'generated/prisma/enums';

export class TrackVisitResponseDto {
    @ApiProperty({ example: 'clxyz123' })
    id: string;

    @ApiProperty({ example: 'clsite456' })
    siteId: string;

    @ApiProperty({ example: '/portfolio' })
    path: string;

    @ApiPropertyOptional({ example: 'abc123nanoid', nullable: true })
    visitorKey?: string | null;

    @ApiPropertyOptional({ example: 'https://google.com', nullable: true })
    referrer?: string | null;

    @ApiProperty({ enum: TrafficSource, enumName: 'TrafficSource', example: TrafficSource.DIRECT })
    trafficSource: TrafficSource;

    @ApiPropertyOptional({ example: 'Mozilla/5.0 ...', nullable: true })
    userAgent?: string | null;

    @ApiProperty({ example: '2026-03-12T10:30:00.000Z' })
    visitedAt: Date;

    @ApiProperty({ example: '2026-03-12T10:30:00.000Z' })
    createdAt: Date;
}
