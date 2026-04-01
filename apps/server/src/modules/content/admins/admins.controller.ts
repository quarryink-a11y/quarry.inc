import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { Role } from 'generated/prisma/enums';
import { CurrentUser, Roles } from 'src/modules/access/permissions/decorators';
import { JwtPayload } from 'src/shared/types';

import { AdminsService } from './admins.service';
import { AdminResponseDto } from './dto/admin-response.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@ApiTags('Admins')
@ApiBearerAuth()
@Roles(Role.OWNER, Role.ADMIN)
@Controller('admins')
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create an admin' })
    @ApiCreatedResponse({ type: AdminResponseDto, description: 'Admin created' })
    create(@CurrentUser() user: JwtPayload, @Body() dto: CreateAdminDto) {
        return this.adminsService.create(user.sub, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all admins' })
    @ApiOkResponse({ type: [AdminResponseDto], description: 'List of admins' })
    findAll(@CurrentUser() user: JwtPayload) {
        return this.adminsService.findAll(user.sub);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an admin by ID' })
    @ApiOkResponse({ type: AdminResponseDto, description: 'Admin found' })
    findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.adminsService.findOne(user.sub, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an admin' })
    @ApiOkResponse({ type: AdminResponseDto, description: 'Admin updated' })
    update(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateAdminDto) {
        return this.adminsService.update(user.sub, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete an admin' })
    @ApiNoContentResponse({ description: 'Admin deleted' })
    remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.adminsService.remove(user.sub, id);
    }
}
