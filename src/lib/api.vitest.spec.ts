import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth.server', () => ({
    getUserRole: vi.fn(() => Promise.resolve('none')),
}));

vi.mock('@/lib/urls', () => ({
    getPublicBaseUrl: () => 'https://toastboy.co.uk',
}));

const { captureUnexpectedErrorMock } = vi.hoisted(() => ({
    captureUnexpectedErrorMock: vi.fn(),
}));

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: captureUnexpectedErrorMock,
}));

import { buildJsonErrorResponse, buildPngResponse, buildURLWithParams, handleGET } from '@/lib/api';
import { ValidationError } from '@/lib/errors';

describe('buildURLWithParams', () => {
    it('builds a URL with a relative path and params', () => {
        const url = buildURLWithParams('/footy/response', {
            token: 'abc',
            error: 'Something failed',
        });

        expect(url.origin).toBe('https://toastboy.co.uk');
        expect(url.pathname).toBe('/footy/response');
        expect(url.searchParams.get('token')).toBe('abc');
        expect(url.searchParams.get('error')).toBe('Something failed');
    });

    it('builds a URL with root path and no params', () => {
        const url = buildURLWithParams('/', {});

        expect(url.origin).toBe('https://toastboy.co.uk');
        expect(url.pathname).toBe('/');
    });

    it('prevents open redirect with absolute external URL', () => {
        const url = buildURLWithParams('https://evil.com/steal-cookies', {
            token: 'abc',
        });

        expect(url.origin).toBe('https://toastboy.co.uk');
        expect(url.pathname).toBe('/');
        expect(url.searchParams.get('token')).toBe('abc');
    });

    it('prevents open redirect with protocol-relative URL', () => {
        const url = buildURLWithParams('//evil.com/phish', {});

        expect(url.origin).toBe('https://toastboy.co.uk');
        expect(url.pathname).toBe('/');
    });

    it('allows same-origin absolute URL', () => {
        const url = buildURLWithParams('https://toastboy.co.uk/footy/profile', {
            success: 'true',
        });

        expect(url.origin).toBe('https://toastboy.co.uk');
        expect(url.pathname).toBe('/footy/profile');
        expect(url.searchParams.get('success')).toBe('true');
    });

    it('preserves query params from the base URI', () => {
        const url = buildURLWithParams('/footy/auth?existing=yes', {
            added: 'param',
        });

        expect(url.searchParams.get('existing')).toBe('yes');
        expect(url.searchParams.get('added')).toBe('param');
    });
});

describe('handleGET', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns a 200 JSON response using default sanitize and buildResponse', async () => {
        const serviceFunction = vi.fn().mockResolvedValue({ id: 1, name: 'Alice' });

        const response = await handleGET(serviceFunction, { params: { id: '1' } });

        expect(serviceFunction).toHaveBeenCalledWith({ params: { id: '1' } });
        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('application/json');
        await expect(response.json()).resolves.toEqual({ id: 1, name: 'Alice' });
    });

    it('returns 404 when the service function resolves to null', async () => {
        const serviceFunction = vi.fn().mockResolvedValue(null);

        const response = await handleGET(serviceFunction, { params: {} });

        expect(response.status).toBe(404);
        await expect(response.text()).resolves.toBe('Not Found');
    });

    it('returns 404 when the sanitize hook resolves to null', async () => {
        const serviceFunction = vi.fn().mockResolvedValue({ id: 1 });
        const sanitize = vi.fn().mockResolvedValue(null);

        const response = await handleGET(serviceFunction, { params: {} }, { sanitize });

        expect(sanitize).toHaveBeenCalledWith({ id: 1 });
        expect(response.status).toBe(404);
        await expect(response.text()).resolves.toBe('Not Found');
    });

    it('uses a custom sanitize and buildResponse hook when provided', async () => {
        const serviceFunction = vi.fn().mockResolvedValue({ id: 1, secret: 'hide-me' });
        const sanitize = vi.fn().mockResolvedValue({ id: 1 });
        const buildResponse = vi.fn().mockResolvedValue(new Response('custom', { status: 201 }));

        const response = await handleGET(serviceFunction, { params: {} }, { sanitize, buildResponse });

        expect(sanitize).toHaveBeenCalledWith({ id: 1, secret: 'hide-me' });
        expect(buildResponse).toHaveBeenCalledWith({ id: 1 });
        expect(response.status).toBe(201);
        await expect(response.text()).resolves.toBe('custom');
    });

    it('captures unexpected errors and returns a mapped error response', async () => {
        const serviceFunction = vi.fn().mockRejectedValue(new ValidationError('bad input', {
            publicMessage: 'Invalid request body.',
        }));

        const response = await handleGET(serviceFunction, { params: { id: '1' } });

        expect(captureUnexpectedErrorMock).toHaveBeenCalledTimes(1);
        expect(captureUnexpectedErrorMock).toHaveBeenCalledWith(
            expect.any(ValidationError),
            expect.objectContaining({
                layer: 'route',
                action: 'handleGET',
                extra: { params: { id: '1' } },
            }),
        );
        expect(response.status).toBe(400);
        expect(response.headers.get('Content-Type')).toBe('text/plain');
        await expect(response.text()).resolves.toBe('Error: Invalid request body.');
    });
});

describe('buildJsonErrorResponse', () => {
    it('builds a JSON error response from a typed AppError', async () => {
        const response = await buildJsonErrorResponse(new ValidationError('bad', {
            publicMessage: 'Invalid.',
        }));

        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({ message: 'Invalid.' });
    });

    it('falls back to the provided fallback message for unknown errors', async () => {
        const response = await buildJsonErrorResponse(new Error('raw'), 'Fallback message.');

        expect(response.status).toBe(500);
        await expect(response.json()).resolves.toEqual({ message: 'Fallback message.' });
    });
});

describe('buildPngResponse', () => {
    it('builds a 200 response with PNG content type and the given bytes', async () => {
        const data = Buffer.from([1, 2, 3, 4]);

        const response = await buildPngResponse(data);

        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('image/png');
        const bytes = new Uint8Array(await response.arrayBuffer());
        expect(bytes).toEqual(new Uint8Array(data));
    });
});
