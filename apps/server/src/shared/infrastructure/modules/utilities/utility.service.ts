import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { BCRYPT_SALT_ROUNDS, CRYPTO_HASH_ALGORITHM, CRYPTO_HASH_DIGEST_ENCODING } from 'src/shared/constants';

@Injectable()
export class UtilityService {
    // Hashing and random bytes generation using bcrypt for simplicity and security
    async hash(value: string): Promise<string> {
        return bcrypt.hash(value, BCRYPT_SALT_ROUNDS);
    }

    async compareHash(value: string, hash: string): Promise<boolean> {
        return bcrypt.compare(value, hash);
    }

    /** Deterministic SHA-256 hash — safe for DB lookups (refresh tokens). */
    hashSha256(value: string): string {
        return createHash(CRYPTO_HASH_ALGORITHM).update(value).digest(CRYPTO_HASH_DIGEST_ENCODING);
    }

    randomBytes(size: number): string {
        return randomBytes(size).toString('hex');
    }

    /**
     * Strips undefined values from a flat object, returning a plain
     * Record compatible with Prisma Json fields.
     * Returns null if the input is falsy.
     */
    stripUndefined<T extends object>(obj: T | null | undefined): { [K in keyof T]: Exclude<T[K], undefined> } | null {
        if (!obj) return null;
        return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as {
            [K in keyof T]: Exclude<T[K], undefined>;
        };
    }
}
