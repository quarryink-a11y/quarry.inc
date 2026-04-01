import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/modules/prisma/prisma.service';

import { CreateTrackVisitDto } from './dto/create-track-visit.dto';

const DEDUP_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

@Injectable()
export class TrackVisitsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(siteId: string, dto: CreateTrackVisitDto, userAgent: string | null): Promise<void> {
        const thirtyMinutesAgo = new Date(Date.now() - DEDUP_WINDOW_MS);

        const existing = await this.prisma.trackVisit.findFirst({
            where: {
                site_id: siteId,
                visitor_key: dto.visitorKey,
                path: dto.path,
                visited_at: { gte: thirtyMinutesAgo },
            },
            select: { id: true },
        });

        if (existing) return;

        await this.prisma.trackVisit.create({
            data: {
                site_id: siteId,
                path: dto.path,
                visitor_key: dto.visitorKey,
                referrer: dto.referrer ?? null,
                traffic_source: dto.trafficSource,
                user_agent: userAgent,
            },
        });
    }
}
