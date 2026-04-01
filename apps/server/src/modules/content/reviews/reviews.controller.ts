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

import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews')
@ApiBearerAuth()
@Roles(Role.OWNER, Role.ADMIN)
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a review' })
    @ApiCreatedResponse({ type: ReviewResponseDto, description: 'Review created' })
    create(@CurrentUser() user: JwtPayload, @Body() dto: CreateReviewDto) {
        return this.reviewsService.create(user.sub, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all reviews' })
    @ApiQuery({ name: 'type', enum: ContentType, required: false })
    @ApiOkResponse({ type: [ReviewResponseDto], description: 'List of reviews' })
    findAll(@CurrentUser() user: JwtPayload, @Query('type') type?: ContentType) {
        return this.reviewsService.findAll(user.sub, type);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a review by ID' })
    @ApiOkResponse({ type: ReviewResponseDto, description: 'Review found' })
    findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.reviewsService.findOne(user.sub, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a review' })
    @ApiOkResponse({ type: ReviewResponseDto, description: 'Review updated' })
    update(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateReviewDto) {
        return this.reviewsService.update(user.sub, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a review' })
    @ApiNoContentResponse({ description: 'Review deleted' })
    remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.reviewsService.remove(user.sub, id);
    }
}
