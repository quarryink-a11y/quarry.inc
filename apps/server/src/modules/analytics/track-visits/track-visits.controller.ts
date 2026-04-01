import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CurrentSite, IsPublic, RequireTenant } from 'src/modules/access/permissions/decorators';
import type { ResolvedTenant } from 'src/shared/types';

import { CreateTrackVisitDto } from './dto/create-track-visit.dto';
import { TrackVisitsService } from './track-visits.service';

@ApiTags('Public')
@IsPublic()
@RequireTenant()
@Controller('public/track-visit')
export class TrackVisitsController {
    constructor(private readonly trackVisitsService: TrackVisitsService) {}

    @Post()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Track a page visit on a tenant site' })
    @ApiNoContentResponse({ description: 'Visit tracked' })
    async create(@CurrentSite() tenant: ResolvedTenant, @Body() dto: CreateTrackVisitDto, @Req() req: Request) {
        const userAgent = req.headers['user-agent'] ?? null;
        await this.trackVisitsService.create(tenant.site.id, dto, userAgent);
    }
}
