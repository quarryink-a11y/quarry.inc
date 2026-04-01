import type { User } from 'generated/prisma/client';

interface IdentitySubject {
    id: string;
    email: string;
    passwordHash: string;
    ownerId?: string;
}

interface AuthResponse {
    user: User;
    accessToken?: string;
    refreshToken?: string;
}

export type { AuthResponse, IdentitySubject };
