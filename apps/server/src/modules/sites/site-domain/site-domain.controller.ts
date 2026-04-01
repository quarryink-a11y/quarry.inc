import { Body, Controller, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'generated/prisma/enums';
import { CurrentUser, Roles } from 'src/modules/access/permissions/decorators';
import { JwtPayload } from 'src/shared/types';

import { SiteDomainResponseDto } from './dto/site-domain-response.dto';
import { UpdateSiteDomainDto } from './dto/update-site-domain.dto';
import { SiteDomainService } from './site-domain.service';

@ApiTags('Sites')
@Controller('sites/domain')
@ApiBearerAuth()
@Roles(Role.OWNER, Role.ADMIN)
export class SiteDomainController {
    constructor(private readonly siteDomainService: SiteDomainService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get site domain for current user' })
    @ApiOkResponse({ type: SiteDomainResponseDto })
    getDomain(@CurrentUser() user: JwtPayload) {
        return this.siteDomainService.getByCurrentUser(user.sub);
    }

    @Patch()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update site domain for current user' })
    @ApiBody({ type: UpdateSiteDomainDto })
    @ApiOkResponse({ type: SiteDomainResponseDto })
    updateDomain(@CurrentUser() user: JwtPayload, @Body() dto: UpdateSiteDomainDto) {
        return this.siteDomainService.updateByCurrentUser(user.sub, dto);
    }
}
