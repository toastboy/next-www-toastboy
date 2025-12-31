import 'server-only';

import crypto from 'crypto';

const DEFAULT_TOKEN_BYTES = 32;
const DEFAULT_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

/**
 * Creates a verification token along with its hashed representation and expiry
 * timestamp.
 *
 * @param ttlMs - Optional time-to-live for the token in milliseconds. Defaults
 * to {@link DEFAULT_TOKEN_TTL_MS}.
 * @returns An object containing the plaintext token, its hashed value, and the
 * expiration date.
 */
export function createVerificationToken(ttlMs: number = DEFAULT_TOKEN_TTL_MS) {
    const token = crypto.randomBytes(DEFAULT_TOKEN_BYTES).toString('hex');
    const tokenHash = hashVerificationToken(token);
    const expiresAt = new Date(Date.now() + ttlMs);

    return { token, tokenHash, expiresAt };
}

/**
 * Generates a SHA-256 hash of the provided verification token and returns it as
 * a hexadecimal string.
 *
 * @param token - The verification token to hash.
 * @returns The hexadecimal digest of the token's SHA-256 hash.
 */
export function hashVerificationToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
}
