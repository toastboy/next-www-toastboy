import { ZodError } from 'zod';

import { AppError, DEFAULT_PUBLIC_ERROR_MESSAGE, toPublicMessage } from '@/lib/errors/AppError';
import type { AppErrorCode } from '@/lib/errors/ErrorCode';

/**
 * HTTP response shape derived from an unknown error.
 */
export interface HttpErrorResponse {
    status: number;
    message: string;
}

/**
 * Maps app-level error codes to canonical HTTP status codes.
 */
const resolveStatusFromCode = (code: AppErrorCode): number => {
    switch (code) {
        case 'VALIDATION_ERROR':
            return 400;
        case 'NOT_FOUND_ERROR':
            return 404;
        case 'AUTH_ERROR':
            return 403;
        case 'CONFLICT_ERROR':
            return 409;
        case 'EXTERNAL_SERVICE_ERROR':
            return 503;
        case 'INTERNAL_ERROR':
            return 500;
        default:
            return 500;
    }
};

/**
 * Resolves a safe HTTP status/message pair for API responses.
 *
 * @param error Unknown error value to classify.
 * @param fallbackMessage Message for unknown/untyped failures.
 * @returns Status code and safe message suitable for clients.
 */
export const toHttpErrorResponse = (
    error: unknown,
    fallbackMessage = DEFAULT_PUBLIC_ERROR_MESSAGE,
): HttpErrorResponse => {
    if (error instanceof AppError) {
        const appError = error as AppError<AppErrorCode>;

        return {
            status: resolveStatusFromCode(appError.code),
            message: appError.publicMessage,
        };
    }

    if (error instanceof ZodError) {
        return {
            status: 400,
            message: toPublicMessage(error, fallbackMessage),
        };
    }

    return {
        status: 500,
        message: fallbackMessage,
    };
};
