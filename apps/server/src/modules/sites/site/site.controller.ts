import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ContentType, Role } from 'generated/prisma/enums';
import { CurrentUser, Roles } from 'src/modules/access/permissions/decorators';
import { JwtPayload } from 'src/shared/types';

import { PublicSiteContentResponseDto } from '@/modules/public/dto/public-site-content-response.dto';

import { PublishResponseDto } from './dto/publish-response.dto';
import { SiteResponseDto } from './dto/site-response.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SiteService } from './site.service';

@ApiTags('Sites')
@Controller('sites')
@ApiBearerAuth()
@Roles(Role.OWNER, Role.ADMIN)
export class SiteController {
    constructor(private readonly siteService: SiteService) {}

    @Get('me')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get current user site context' })
    @ApiOkResponse({ type: SiteResponseDto })
    getSite(@CurrentUser() user: JwtPayload) {
        return this.siteService.getByCurrentUser(user.sub);
    }

    @Patch('me')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update current user site' })
    @ApiBody({ type: UpdateSiteDto })
    @ApiOkResponse({ type: SiteResponseDto })
    updateSite(@CurrentUser() user: JwtPayload, @Body() dto: UpdateSiteDto) {
        return this.siteService.updateByCurrentUser(user.sub, dto);
    }

    @Post('publish')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Publish all draft content for current site' })
    @ApiOkResponse({ type: PublishResponseDto })
    publish(@CurrentUser() user: JwtPayload) {
        return this.siteService.publishAll(user.sub);
    }

    @Get('content')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get all site content by type' })
    @ApiQuery({ name: 'type', enum: ContentType, required: false })
    @ApiOkResponse({ type: PublicSiteContentResponseDto })
    getContent(@CurrentUser() user: JwtPayload, @Query('type') type: ContentType = ContentType.DRAFT) {
        return this.siteService.getContent(user.sub, type);
    }
}
