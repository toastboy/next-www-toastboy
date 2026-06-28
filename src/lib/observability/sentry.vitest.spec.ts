import * as Sentry from '@sentry/nextjs';
import z from 'zod';

import { ExternalServiceError, ValidationError } from '@/lib/errors';
import { captureUnexpectedError, isSensitiveKey } from '@/lib/observability/sentry';

/**
 * Test-only mock for the Sentry Next.js SDK that intercepts all Sentry calls
 * so tests can assert on captured exceptions without sending any real events.
 */
vi.mock('@sentry/nextjs', () => ({
    captureException: vi.fn(),
}));

describe('captureUnexpectedError', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('captures unexpected errors with normalized tags and sanitized extras', () => {
        const error = new Error('Boom');
        const captured = captureUnexpectedError(error, {
            layer: 'client',
            component: 'MoneyForm',
            action: 'payDebt',
            route: '/footy/admin/money',
            tags: {
                attempt: 1,
                retry: false,
            },
            extra: {
                playerId: 42,
                token: 'abc123',
                nested: {
                    password: 'secret',
                    safe: 'value',
                },
                list: [
                    { authorization: 'Bearer token' },
                    { count: 2 },
                ],
            },
        });

        expect(captured).toBe(true);
        expect(Sentry.captureException).toHaveBeenCalledTimes(1);

        const [, options] = vi.mocked(Sentry.captureException).mock.calls[0] as [Error, {
            tags?: Record<string, string>;
            extra?: Record<string, unknown>;
        }];

        expect(options.tags).toEqual(expect.objectContaining({
            layer: 'client',
            component: 'MoneyForm',
            action: 'payDebt',
            route: '/footy/admin/money',
            attempt: '1',
            retry: 'false',
        }));

        expect(options.extra).toMatchObject({
            playerId: 42,
            token: '[REDACTED]',
            nested: {
                password: '[REDACTED]',
                safe: 'value',
            },
            list: [
                { authorization: '[REDACTED]' },
                { count: 2 },
            ],
        });
    });

    it('skips expected AppError instances', () => {
        const captured = captureUnexpectedError(new ValidationError('Bad input'));

        expect(captured).toBe(false);
        expect(Sentry.captureException).not.toHaveBeenCalled();
    });

    it('skips zod validation errors', () => {
        const result = z.object({
            id: z.number(),
        }).safeParse({ id: 'nope' });

        if (result.success) {
            throw new Error('Expected parse to fail.');
        }

        const captured = captureUnexpectedError(result.error);

        expect(captured).toBe(false);
        expect(Sentry.captureException).not.toHaveBeenCalled();
    });

    it('normalizes non-Error throwables before capture', () => {
        const captured = captureUnexpectedError('boom');

        expect(captured).toBe(true);
        expect(Sentry.captureException).toHaveBeenCalledTimes(1);

        const [capturedError, options] = vi.mocked(Sentry.captureException).mock.calls[0] as [Error, {
            extra?: Record<string, unknown>;
        }];

        expect(capturedError).toBeInstanceOf(Error);
        expect(capturedError.message).toBe('Non-Error value thrown.');
        expect(options.extra).toMatchObject({
            thrownValue: 'boom',
        });
    });

    it('adds app_error_code tag for unexpected AppError instances', () => {
        const error = new ExternalServiceError('Graph API call failed');
        captureUnexpectedError(error);

        const [, options] = vi.mocked(Sentry.captureException).mock.calls[0] as [Error, {
            tags?: Record<string, string>;
        }];

        expect(options.tags).toMatchObject({
            app_error_code: 'EXTERNAL_SERVICE_ERROR',
        });
    });

    it('omits tags and extra from the Sentry call when context is empty', () => {
        captureUnexpectedError(new Error('bare error'));

        const [, options] = vi.mocked(Sentry.captureException).mock.calls[0] as [Error, {
            tags?: Record<string, string>;
            extra?: Record<string, unknown>;
            fingerprint?: string[];
        }];

        expect(options.tags).toBeUndefined();
        expect(options.extra).toBeUndefined();
        expect(options.fingerprint).toBeUndefined();
    });

    it('passes fingerprint override through to Sentry', () => {
        captureUnexpectedError(new Error('grouped'), {
            fingerprint: ['custom-group', 'route:/footy/games'],
        });

        const [, options] = vi.mocked(Sentry.captureException).mock.calls[0] as [Error, {
            fingerprint?: string[];
        }];

        expect(options.fingerprint).toEqual(['custom-group', 'route:/footy/games']);
    });

    it('omits tag entries whose values are null or undefined', () => {
        captureUnexpectedError(new Error('nullish tags'), {
            tags: {
                present: 'yes',
                absent: null,
                alsoAbsent: undefined,
            },
        });

        const [, options] = vi.mocked(Sentry.captureException).mock.calls[0] as [Error, {
            tags?: Record<string, string>;
        }];

        expect(options.tags).toHaveProperty('present', 'yes');
        expect(options.tags).not.toHaveProperty('absent');
        expect(options.tags).not.toHaveProperty('alsoAbsent');
    });

    it('converts Date values in extra to ISO strings', () => {
        const createdAt = new Date('2026-02-22T10:30:45.123Z');
        captureUnexpectedError(new Error('dated'), { extra: { createdAt } });

        const [, options] = vi.mocked(Sentry.captureException).mock.calls[0] as [Error, {
            extra?: Record<string, unknown>;
        }];

        expect(options.extra?.createdAt).toBe('2026-02-22T10:30:45.123Z');
    });

    it('sanitizes Error objects in extra to name and message only', () => {
        const cause = new TypeError('inner failure');
        captureUnexpectedError(new Error('outer'), { extra: { cause } });

        const [, options] = vi.mocked(Sentry.captureException).mock.calls[0] as [Error, {
            extra?: Record<string, unknown>;
        }];

        expect(options.extra?.cause).toEqual({ name: 'TypeError', message: 'inner failure' });
        expect(options.extra?.cause).not.toHaveProperty('stack');
    });

    it('truncates extra values that exceed the maximum nesting depth', () => {
        captureUnexpectedError(new Error('deep'), {
            extra: {
                l1: { l2: { l3: { l4: { l5: { l6: 'should-be-truncated' } } } } },
            },
        });

        const [, options] = vi.mocked(Sentry.captureException).mock.calls[0] as [Error, {
            extra?: Record<string, unknown>;
        }];

        const deep = (options.extra!);
        interface Nested { l2: { l3: { l4: { l5: { l6: unknown } } } } }
        expect(((deep.l1 as Nested).l2.l3.l4.l5).l6).toBe('[TRUNCATED]');
    });
});

describe('isSensitiveKey', () => {
    it('identifies sensitive key names', () => {
        expect(isSensitiveKey('token')).toBe(true);
        expect(isSensitiveKey('Authorization')).toBe(true);
        expect(isSensitiveKey('password')).toBe(true);
        expect(isSensitiveKey('playerId')).toBe(false);
    });
});
