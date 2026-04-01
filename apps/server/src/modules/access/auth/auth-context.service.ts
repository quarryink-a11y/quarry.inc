import { Injectable } from '@nestjs/common';

import { AppException, ErrorCode, HttpStatus } from '@/shared/errors';
import { PrismaService } from '@/shared/infrastructure/modules/prisma/prisma.service';

@Injectable()
export class AuthContextService {
    constructor(private readonly prisma: PrismaService) {}

    async getUserOwnerSiteOrThrow(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                owner: {
                    include: {
                        site: true,
                    },
                },
            },
        });

        if (!user) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.USER_NOT_FOUND,
                message: 'User not found',
            });
        }

        if (!user.owner) {
            throw new AppException({
                status: HttpStatus.FORBIDDEN,
                code: ErrorCode.FORBIDDEN,
                message: 'Owner context not found',
            });
        }

        if (!user.owner.site) {
            throw new AppException({
                status: HttpStatus.FORBIDDEN,
                code: ErrorCode.FORBIDDEN,
                message: 'Site context not found',
            });
        }

        return {
            user,
            owner: user.owner,
            site: user.owner.site,
        };
    }
}
