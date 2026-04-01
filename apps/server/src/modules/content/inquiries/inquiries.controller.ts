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

import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiryResponseDto } from './dto/inquiry-response.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { InquiriesService } from './inquiries.service';

@ApiTags('Inquiries')
@ApiBearerAuth()
@Roles(Role.OWNER, Role.ADMIN)
@Controller('inquiries')
export class InquiriesController {
    constructor(private readonly inquiriesService: InquiriesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create an inquiry' })
    @ApiCreatedResponse({ type: InquiryResponseDto, description: 'Inquiry created' })
    create(@CurrentUser() user: JwtPayload, @Body() dto: CreateInquiryDto) {
        return this.inquiriesService.create(user.sub, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all inquiries' })
    @ApiOkResponse({ type: [InquiryResponseDto], description: 'List of inquiries' })
    findAll(@CurrentUser() user: JwtPayload) {
        return this.inquiriesService.findAll(user.sub);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an inquiry by ID' })
    @ApiOkResponse({ type: InquiryResponseDto, description: 'Inquiry found' })
    findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.inquiriesService.findOne(user.sub, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an inquiry' })
    @ApiOkResponse({ type: InquiryResponseDto, description: 'Inquiry updated' })
    update(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateInquiryDto) {
        return this.inquiriesService.update(user.sub, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete an inquiry' })
    @ApiNoContentResponse({ description: 'Inquiry deleted' })
    remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
        return this.inquiriesService.remove(user.sub, id);
    }
}
