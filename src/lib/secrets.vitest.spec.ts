import * as fs from 'fs';
import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('fs', () => ({
    readFileSync: vi.fn(),
}));

const mockReadFileSync = fs.readFileSync as Mock;

/**
 * Shape of an `InternalError` thrown by `getSecrets()`. Asserted structurally
 * (name/code) rather than via `instanceof`, because these tests reload the
 * module graph with `vi.resetModules()` between cases, which produces a
 * distinct `InternalError` class per import that would never match a class
 * reference captured before the reset.
 */
interface ThrownInternalErrorLike {
    name: string;
    code: string;
    message: string;
    details?: unknown;
}

/**
 * Baseline environment with every secret populated and `NODE_ENV=test`, so
 * `getSecrets()` neither throws for missing secrets nor reads from disk unless
 * a test explicitly overrides a value.
 */
const applyBaselineEnv = () => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('SECRETS_DIR', '');
    vi.stubEnv('STORAGE_CLIENT_ID', 'storage-id');
    vi.stubEnv('STORAGE_CLIENT_SECRET', 'storage-secret');
    vi.stubEnv('AZURE_TENANT_ID', 'tenant-id');
    vi.stubEnv('BETTER_AUTH_SECRET', 'auth-secret');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://toastboy.co.uk');
    vi.stubEnv('BETTER_AUTH_URL', 'https://auth.toastboy.co.uk');
    vi.stubEnv('AUTH_GOOGLE_CLIENT_ID', 'google-id');
    vi.stubEnv('AUTH_GOOGLE_CLIENT_SECRET', 'google-secret');
    vi.stubEnv('AUTH_MICROSOFT_CLIENT_ID', 'ms-id');
    vi.stubEnv('AUTH_MICROSOFT_CLIENT_SECRET', 'ms-secret');
    vi.stubEnv('CRON_SECRET', 'cron-secret');
    vi.stubEnv('MAIL_FROM_ADDRESS', 'mail@toastboy.co.uk');
    vi.stubEnv('MAIL_FROM_NAME', 'Toastboy Mailer');
    vi.stubEnv('MAIL_GRAPH_CLIENT_ID', 'graph-id');
    vi.stubEnv('MAIL_GRAPH_CLIENT_SECRET', 'graph-secret');
};

beforeEach(() => {
    vi.resetModules();
    mockReadFileSync.mockReset();
    applyBaselineEnv();
});

afterEach(() => {
    vi.unstubAllEnvs();
});

describe('getSecrets', () => {
    it('loads secrets from process.env when SECRETS_DIR is unset', async () => {
        const { getSecrets } = await import('@/lib/secrets');
        const result = getSecrets();

        expect(result.STORAGE_CLIENT_ID).toBe('storage-id');
        expect(result.BETTER_AUTH_URL).toBe('https://auth.toastboy.co.uk');
        expect(mockReadFileSync).not.toHaveBeenCalled();
    });

    it('caches the loaded secrets across calls', async () => {
        const { getSecrets } = await import('@/lib/secrets');

        const first = getSecrets();
        const second = getSecrets();

        expect(second).toBe(first);
    });

    it('defaults BETTER_AUTH_URL to NEXT_PUBLIC_SITE_URL when unset', async () => {
        vi.stubEnv('BETTER_AUTH_URL', undefined);

        const { getSecrets } = await import('@/lib/secrets');

        expect(getSecrets().BETTER_AUTH_URL).toBe('https://toastboy.co.uk');
    });

    it('defaults BETTER_AUTH_URL to localhost when neither BETTER_AUTH_URL nor NEXT_PUBLIC_SITE_URL are set', async () => {
        vi.stubEnv('BETTER_AUTH_URL', undefined);
        vi.stubEnv('NEXT_PUBLIC_SITE_URL', undefined);

        const { getSecrets } = await import('@/lib/secrets');

        expect(getSecrets().BETTER_AUTH_URL).toBe('http://localhost:3000');
    });

    it('defaults MAIL_FROM_ADDRESS and MAIL_FROM_NAME when unset', async () => {
        vi.stubEnv('MAIL_FROM_ADDRESS', undefined);
        vi.stubEnv('MAIL_FROM_NAME', undefined);

        const { getSecrets } = await import('@/lib/secrets');
        const result = getSecrets();

        expect(result.MAIL_FROM_ADDRESS).toBe('footy@toastboy.co.uk');
        expect(result.MAIL_FROM_NAME).toBe('Toastboy FC Mailer');
    });

    describe('loading from SECRETS_DIR', () => {
        it('overrides env values with matching secret files', async () => {
            vi.stubEnv('SECRETS_DIR', '/run/secrets');
            mockReadFileSync.mockImplementation((filePath: string) => {
                if (filePath.endsWith('BETTER_AUTH_SECRET')) {
                    return 'file-auth-secret';
                }
                throw Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
            });

            const { getSecrets } = await import('@/lib/secrets');
            const result = getSecrets();

            expect(result.BETTER_AUTH_SECRET).toBe('file-auth-secret');
            expect(mockReadFileSync).toHaveBeenCalledWith(
                expect.stringContaining('BETTER_AUTH_SECRET'),
                'utf8',
            );
        });

        it('falls back to the env value when the secret file does not exist', async () => {
            vi.stubEnv('SECRETS_DIR', '/run/secrets');
            mockReadFileSync.mockImplementation(() => {
                throw Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
            });

            const { getSecrets } = await import('@/lib/secrets');
            const result = getSecrets();

            expect(result.STORAGE_CLIENT_ID).toBe('storage-id');
        });

        it('wraps and rethrows unexpected file read errors', async () => {
            vi.stubEnv('SECRETS_DIR', '/run/secrets');
            mockReadFileSync.mockImplementation(() => {
                throw Object.assign(new Error('Permission denied'), { code: 'EACCES' });
            });

            const { getSecrets } = await import('@/lib/secrets');

            let thrown: unknown;
            try {
                getSecrets();
            } catch (error) {
                thrown = error;
            }

            expect((thrown as ThrownInternalErrorLike).name).toBe('InternalError');
            expect((thrown as ThrownInternalErrorLike).message).toContain('Failed to read secret file at');
        });

        it('treats a thrown non-object value as an unexpected read error', async () => {
            vi.stubEnv('SECRETS_DIR', '/run/secrets');
            mockReadFileSync.mockImplementation(() => {
                // eslint-disable-next-line @typescript-eslint/only-throw-error
                throw 'disk exploded';
            });

            const { getSecrets } = await import('@/lib/secrets');

            let thrown: unknown;
            try {
                getSecrets();
            } catch (error) {
                thrown = error;
            }

            expect((thrown as ThrownInternalErrorLike).name).toBe('InternalError');
        });

        it('treats a thrown error object without a code property as an unexpected read error', async () => {
            vi.stubEnv('SECRETS_DIR', '/run/secrets');
            mockReadFileSync.mockImplementation(() => {
                throw new Error('generic failure');
            });

            const { getSecrets } = await import('@/lib/secrets');

            let thrown: unknown;
            try {
                getSecrets();
            } catch (error) {
                thrown = error;
            }

            expect((thrown as ThrownInternalErrorLike).name).toBe('InternalError');
        });
    });

    describe('missing secret validation', () => {
        it('does not throw for missing secrets while NODE_ENV is test', async () => {
            vi.stubEnv('CRON_SECRET', '');

            const { getSecrets } = await import('@/lib/secrets');

            expect(() => getSecrets()).not.toThrow();
        });

        it('throws InternalError for missing required secrets outside the test environment', async () => {
            vi.stubEnv('NODE_ENV', 'development');
            vi.stubEnv('CRON_SECRET', '');

            const { getSecrets } = await import('@/lib/secrets');

            let thrown: unknown;
            try {
                getSecrets();
            } catch (error) {
                thrown = error;
            }

            const details = (thrown as ThrownInternalErrorLike).details as { missingSecrets?: string[] };

            expect((thrown as ThrownInternalErrorLike).name).toBe('InternalError');
            expect(details.missingSecrets).toEqual(expect.arrayContaining(['CRON_SECRET']));
        });

        it('does not require production-only secrets outside production', async () => {
            vi.stubEnv('NODE_ENV', 'development');
            vi.stubEnv('MAIL_GRAPH_CLIENT_ID', '');
            vi.stubEnv('MAIL_GRAPH_CLIENT_SECRET', '');

            const { getSecrets } = await import('@/lib/secrets');

            expect(() => getSecrets()).not.toThrow();
        });

        it('requires production-only secrets in production', async () => {
            vi.stubEnv('NODE_ENV', 'production');
            vi.stubEnv('MAIL_GRAPH_CLIENT_ID', '');

            const { getSecrets } = await import('@/lib/secrets');

            let thrown: unknown;
            try {
                getSecrets();
            } catch (error) {
                thrown = error;
            }

            const details = (thrown as ThrownInternalErrorLike).details as { missingSecrets?: string[] };

            expect((thrown as ThrownInternalErrorLike).name).toBe('InternalError');
            expect(details.missingSecrets).toEqual(expect.arrayContaining(['MAIL_GRAPH_CLIENT_ID']));
        });
    });
});
