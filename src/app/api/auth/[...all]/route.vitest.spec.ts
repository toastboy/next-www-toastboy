import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';

vi.mock('better-auth/next-js', () => ({
    toNextJsHandler: vi.fn(() => ({
        GET: vi.fn(),
        POST: vi.fn(),
    })),
}));

vi.mock('@/lib/auth', () => ({
    auth: {},
}));

import { toNextJsHandler } from 'better-auth/next-js';

import { GET, POST } from '@/app/api/auth/[...all]/route';

describe('auth/[...all]/route', () => {
    it('exports GET and POST handlers from toNextJsHandler', () => {
        expect(typeof GET).toBe('function');
        expect(typeof POST).toBe('function');
    });

    it('passes the auth instance to toNextJsHandler', () => {
        expect(toNextJsHandler as Mock).toHaveBeenCalledWith({});
    });
});
