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

import { CreateFaqCategoryDto, CreateFaqItemDto, UpdateFaqCategoryDto, UpdateFaqItemDto } from './dto';
import { FaqCategoryResponseDto, FaqItemResponseDto } from './dto/faq-response.dto';
import { FaqService } from './faq.service';

@ApiTags('FAQ')
@ApiBearerAuth()
@Roles(Role.OWNER, Role.ADMIN)
@Controller('faq')
export class FaqController {
    constructor(private readonly faqService: FaqService) {}

    @Post('categories')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a FAQ category' })
    @ApiCreatedResponse({ type: FaqCategoryResponseDto, description: 'FAQ category created' })
    createCategory(@CurrentUser() user: JwtPayload, @Body() dto: CreateFaqCategoryDto) {
        return this.faqService.createCategory(user.sub, dto);
    }

    @Get('categories')
    @ApiOperation({ summary: 'Get all FAQ categories with items' })
    @ApiQuery({ name: 'type', enum: ContentType, required: false })
    @ApiOkResponse({ type: [FaqCategoryResponseDto], description: 'List of FAQ categories' })
    getCategories(@CurrentUser() user: JwtPayload, @Query('type') type?: ContentType) {
        return this.faqService.getCategories(user.sub, type);
    }

    @Patch('categories/:id')
    @ApiOperation({ summary: 'Update a FAQ category' })
    @ApiOkResponse({ type: FaqCategoryResponseDto, description: 'FAQ category updated' })
    updateCategory(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateFaqCategoryDto) {
        return this.faqService.updateCategory(user.sub, id, dto);
    }

    @Delete('categories/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a FAQ category' })
    @ApiNoContentResponse({ description: 'FAQ category deleted' })
    deleteCategory(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.faqService.deleteCategory(user.sub, id);
    }

    @Post('items')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a FAQ item' })
    @ApiCreatedResponse({ type: FaqItemResponseDto, description: 'FAQ item created' })
    createItem(@CurrentUser() user: JwtPayload, @Body() dto: CreateFaqItemDto) {
        return this.faqService.createItem(user.sub, dto);
    }

    @Patch('items/:id')
    @ApiOperation({ summary: 'Update a FAQ item' })
    @ApiOkResponse({ type: FaqItemResponseDto, description: 'FAQ item updated' })
    updateItem(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateFaqItemDto) {
        return this.faqService.updateItem(user.sub, id, dto);
    }

    @Delete('items/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a FAQ item' })
    @ApiNoContentResponse({ description: 'FAQ item deleted' })
    deleteItem(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.faqService.deleteItem(user.sub, id);
    }
}
