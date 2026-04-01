import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from 'generated/prisma/enums';
import { CurrentUser, Roles } from 'src/modules/access/permissions/decorators';
import { JwtPayload } from 'src/shared/types';

import { AnalyticsDashboardService } from './analytics-dashboard.service';
import { AnalyticsDashboardResponseDto } from './dto/analytics-dashboard-response.dto';

@ApiTags('Analytics')
@ApiBearerAuth()
@Roles(Role.OWNER, Role.ADMIN)
@Controller('analytics')
export class AnalyticsDashboardController {
    constructor(private readonly dashboardService: AnalyticsDashboardService) {}

    @Get('dashboard')
    @ApiOperation({ summary: 'Get aggregated analytics dashboard data' })
    @ApiQuery({ name: 'period', required: false, description: 'Period in days (7, 30, 90, 0=all)' })
    @ApiOkResponse({ type: AnalyticsDashboardResponseDto })
    getDashboard(@CurrentUser() user: JwtPayload, @Query('period') period?: string) {
        const periodDays = parseInt(period ?? '30', 10) || 30;
        return this.dashboardService.getDashboard(user.sub, periodDays);
    }
}
