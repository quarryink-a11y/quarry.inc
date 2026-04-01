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

import { CreateEventDto } from './dto/create-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@ApiTags('Events')
@ApiBearerAuth()
@Roles(Role.OWNER, Role.ADMIN)
@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create an event' })
    @ApiCreatedResponse({ type: EventResponseDto, description: 'Event created' })
    create(@CurrentUser() user: JwtPayload, @Body() dto: CreateEventDto) {
        return this.eventsService.create(user.sub, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all events' })
    @ApiQuery({ name: 'type', enum: ContentType, required: false })
    @ApiOkResponse({ type: [EventResponseDto], description: 'List of events' })
    findAll(@CurrentUser() user: JwtPayload, @Query('type') type?: ContentType) {
        return this.eventsService.findAll(user.sub, type);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an event by ID' })
    @ApiOkResponse({ type: EventResponseDto, description: 'Event found' })
    findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.eventsService.findOne(user.sub, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an event' })
    @ApiOkResponse({ type: EventResponseDto, description: 'Event updated' })
    update(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateEventDto) {
        return this.eventsService.update(user.sub, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete an event' })
    @ApiNoContentResponse({ description: 'Event deleted' })
    remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.eventsService.remove(user.sub, id);
    }
}
