import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const GetTokens = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const accessToken = request.cookies?.['accessToken'] ?? null;
    const refreshToken = request.cookies?.['refreshToken'] ?? null;

    return { accessToken, refreshToken };
});
