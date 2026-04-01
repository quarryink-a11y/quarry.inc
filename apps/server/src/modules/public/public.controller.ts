import { Body, Controller, Get, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { CurrentSite, IsPublic, RequireTenant } from 'src/modules/access/permissions/decorators';
import { FILE_SIZE_LIMIT } from 'src/shared/constants';
import type { ResolvedTenant } from 'src/shared/types';

import { PublicCheckoutDto } from './dto/public-checkout.dto';
import { PublicMediaUploadResponseDto } from './dto/public-media-upload-response.dto';
import { PublicSiteContentResponseDto } from './dto/public-site-content-response.dto';
import { PublicSiteResponseDto } from './dto/public-site-response.dto';
import { SubmitInquiryDto } from './dto/submit-inquiry.dto';
import { PublicService } from './public.service';

@ApiTags('Public')
@IsPublic()
@RequireTenant()
@Controller('public')
export class PublicController {
    constructor(private readonly publicService: PublicService) {}

    @Get('site')
    @ApiOperation({ summary: 'Get public site info by domain' })
    @ApiOkResponse({ type: PublicSiteResponseDto })
    getSiteInfo(@CurrentSite() tenant: ResolvedTenant) {
        return this.publicService.getSiteInfo(tenant.site.id);
    }

    @Get('site-content')
    @ApiOperation({ summary: 'Get all published content for a tenant site' })
    @ApiOkResponse({ type: PublicSiteContentResponseDto })
    getSiteContent(@CurrentSite() tenant: ResolvedTenant) {
        return this.publicService.getSiteContent(tenant.site.id);
    }

    @Post('inquiries')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Submit a public inquiry for a tenant site' })
    @ApiCreatedResponse({ description: 'Inquiry submitted' })
    submitInquiry(@CurrentSite() tenant: ResolvedTenant, @Body() dto: SubmitInquiryDto) {
        return this.publicService.submitInquiry(tenant.site.id, dto);
    }

    @Post('checkout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Create Stripe Checkout session for catalog purchase' })
    createCheckout(@CurrentSite() tenant: ResolvedTenant, @Body() dto: PublicCheckoutDto) {
        return this.publicService.createCheckout(tenant.site.id, dto);
    }

    @Post('media/upload')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Upload a public inquiry inspiration image' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: { file: { type: 'string', format: 'binary' } },
            required: ['file'],
        },
    })
    @ApiOkResponse({ type: PublicMediaUploadResponseDto })
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage(), limits: { fileSize: FILE_SIZE_LIMIT[0] } }))
    uploadMedia(@CurrentSite() tenant: ResolvedTenant, @UploadedFile() file: Express.Multer.File) {
        return this.publicService.uploadInquiryMedia(tenant.site.id, file);
    }
}
