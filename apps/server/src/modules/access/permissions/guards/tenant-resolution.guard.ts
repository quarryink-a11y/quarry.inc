import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { TenantResolutionService } from 'src/modules/sites/tenant-resolution/tenant-resolution.service';

import { REQUIRE_TENANT_KEY } from '../decorators/require-tenant.decorator';

@Injectable()
export class TenantResolutionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly tenantResolutionService: TenantResolutionService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requireTenant = this.reflector.getAllAndOverride<boolean>(REQUIRE_TENANT_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requireTenant) return true;

        const request = context.switchToHttp().getRequest<Request>();
        const host = this.extractHost(request);

        request.resolvedTenant = await this.tenantResolutionService.resolve(host);

        return true;
    }

    private extractHost(request: Request): string {
        // x-forwarded-host is set by Next.js BFF when proxying public API calls
        // so the backend sees the real site domain, not the Next.js server host
        const forwarded = request.headers['x-forwarded-host'];
        if (forwarded) {
            const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
            return raw.replace(/:\d+$/, '');
        }

        const raw = request.headers.host ?? '';
        return raw.replace(/:\d+$/, '');
    }
}
