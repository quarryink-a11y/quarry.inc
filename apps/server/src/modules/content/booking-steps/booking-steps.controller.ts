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

import { BookingStepsService } from './booking-steps.service';
import { CreateBookingStepDto, UpdateBookingStepDto } from './dto';
import { BookingStepResponseDto } from './dto/booking-step-response.dto';

@ApiTags('BookingSteps')
@ApiBearerAuth()
@Roles(Role.OWNER, Role.ADMIN)
@Controller('booking-steps')
export class BookingStepsController {
    constructor(private readonly bookingStepsService: BookingStepsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a booking step' })
    @ApiCreatedResponse({ type: BookingStepResponseDto, description: 'Booking step created' })
    create(@CurrentUser() user: JwtPayload, @Body() dto: CreateBookingStepDto) {
        return this.bookingStepsService.create(user.sub, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all booking steps' })
    @ApiQuery({ name: 'type', enum: ContentType, required: false })
    @ApiOkResponse({ type: [BookingStepResponseDto], description: 'List of booking steps' })
    findAll(@CurrentUser() user: JwtPayload, @Query('type') type?: ContentType) {
        return this.bookingStepsService.findAll(user.sub, type);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a booking step by ID' })
    @ApiOkResponse({ type: BookingStepResponseDto, description: 'Booking step found' })
    findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.bookingStepsService.findOne(user.sub, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a booking step' })
    @ApiOkResponse({ type: BookingStepResponseDto, description: 'Booking step updated' })
    update(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateBookingStepDto) {
        return this.bookingStepsService.update(user.sub, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a booking step' })
    @ApiNoContentResponse({ description: 'Booking step deleted' })
    remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.bookingStepsService.remove(user.sub, id);
    }
}
