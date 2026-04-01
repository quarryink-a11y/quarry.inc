import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { AppException } from 'src/shared/errors';
import { ErrorCode } from 'src/shared/errors/error-codes';
import { PrismaService } from 'src/shared/infrastructure/modules/prisma/prisma.service';
import type { ResolutionType, ResolvedTenant } from 'src/shared/types';

const CACHE_KEY_PREFIX = 'tenant:host:';

@Injectable()
export class TenantResolutionService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(CACHE_MANAGER) private readonly cache: Cache
    ) {}

    async resolve(host: string): Promise<ResolvedTenant> {
        const cacheKey = `${CACHE_KEY_PREFIX}${host}`;
        const cached = await this.cache.get<ResolvedTenant>(cacheKey);

        if (cached) return cached;
        const siteDomain = await this.prisma.siteDomain.findUnique({
            where: { host },
            select: {
                id: true,
                host: true,
                kind: true,
                is_verified: true,
                is_primary: true,
                site: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
            },
        });

        if (!siteDomain) {
            throw new AppException({
                status: HttpStatus.NOT_FOUND,
                code: ErrorCode.SITE_NOT_FOUND,
                message: `Site not found for domain: ${host}`,
            });
        }

        const { site } = siteDomain;

        if (site.status === 'SUSPENDED') {
            throw new AppException({
                status: HttpStatus.FORBIDDEN,
                code: ErrorCode.SITE_SUSPENDED,
                message: 'This site has been suspended',
            });
        }

        if (site.status === 'INACTIVE') {
            throw new AppException({
                status: HttpStatus.FORBIDDEN,
                code: ErrorCode.SITE_INACTIVE,
                message: 'This site is inactive',
            });
        }

        const resolutionType = this.mapKindToResolutionType(siteDomain.kind);

        const resolved: ResolvedTenant = {
            site: {
                id: site.id,
                status: site.status,
            },
            domain: {
                id: siteDomain.id,
                host: siteDomain.host,
                kind: resolutionType,
                is_verified: siteDomain.is_verified,
                is_primary: siteDomain.is_primary,
            },
            resolutionType,
        };

        await this.cache.set(cacheKey, resolved);

        return resolved;
    }

    private mapKindToResolutionType(kind: string): ResolutionType {
        switch (kind) {
            case 'CUSTOM':
                return 'custom';
            case 'PLATFORM_SUBDOMAIN':
                return 'platform_subdomain';
            case 'PREVIEW':
                return 'preview';
            default:
                return 'platform_subdomain';
        }
    }
}
