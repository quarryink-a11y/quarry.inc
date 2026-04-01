import { Injectable } from '@nestjs/common';
import { MediaStatus } from 'generated/prisma/enums';

import { AuthContextService } from '@/modules/access/auth/auth-context.service';
import { FILE_SIZE_LIMIT } from '@/shared/constants';
import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';
import { CloudinaryService } from '@/shared/infrastructure/modules/cloudinary/cloudinary.service';
import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';

import { MediaUploadResponseDto } from './dto';

@Injectable()
export class MediaService {
    constructor(
        private readonly cloudinary: CloudinaryService,
        private readonly prisma: PrismaService,
        private readonly authContext: AuthContextService
    ) {}

    async upload(files: Express.Multer.File[], userId: string): Promise<MediaUploadResponseDto[]> {
        if (!files || files.length === 0) {
            throw new AppException({
                status: HttpStatus.BAD_REQUEST,
                code: ErrorCode.MEDIA_UPLOAD_EMPTY,
                message: 'No files provided for upload',
            });
        }

        const { site } = await this.authContext.getUserOwnerSiteOrThrow(userId);
        const folder = `site_${site.id}`;

        const results: MediaUploadResponseDto[] = [];

        for (const file of files) {
            if (file.size > FILE_SIZE_LIMIT[0]) {
                throw new AppException({
                    status: HttpStatus.BAD_REQUEST,
                    code: ErrorCode.MEDIA_FILE_TOO_LARGE,
                    message: `File "${file.originalname}" exceeds the ${FILE_SIZE_LIMIT[1]}MB limit`,
                });
            }

            const resourceType = this.inferResourceType(file.mimetype);

            const uploaded = await this.cloudinary.uploadBuffer({
                buffer: file.buffer,
                filename: file.originalname,
                mimetype: file.mimetype,
                folder,
            });

            const media = await this.prisma.mediaContent.create({
                data: {
                    site_id: site.id,
                    type: resourceType === 'video' ? 'VIDEO' : 'IMAGE',
                    url: uploaded.secure_url,
                    public_id: uploaded.public_id,
                    format: uploaded.format ?? null,
                    bytes: uploaded.bytes ?? null,
                    width: uploaded.width ?? null,
                    height: uploaded.height ?? null,
                    name: file.originalname,
                    duration: resourceType === 'video' ? Number(uploaded.duration) || null : null,
                },
            });

            results.push(MediaUploadResponseDto.fromPrisma(media));
        }

        return results;
    }

    async remove(publicId: string, userId: string): Promise<MediaUploadResponseDto> {
        const { site } = await this.authContext.getUserOwnerSiteOrThrow(userId);

        const media = await this.prisma.mediaContent.findUnique({
            where: { public_id: publicId },
        });

        if (!media) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.MEDIA_NOT_FOUND,
                message: 'Media not found',
            });
        }

        if (media.site_id !== site.id) {
            throw new AppException({
                status: HttpStatus.FORBIDDEN,
                code: ErrorCode.FORBIDDEN,
                message: 'Access denied',
            });
        }

        const result = MediaUploadResponseDto.fromPrisma(media);

        await this.cloudinary.destroy(publicId, media.type === 'IMAGE' ? 'image' : 'video');
        await this.prisma.mediaContent.delete({ where: { public_id: publicId } });

        return result;
    }

    /**
     * Transitions PENDING → ATTACHED for given publicIds within a site.
     * Call from domain services when a form referencing media is submitted.
     */
    async confirmAttachment(publicIds: string[], siteId: string): Promise<void> {
        if (publicIds.length === 0) return;

        await this.prisma.mediaContent.updateMany({
            where: {
                public_id: { in: publicIds },
                site_id: siteId,
                status: MediaStatus.PENDING,
            },
            data: { status: MediaStatus.ATTACHED },
        });
    }

    /**
     * Deletes stale PENDING media older than the given threshold.
     * Call from a scheduled job (e.g., every hour).
     */
    async cleanupPendingMedia(olderThanHours: number = 24): Promise<number> {
        const threshold = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);

        const staleMedia = await this.prisma.mediaContent.findMany({
            where: {
                status: MediaStatus.PENDING,
                created_at: { lt: threshold },
            },
            select: { public_id: true, type: true },
        });

        for (const media of staleMedia) {
            await this.cloudinary.destroy(media.public_id, media.type === 'IMAGE' ? 'image' : 'video').catch(() => {});
        }

        const result = await this.prisma.mediaContent.deleteMany({
            where: {
                status: MediaStatus.PENDING,
                created_at: { lt: threshold },
            },
        });

        return result.count;
    }

    private inferResourceType(mimetype: string): 'image' | 'video' {
        return mimetype.startsWith('video/') ? 'video' : 'image';
    }
}
