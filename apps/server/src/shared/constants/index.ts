import 'dotenv/config';

import type { BinaryToTextEncoding } from 'crypto';

const DEFAULT_JWT_SECRET = 'default_secret_256_key';
const DEFAULT_JWT_EXPIRES_IN = '15m';
const REFRESH_TTL_DAYS = 15; // Refresh token time-to-live in days
const CRYPTO_HASH_ALGORITHM = 'sha256';
const CRYPTO_HASH_DIGEST_ENCODING: BinaryToTextEncoding = 'hex';
const BCRYPT_SALT_ROUNDS = 12;

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const ENV_FILE_PATH = IS_PRODUCTION ? '.env.production' : '.env.development';

/**
 * File size limits in bytes and megabytes for media uploads
 * - 20MB = 20 * 1024 * 1024 bytes
 * - 20MB = 20 megabytes
 */
const FILE_SIZE_LIMIT = [20 * 1024 * 1024, 20];

export {
    BCRYPT_SALT_ROUNDS,
    CRYPTO_HASH_ALGORITHM,
    CRYPTO_HASH_DIGEST_ENCODING,
    DEFAULT_JWT_EXPIRES_IN,
    DEFAULT_JWT_SECRET,
    ENV_FILE_PATH,
    FILE_SIZE_LIMIT,
    IS_DEVELOPMENT,
    IS_PRODUCTION,
    REFRESH_TTL_DAYS,
};
