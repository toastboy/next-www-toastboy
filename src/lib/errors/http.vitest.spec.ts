import z from 'zod';

import {
    AuthError,
    ConflictError,
    ExternalServiceError,
    InternalError,
    NotFoundError,
    toHttpErrorResponse,
    ValidationError,
} from '@/lib/errors';
import { AppError } from '@/lib/errors/AppError';
import type { AppErrorCode } from '@/lib/errors/ErrorCode';

describe('toHttpErrorResponse', () => {
    it('maps AppError subclasses to expected status codes', () => {
        expect(toHttpErrorResponse(new ValidationError('bad input')).status).toBe(400);
        expect(toHttpErrorResponse(new NotFoundError('missing')).status).toBe(404);
        expect(toHttpErrorResponse(new AuthError('forbidden')).status).toBe(403);
        expect(toHttpErrorResponse(new ConflictError('conflict')).status).toBe(409);
        expect(toHttpErrorResponse(new ExternalServiceError('smtp down')).status).toBe(503);
        expect(toHttpErrorResponse(new InternalError('boom')).status).toBe(500);
    });

    it('returns safe public messages for AppError and ZodError', () => {
        expect(toHttpErrorResponse(new AuthError()).message).toBe('You are not authorized to perform this action.');

        const parseResult = z.object({ id: z.number() }).safeParse({ id: 'wrong' });
        expect(parseResult.success).toBe(false);
        const zodError = parseResult.error;
        expect(toHttpErrorResponse(zodError, 'Fallback').message).toBe('Invalid request.');
    });

    it('uses fallback for unknown errors', () => {
        expect(toHttpErrorResponse(new Error('raw'), 'Fallback')).toEqual({
            status: 500,
            message: 'Fallback',
        });
    });

    it('falls back to 500 for an AppError code outside the known union', () => {
        const error = new AppError({
            code: 'SOME_FUTURE_ERROR' as AppErrorCode,
            message: 'unmapped code',
        });

        expect(toHttpErrorResponse(error).status).toBe(500);
    });
});
