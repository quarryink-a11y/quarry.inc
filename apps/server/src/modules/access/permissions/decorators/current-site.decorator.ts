import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';
import type { ResolvedTenant } from 'src/shared/types';

export const CurrentSite = createParamDecorator((_data: unknown, ctx: ExecutionContext): Nullable<ResolvedTenant> => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request?.resolvedTenant ?? null;
});
