import type { Role } from 'generated/prisma/enums';

export interface JwtPayload {
    sub: string;
    role: Role;
}

export interface GetTokensResult {
    accessToken: Nullable<string>;
    refreshToken: Nullable<string>;
}

export type ResolutionType = 'custom' | 'platform_subdomain' | 'preview';

export interface ResolvedTenantDomain {
    id: string;
    host: string;
    kind: ResolutionType;
    is_verified: boolean;
    is_primary: boolean;
}

export interface ResolvedTenantSite {
    id: string;
    status: string;
}

export interface ResolvedTenant {
    site: ResolvedTenantSite;
    domain: ResolvedTenantDomain;
    resolutionType: ResolutionType;
}
