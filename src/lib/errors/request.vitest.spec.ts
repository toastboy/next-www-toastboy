import { describe, expect, it } from 'vitest';

import {
    AuthError,
    ConflictError,
    ExternalServiceError,
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
