import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { JwtPayload } from 'src/shared/types';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): Nullable<JwtPayload> => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request?.user ?? null;
});
