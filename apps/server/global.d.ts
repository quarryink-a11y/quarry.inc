import type { JwtPayload, ResolvedTenant } from 'src/shared/types';

declare global {
    interface Request {
        /**
         * [NOTE]: This is a custom property added to the Request object to store the authenticated user's information.
         */
        user?: JwtPayload;

        /**
         * [NOTE]: This is a custom property added to the Request object to store cookies, if needed for any reason.
         */
        cookies?: Record<string, string>;
    }

    type Nullable<T> = T | null;
    type Optional<T> = T | undefined;
}

declare module 'express-serve-static-core' {
    interface Request {
        /**
         * [NOTE]: Populated by TenantResolutionGuard. Contains the resolved site and domain for the current request.
         */
        resolvedTenant?: ResolvedTenant;
    }
}
