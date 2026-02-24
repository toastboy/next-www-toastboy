import { z } from 'zod';

import {
    APP_ERROR_CODE,
    AuthError,
    ExternalServiceError,
    InternalError,
    isAppError,
    isExpectedError,
    normalizeUnknownError,
    NotFoundError,
    toPublicMessage,
    ValidationError,
} from '@/lib/errors';

describe('AppError types', () => {
    it('creates expected validation errors with default public message', () => {
        const error = new ValidationError('Email is invalid.', {
            details: { field: 'email' },
        });

        expect(isAppError(error)).toBe(true);
        expect(error.code).toBe(APP_ERROR_CODE.Validation);
        expect(error.expected).toBe(true);
        expect(error.publicMessage).toBe('Invalid request.');
        expect(error.details).toEqual({ field: 'email' });
    });

    it('creates unexpected internal errors by default', () => {
        const cause = new Error('database exploded');
        const error = new InternalError('Failed to save player.', { cause });

        expect(error.code).toBe(APP_ERROR_CODE.Internal);
        expect(error.expected).toBe(false);
        expect(error.cause).toBe(cause);
    });

    it('sets default classification for domain-style expected errors', () => {
        expect(new AuthError().expected).toBe(true);
        expect(new NotFoundError().expected).toBe(true);
        expect(new ExternalServiceError().expected).toBe(false);
    });
});

describe('error helpers', () => {
    it('classifies expected errors correctly', () => {
        expect(isExpectedError(new ValidationError())).toBe(true);
        expect(isExpectedError(new NotFoundError())).toBe(true);
        expect(isExpectedError(new InternalError())).toBe(false);
        expect(isExpectedError(new Error('plain error'))).toBe(false);
        expect(isExpectedError(z.object({ name: z.string() }).safeParse({}).error)).toBe(true);
    });

    it('returns the correct public message for different error types', () => {
        expect(toPublicMessage(new AuthError())).toBe('You are not authorized to perform this action.');
        expect(toPublicMessage(new InternalError())).toBe('Something went wrong.');

        const zodError = z.object({ id: z.number() }).safeParse({ id: 'wrong' }).error;
        expect(toPublicMessage(zodError)).toBe('Invalid request.');

        expect(toPublicMessage(new Error('raw error'), 'Fallback')).toBe('Fallback');
    });

    it('returns AppError instances unchanged during normalization', () => {
        const source = new ValidationError('Bad payload');
        const normalized = normalizeUnknownError(source);

        expect(normalized).toBe(source);
    });

    it('normalizes ZodError values to ValidationError', () => {
        const parsed = z.object({ id: z.number() }).safeParse({ id: 'wrong' });
        if (parsed.success) {
            throw new Error('Expected parsing to fail.');
        }
        const normalized = normalizeUnknownError(parsed.error, {
            details: { operation: 'parse-request' },
        });

        expect(normalized).toBeInstanceOf(ValidationError);
        expect(normalized.code).toBe(APP_ERROR_CODE.Validation);
        expect(normalized.cause).toBe(parsed.error);
        expect(normalized.details).toEqual({ operation: 'parse-request' });
    });

    it('normalizes Error instances to InternalError', () => {
        const source = new Error('database timeout');
        const normalized = normalizeUnknownError(source);

        expect(normalized).toBeInstanceOf(InternalError);
        expect(normalized.code).toBe(APP_ERROR_CODE.Internal);
        expect(normalized.cause).toBe(source);
        expect(normalized.message).toBe('database timeout');
    });

    it('normalizes non-Error throwables to InternalError', () => {
        const normalized = normalizeUnknownError('plain-string-throw');

        expect(normalized).toBeInstanceOf(InternalError);
        expect(normalized.code).toBe(APP_ERROR_CODE.Internal);
        expect(normalized.message).toBe('Non-Error value thrown.');
        expect(normalized.cause).toBe('plain-string-throw');
    });

    it('applies message, publicMessage, and details overrides when normalizing', () => {
        const source = new Error('source');
        const normalized = normalizeUnknownError(source, {
            message: 'wrapped',
            publicMessage: 'Safe',
            details: { scope: 'setDrinkers' },
        });

        expect(normalized).toBeInstanceOf(InternalError);
        expect(normalized.message).toBe('wrapped');
        expect(normalized.publicMessage).toBe('Safe');
        expect(normalized.details).toEqual({ scope: 'setDrinkers' });
    });
});
