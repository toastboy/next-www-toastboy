import { describe, expect, it } from 'vitest';

import {
    AuthError,
    ConflictError,
    ExternalServiceError,
    InternalError,
    NotFoundError,
    ValidationError,
} from '@/lib/errors';
import { assertOkResponse, toRequestError } from '@/lib/errors/request';

describe('toRequestError', () => {
    it('maps 404 text errors to NotFoundError', async () => {
        const response = new Response('Error: Not found.', {
            status: 404,
            statusText: 'Not Found',
        });

        const error = await toRequestError(response);

        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.publicMessage).toBe('Not found.');
    });

    it('maps 409 json message to ConflictError', async () => {
        const response = new Response(JSON.stringify({ message: 'Already exists.' }), {
            status: 409,
            statusText: 'Conflict',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const error = await toRequestError(response);

        expect(error).toBeInstanceOf(ConflictError);
        expect(error.publicMessage).toBe('Already exists.');
    });

    it('maps auth statuses to AuthError', async () => {
        const response = new Response('', {
            status: 401,
            statusText: 'Unauthorized',
        });

        const error = await toRequestError(response, {
            fallbackMessage: 'Please sign in.',
        });

        expect(error).toBeInstanceOf(AuthError);
        expect(error.publicMessage).toBe('Please sign in.');
    });

    it('maps upstream failure statuses to ExternalServiceError', async () => {
        const response = new Response('Service unavailable', {
            status: 503,
            statusText: 'Service Unavailable',
        });

        const error = await toRequestError(response);

        expect(error).toBeInstanceOf(ExternalServiceError);
        expect(error.publicMessage).toBe('Service unavailable');
    });

    it('maps unknown client statuses to ValidationError', async () => {
        const response = new Response('', {
            status: 422,
            statusText: 'Unprocessable Entity',
        });

        const error = await toRequestError(response, {
            fallbackMessage: 'Request rejected.',
        });

        expect(error).toBeInstanceOf(ValidationError);
        expect(error.publicMessage).toBe('Request rejected.');
    });

    it('maps unknown 5xx statuses to InternalError', async () => {
        const response = new Response('', {
            status: 500,
            statusText: 'Internal Server Error',
        });

        const error = await toRequestError(response);

        expect(error).toBeInstanceOf(InternalError);
    });

    it('maps a 502 bad gateway status to ExternalServiceError', async () => {
        const response = new Response('', {
            status: 502,
            statusText: 'Bad Gateway',
        });

        const error = await toRequestError(response);

        expect(error).toBeInstanceOf(ExternalServiceError);
    });

    it('extracts message from an "error" json field when "message" is absent', async () => {
        const response = new Response(JSON.stringify({ error: 'Something broke.' }), {
            status: 400,
            statusText: 'Bad Request',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const error = await toRequestError(response);

        expect(error.publicMessage).toBe('Something broke.');
    });

    it('falls back to the trimmed body text when json has neither "message" nor "error" fields', async () => {
        const response = new Response(JSON.stringify({ code: 'ERR_UNKNOWN' }), {
            status: 400,
            statusText: 'Bad Request',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const error = await toRequestError(response);

        expect(error.publicMessage).toBe(JSON.stringify({ code: 'ERR_UNKNOWN' }));
    });

    it('falls back to raw text when JSON.parse yields a non-object value (defensive guard)', async () => {
        const parseSpy = vi.spyOn(JSON, 'parse').mockReturnValueOnce(null);

        try {
            const response = new Response('{"message":"hidden"}', {
                status: 400,
                statusText: 'Bad Request',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const error = await toRequestError(response);

            expect(error.publicMessage).toBe('{"message":"hidden"}');
        } finally {
            parseSpy.mockRestore();
        }
    });

    it('falls back to an empty body and includes the URL when response.text() rejects', async () => {
        const response = {
            text: () => Promise.reject(new Error('stream error')),
            status: 500,
            statusText: 'Internal Server Error',
            url: 'https://api.toastboy.co.uk/footy/games',
        } as unknown as Response;

        const error = await toRequestError(response);

        expect(error).toBeInstanceOf(InternalError);
        expect(error.publicMessage).toBe('Request failed.');
        expect(error.message).toBe('HTTP 500 Internal Server Error for https://api.toastboy.co.uk/footy/games');
    });
});

describe('assertOkResponse', () => {
    it('returns successful responses unchanged', async () => {
        const response = new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        await expect(assertOkResponse(response)).resolves.toBe(response);
    });

    it('throws a typed AppError for failed responses', async () => {
        const response = new Response('Invalid input.', {
            status: 400,
            statusText: 'Bad Request',
        });

        await expect(assertOkResponse(response)).rejects.toBeInstanceOf(ValidationError);
    });
});
