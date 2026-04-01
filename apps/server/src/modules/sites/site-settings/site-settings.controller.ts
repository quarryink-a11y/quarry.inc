import { Body, Controller, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'generated/prisma/enums';
import { CurrentUser, Roles } from 'src/modules/access/permissions/decorators';
import { JwtPayload } from 'src/shared/types';

import { ResponseSettingsDto } from './dto/settings.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SiteSettingsService } from './site-settings.service';

@ApiTags('Site Settings')
@Controller('sites/settings')
@ApiBearerAuth()
@Roles(Role.OWNER, Role.ADMIN)
export class SiteSettingsController {
    constructor(private readonly siteSettingsService: SiteSettingsService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get site settings for current user' })
    @ApiOkResponse({ type: ResponseSettingsDto })
    getSettings(@CurrentUser() user: JwtPayload) {
        return this.siteSettingsService.getByCurrentUser(user.sub);
    }

    @Patch()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update site settings for current user' })
    @ApiBody({ type: UpdateSettingsDto })
    @ApiOkResponse({ type: ResponseSettingsDto })
    updateSettings(@CurrentUser() user: JwtPayload, @Body() dto: UpdateSettingsDto) {
        return this.siteSettingsService.updateByCurrentUser(user.sub, dto);
    }
}
