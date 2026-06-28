import { describe, expect, it, vi } from 'vitest';

import { createVerificationToken, hashVerificationToken } from '@/lib/verificationToken';

describe('hashVerificationToken', () => {
    it('returns a 64-character hex SHA-256 digest', () => {
        const hash = hashVerificationToken('test-token');
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('produces the same hash for the same input', () => {
        expect(hashVerificationToken('abc')).toBe(hashVerificationToken('abc'));
    });

    it('produces different hashes for different inputs', () => {
        expect(hashVerificationToken('abc')).not.toBe(hashVerificationToken('xyz'));
    });
});

describe('createVerificationToken', () => {
    it('returns a token, its hash, and an expiry date', () => {
        const { token, tokenHash, expiresAt } = createVerificationToken();

        expect(token).toMatch(/^[0-9a-f]{64}$/);
        expect(tokenHash).toBe(hashVerificationToken(token));
        expect(expiresAt).toBeInstanceOf(Date);
    });

    it('sets expiresAt roughly 7 days in the future by default', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

        const { expiresAt } = createVerificationToken();

        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        expect(expiresAt.getTime()).toBe(new Date('2026-01-01T00:00:00Z').getTime() + sevenDaysMs);

        vi.useRealTimers();
    });

    it('respects a custom TTL', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));

        const oneHourMs = 60 * 60 * 1000;
        const { expiresAt } = createVerificationToken(oneHourMs);

        expect(expiresAt.getTime()).toBe(new Date('2026-01-01T00:00:00Z').getTime() + oneHourMs);

        vi.useRealTimers();
    });

    it('generates a unique token on each call', () => {
        const { token: token1 } = createVerificationToken();
        const { token: token2 } = createVerificationToken();
        expect(token1).not.toBe(token2);
    });
});
