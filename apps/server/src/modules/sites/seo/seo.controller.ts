import { Body, Controller, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'generated/prisma/enums';
import { CurrentUser, Roles } from 'src/modules/access/permissions/decorators';
import { JwtPayload } from 'src/shared/types';

import { SeoResponseDto } from './dto/seo-response.dto';
import { UpdateSeoDto } from './dto/update-seo.dto';
import { SeoService } from './seo.service';

@ApiTags('Sites')
@Controller('sites/seo')
@ApiBearerAuth()
@Roles(Role.OWNER, Role.ADMIN)
export class SeoController {
    constructor(private readonly seoService: SeoService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get SEO settings for current user site' })
    @ApiOkResponse({ type: SeoResponseDto })
    getSeo(@CurrentUser() user: JwtPayload) {
        return this.seoService.getByCurrentUser(user.sub);
    }

    @Patch()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update SEO settings for current user site' })
    @ApiBody({ type: UpdateSeoDto })
    @ApiOkResponse({ type: SeoResponseDto })
    updateSeo(@CurrentUser() user: JwtPayload, @Body() dto: UpdateSeoDto) {
        return this.seoService.updateByCurrentUser(user.sub, dto);
    }
}
