import { Controller, Delete, HttpCode, HttpStatus, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';

import { CurrentUser } from '@/modules/access/permissions/decorators';
import { FILE_SIZE_LIMIT } from '@/shared/constants';
import { ApiErrorResponseDto } from '@/shared/errors/api-error-response.dto';
import { JwtPayload } from '@/shared/types';

import { MediaRemoveRequestDto, MediaUploadResponseDto } from './dto';
import { MediaService } from './media.service';

const MAX_FILES = 10;

@Controller('media')
@ApiTags('Media')
@ApiBearerAuth()
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @HttpCode(HttpStatus.OK)
    @Post('upload')
    @ApiOperation({
        summary: 'Upload media files',
        description:
            'Upload one or more media files. Returns PENDING media — call confirmAttachment after form submit.',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
            },
            required: ['files'],
        },
    })
    @UseInterceptors(
        FilesInterceptor('files', MAX_FILES, {
            storage: memoryStorage(),
            limits: { fileSize: FILE_SIZE_LIMIT[0] },
        })
    )
    @ApiOkResponse({ description: 'Files uploaded successfully', type: MediaUploadResponseDto, isArray: true })
    @ApiForbiddenResponse({ type: ApiErrorResponseDto })
    @ApiUnauthorizedResponse({ type: ApiErrorResponseDto })
    @ApiNotFoundResponse({ type: ApiErrorResponseDto })
    upload(@UploadedFiles() files: Express.Multer.File[], @CurrentUser() user: JwtPayload) {
        return this.mediaService.upload(files, user.sub);
    }

    @HttpCode(HttpStatus.OK)
    @Delete()
    @ApiOperation({
        summary: 'Remove media by publicId',
        description: 'Remove a media file using its Cloudinary publicId',
    })
    @ApiOkResponse({ description: 'Removed', type: MediaUploadResponseDto })
    @ApiForbiddenResponse({ type: ApiErrorResponseDto })
    @ApiNotFoundResponse({ type: ApiErrorResponseDto })
    @ApiQuery({ name: 'publicId', required: true, description: 'The publicId of the media to remove' })
    remove(@Query() query: MediaRemoveRequestDto, @CurrentUser() user: JwtPayload) {
        return this.mediaService.remove(query.publicId, user.sub);
    }
}
