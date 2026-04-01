import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { ContentType, Role } from 'generated/prisma/enums';
import { CurrentUser, Roles } from 'src/modules/access/permissions/decorators';
import { JwtPayload } from 'src/shared/types';

import { DesignsService } from './designs.service';
import { CreateDesignDto } from './dto/create-design.dto';
import { DesignResponseDto } from './dto/design-response.dto';
import { UpdateDesignDto } from './dto/update-design.dto';

@ApiTags('Designs')
@ApiBearerAuth()
@Roles(Role.OWNER, Role.ADMIN)
@Controller('designs')
export class DesignsController {
    constructor(private readonly designsService: DesignsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a design' })
    @ApiCreatedResponse({ type: DesignResponseDto, description: 'Design created' })
    create(@CurrentUser() user: JwtPayload, @Body() dto: CreateDesignDto) {
        return this.designsService.create(user.sub, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all designs' })
    @ApiQuery({ name: 'type', enum: ContentType, required: false })
    @ApiOkResponse({ type: [DesignResponseDto], description: 'List of designs' })
    findAll(@CurrentUser() user: JwtPayload, @Query('type') type?: ContentType) {
        return this.designsService.findAll(user.sub, type);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a design by ID' })
    @ApiOkResponse({ type: DesignResponseDto, description: 'Design found' })
    findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.designsService.findOne(user.sub, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a design' })
    @ApiOkResponse({ type: DesignResponseDto, description: 'Design updated' })
    update(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateDesignDto) {
        return this.designsService.update(user.sub, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a design' })
    @ApiNoContentResponse({ description: 'Design deleted' })
    remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.designsService.remove(user.sub, id);
    }
}
