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

import { CatalogsService } from './catalogs.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { CatalogResponseDto } from './entities/catalog.entity';

@ApiTags('Catalogs')
@ApiBearerAuth()
@Roles(Role.OWNER, Role.ADMIN)
@Controller('catalogs')
export class CatalogsController {
    constructor(private readonly catalogsService: CatalogsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a catalog item' })
    @ApiCreatedResponse({ type: CatalogResponseDto, description: 'Catalog item created' })
    create(@CurrentUser() user: JwtPayload, @Body() dto: CreateCatalogDto) {
        return this.catalogsService.create(user.sub, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all catalog items' })
    @ApiQuery({ name: 'type', enum: ContentType, required: false })
    @ApiOkResponse({ type: [CatalogResponseDto], description: 'List of catalog items' })
    findAll(@CurrentUser() user: JwtPayload, @Query('type') type?: ContentType) {
        return this.catalogsService.findAll(user.sub, type);
    }

    @Get('orders')
    @ApiOperation({ summary: 'Get all orders for catalog items' })
    @ApiOkResponse({ type: [OrderResponseDto], description: 'List of orders' })
    findAllOrders(@CurrentUser() user: JwtPayload) {
        return this.catalogsService.findAllOrders(user.sub);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a catalog item by ID' })
    @ApiOkResponse({ type: CatalogResponseDto, description: 'Catalog item found' })
    findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.catalogsService.findOne(user.sub, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a catalog item' })
    @ApiOkResponse({ type: CatalogResponseDto, description: 'Catalog item updated' })
    update(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateCatalogDto) {
        return this.catalogsService.update(user.sub, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a catalog item' })
    @ApiNoContentResponse({ description: 'Catalog item deleted' })
    remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.catalogsService.remove(user.sub, id);
    }
}
