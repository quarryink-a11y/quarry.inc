import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

export const GetDomainName = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const host = request.headers.host;
    const withoutPort = host?.split(':')[0] ?? '';
    const protocol = request.protocol;
    const fullUrl = `${protocol}://${withoutPort}`;

    return fullUrl;
});
