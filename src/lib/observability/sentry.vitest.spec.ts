import * as Sentry from '@sentry/nextjs';
import { z } from 'zod';

import { ValidationError } from '@/lib/errors';
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
});

describe('isSensitiveKey', () => {
    it('identifies sensitive key names', () => {
        expect(isSensitiveKey('token')).toBe(true);
        expect(isSensitiveKey('Authorization')).toBe(true);
        expect(isSensitiveKey('password')).toBe(true);
        expect(isSensitiveKey('playerId')).toBe(false);
    });
});
