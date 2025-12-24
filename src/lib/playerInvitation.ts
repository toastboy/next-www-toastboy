import 'server-only';

import crypto from 'crypto';

const TOKEN_BYTES = 32;
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export function createPlayerInvitationToken() {
    const token = crypto.randomBytes(TOKEN_BYTES).toString('hex');
    const tokenHash = hashPlayerInvitationToken(token);
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

    return { token, tokenHash, expiresAt };
}

export function hashPlayerInvitationToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
}
