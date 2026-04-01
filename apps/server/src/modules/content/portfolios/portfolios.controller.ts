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

import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { PortfolioResponseDto } from './dto/portfolio-response.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PortfoliosService } from './portfolios.service';

@ApiTags('Portfolios')
@ApiBearerAuth()
@Roles(Role.OWNER, Role.ADMIN)
@Controller('portfolios')
export class PortfoliosController {
    constructor(private readonly portfoliosService: PortfoliosService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a portfolio item' })
    @ApiCreatedResponse({ type: PortfolioResponseDto, description: 'Portfolio item created' })
    create(@CurrentUser() user: JwtPayload, @Body() dto: CreatePortfolioDto) {
        return this.portfoliosService.create(user.sub, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all portfolio items' })
    @ApiQuery({ name: 'type', enum: ContentType, required: false })
    @ApiOkResponse({ type: [PortfolioResponseDto], description: 'List of portfolio items' })
    findAll(@CurrentUser() user: JwtPayload, @Query('type') type?: ContentType) {
        return this.portfoliosService.findAll(user.sub, type);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a portfolio item by ID' })
    @ApiOkResponse({ type: PortfolioResponseDto, description: 'Portfolio item found' })
    findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.portfoliosService.findOne(user.sub, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a portfolio item' })
    @ApiOkResponse({ type: PortfolioResponseDto, description: 'Portfolio item updated' })
    update(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdatePortfolioDto) {
        return this.portfoliosService.update(user.sub, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a portfolio item' })
    @ApiNoContentResponse({ description: 'Portfolio item deleted' })
    remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.portfoliosService.remove(user.sub, id);
    }
}
