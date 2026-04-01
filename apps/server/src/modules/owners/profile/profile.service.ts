import { Injectable } from '@nestjs/common';

import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';
import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';
import { UtilityService } from '@/shared/infrastructure/modules/utilities/utility.service';

import { UpdateProfileDto } from './dto';

@Injectable()
export class ProfileService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly util: UtilityService
    ) {}

    async getMe(userId: string) {
        const owner = await this.prisma.owner.findUnique({
            where: { user_id: userId },
            select: {
                id: true,
                role: true,
                status: true,
                profile: true,
            },
        });

        if (!owner) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: 'Owner not found',
            });
        }

        return {
            owner: {
                id: owner.id,
                role: owner.role,
                status: owner.status,
            },
            profile: owner.profile,
        };
    }

    async updateProfile(userId: string, dto: UpdateProfileDto) {
        const owner = await this.prisma.owner.findUnique({
            where: { user_id: userId },
            select: { id: true, profile: { select: { id: true } } },
        });

        if (!owner) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: 'Owner not found',
            });
        }

        if (!owner.profile) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.NOT_FOUND,
                message: 'Profile not found. Complete onboarding first.',
            });
        }

        const data = {
            ...dto,
            social_media: this.util.stripUndefined(dto.social_media) ?? undefined,
            about_blocks: dto.about_blocks?.map((b) => ({ ...b })) ?? undefined,
        };

        const updated = await this.prisma.ownerProfile.update({
            where: { id: owner.profile.id },
            data,
        });

        return updated;
    }
}
