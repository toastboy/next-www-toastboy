import {
    DEFAULT_SENTRY_IGNORE_ERRORS,
    resolveSentrySampleRate,
    scrubSentryEvent,
} from '@/lib/observability/sentryConfig';

/**
 * Saved process environment snapshot restored between tests that manipulate
 * sample-rate related environment variables.
 */
const savedEnv = {
    NODE_ENV: process.env.NODE_ENV,
    SENTRY_TRACES_SAMPLE_RATE: process.env.SENTRY_TRACES_SAMPLE_RATE,
};

describe('resolveSentrySampleRate', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.stubEnv('NODE_ENV', savedEnv.NODE_ENV ?? '');
        if (savedEnv.SENTRY_TRACES_SAMPLE_RATE === undefined) {
            delete process.env.SENTRY_TRACES_SAMPLE_RATE;
        } else {
            vi.stubEnv('SENTRY_TRACES_SAMPLE_RATE', savedEnv.SENTRY_TRACES_SAMPLE_RATE);
        }
    });

    it('uses a valid environment override when provided', () => {
        vi.stubEnv('SENTRY_TRACES_SAMPLE_RATE', '0.35');
        vi.stubEnv('NODE_ENV', 'production');

        const value = resolveSentrySampleRate({
            envVarName: 'SENTRY_TRACES_SAMPLE_RATE',
            productionDefault: 0.05,
            nonProductionDefault: 0,
        });

        expect(value).toBe(0.35);
    });

    it('clamps out-of-range environment overrides', () => {
        vi.stubEnv('SENTRY_TRACES_SAMPLE_RATE', '5');
        vi.stubEnv('NODE_ENV', 'production');

        const value = resolveSentrySampleRate({
            envVarName: 'SENTRY_TRACES_SAMPLE_RATE',
            productionDefault: 0.05,
            nonProductionDefault: 0,
        });

        expect(value).toBe(1);
    });

    it('clamps negative environment overrides to 0', () => {
        vi.stubEnv('SENTRY_TRACES_SAMPLE_RATE', '-0.5');
        vi.stubEnv('NODE_ENV', 'production');

        const value = resolveSentrySampleRate({
            envVarName: 'SENTRY_TRACES_SAMPLE_RATE',
            productionDefault: 0.05,
            nonProductionDefault: 0,
        });

        expect(value).toBe(0);
    });

    it('falls back to environment-aware defaults when override is invalid', () => {
        vi.stubEnv('SENTRY_TRACES_SAMPLE_RATE', 'not-a-number');
        vi.stubEnv('NODE_ENV', 'production');

        const productionValue = resolveSentrySampleRate({
            envVarName: 'SENTRY_TRACES_SAMPLE_RATE',
            productionDefault: 0.05,
            nonProductionDefault: 0,
        });
        expect(productionValue).toBe(0.05);

        vi.stubEnv('NODE_ENV', 'development');
        const nonProductionValue = resolveSentrySampleRate({
            envVarName: 'SENTRY_TRACES_SAMPLE_RATE',
            productionDefault: 0.05,
            nonProductionDefault: 0.01,
        });
        expect(nonProductionValue).toBe(0.01);
    });
});

describe('scrubSentryEvent', () => {
    it('redacts sensitive fields and query-string parameters', () => {
        const event = {
            request: {
                url: '/api/auth/verify?token=abc123&purpose=player-invite',
            },
            extra: {
                token: 'secret',
                nested: {
                    password: 'hunter2',
                    safe: 'ok',
                },
            },
            breadcrumbs: [
                {
                    category: 'fetch',
                    data: {
                        url: '/api/footy/auth/claim/test?token=abc123',
                    },
                },
            ],
            tags: {
                sessionToken: 'abc123',
                route: '/api/footy/auth/verify',
            },
        };

        const scrubbed = scrubSentryEvent(event);

        expect(scrubbed.request.url).toContain('token=%5BREDACTED%5D');
        expect(scrubbed.request.url).toContain('purpose=player-invite');
        expect(scrubbed.extra).toEqual({
            token: '[REDACTED]',
            nested: {
                password: '[REDACTED]',
                safe: 'ok',
            },
        });
        expect(scrubbed.tags).toEqual({
            sessionToken: '[REDACTED]',
            route: '/api/footy/auth/verify',
        });
        expect(scrubbed.breadcrumbs).toEqual([
            {
                category: 'fetch',
                data: {
                    url: '/api/footy/auth/claim/test?token=%5BREDACTED%5D',
                },
            },
        ]);
    });

    it('replaces circular references with [CIRCULAR]', () => {
        const circular: Record<string, unknown> = {
            label: 'root',
        };
        circular.self = circular;

        const event = {
            extra: {
                circular,
            },
        };

        const scrubbed = scrubSentryEvent(event);

        expect(scrubbed.extra).toEqual({
            circular: {
                label: 'root',
                self: '[CIRCULAR]',
            },
        });
    });

    it('replaces self-referencing arrays with [CIRCULAR]', () => {
        const circularArray: unknown[] = ['root'];
        circularArray.push(circularArray);

        const event = {
            extra: {
                circularArray,
            },
        };

        const scrubbed = scrubSentryEvent(event);

        expect(scrubbed.extra).toEqual({
            circularArray: ['root', '[CIRCULAR]'],
        });
    });

    it('converts Date values to ISO strings', () => {
        const createdAt = new Date('2026-02-22T10:30:45.123Z');
        const event = {
            extra: {
                createdAt,
            },
        };

        const scrubbed = scrubSentryEvent(event);

        expect(scrubbed.extra).toEqual({
            createdAt: '2026-02-22T10:30:45.123Z',
        });
    });

    it('sanitizes Error objects to name and message only', () => {
        const error = new Error('Boom');
        error.stack = 'stack trace';

        const event = {
            extra: {
                error,
            },
        };

        const scrubbed = scrubSentryEvent(event);

        expect(scrubbed.extra).toEqual({
            error: {
                name: 'Error',
                message: 'Boom',
            },
        });
        expect(scrubbed.extra.error).not.toHaveProperty('stack');
    });

    it('leaves objects beyond MAX_SCRUB_DEPTH unsanitized', () => {
        const event = {
            extra: {
                level1: {
                    level2: {
                        level3: {
                            level4: {
                                level5: {
                                    level6: {
                                        level7: {
                                            token: 'shall-be-redacted',
                                            level8: {
                                                token: 'deep-secret',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };

        const scrubbed = scrubSentryEvent(event);

        expect(scrubbed.extra.level1.level2.level3.level4.level5.level6.level7.token)
            .toBe('[REDACTED]');
        expect(scrubbed.extra.level1.level2.level3.level4.level5.level6.level7.level8.token)
            .toBe('deep-secret');
    });

    it('returns a non-object event unchanged', () => {
        expect(scrubSentryEvent(null)).toBeNull();
        expect(scrubSentryEvent('raw string')).toBe('raw string');
        expect(scrubSentryEvent(42)).toBe(42);
    });

    it('sanitizes sensitive fields from the user object', () => {
        const event = {
            user: {
                email: 'player@example.com',
                sessionToken: 'secret-session',
            },
        };

        const scrubbed = scrubSentryEvent(event);

        expect(scrubbed.user).toEqual({
            email: 'player@example.com',
            sessionToken: '[REDACTED]',
        });
    });

    it('redacts sensitive query params from absolute request URLs', () => {
        const event = {
            request: {
                url: 'https://www.toastboy.co.uk/api/auth/verify?token=abc123&purpose=invite',
            },
        };

        const scrubbed = scrubSentryEvent(event);

        expect(scrubbed.request.url).toContain('token=%5BREDACTED%5D');
        expect(scrubbed.request.url).toContain('purpose=invite');
        expect(scrubbed.request.url).toMatch(/^https:\/\/www\.toastboy\.co\.uk/);
    });

    it('redacts sensitive query params from from/to navigation fields in breadcrumbs', () => {
        const event = {
            breadcrumbs: [
                {
                    type: 'navigation',
                    from: '/old?token=abc',
                    to: '/new?session=xyz',
                },
            ],
        };

        const scrubbed = scrubSentryEvent(event);

        expect(scrubbed.breadcrumbs[0].from).toContain('token=%5BREDACTED%5D');
        expect(scrubbed.breadcrumbs[0].to).toContain('session=%5BREDACTED%5D');
    });
});

describe('DEFAULT_SENTRY_IGNORE_ERRORS', () => {
    it('includes known noisy browser errors', () => {
        expect(DEFAULT_SENTRY_IGNORE_ERRORS).toContain(
            'ResizeObserver loop limit exceeded',
        );
    });
});
