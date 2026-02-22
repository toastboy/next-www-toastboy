import { ZodError } from 'zod';

import { APP_ERROR_CODE, type AppErrorCode } from '@/lib/errors/ErrorCode';

/**
 * Default message that is safe to show to end users when an error does not
 * provide a more specific public-facing message.
 */
export const DEFAULT_PUBLIC_ERROR_MESSAGE = 'Something went wrong.';

/**
 * Constructor input for {@link AppError}.
 *
 * @template TCode The specific app-level error code represented by this error.
 * @template TDetails Optional typed payload containing structured context.
 */
interface AppErrorInit<TCode extends AppErrorCode, TDetails = unknown> {
    /**
     * Stable machine-readable code used for classification, analytics,
     * and observability filtering.
     */
    code: TCode;
    /**
     * Internal developer-oriented message suitable for logs and debugging.
     */
    message: string;
    /**
     * Optional upstream cause (native Error `cause` support).
     */
    cause?: unknown;
    /**
     * Optional strongly typed details payload with extra context.
     */
    details?: TDetails;
    /**
     * Indicates whether this error is expected as part of normal application
     * behaviour (validation failures, business rule rejections, etc.).
     *
     * `true` by default when omitted.
     */
    expected?: boolean;
    /**
     * Safe message intended for UI/API responses.
     */
    publicMessage?: string;
}

/**
 * Shared options accepted by concrete error subclasses.
 *
 * @template TDetails Optional typed payload containing structured context.
 */
interface ErrorOptionsWithDetails<TDetails = unknown> {
    /**
     * Optional upstream cause (native Error `cause` support).
     */
    cause?: unknown;
    /**
     * Optional strongly typed details payload with extra context.
     */
    details?: TDetails;
    /**
     * Safe message intended for UI/API responses.
     */
    publicMessage?: string;
}

/**
 * Base class for typed domain/application errors.
 *
 * This class standardises:
 * - a machine-readable error code;
 * - expected vs unexpected classification;
 * - a safe public-facing message;
 * - optional typed details payload.
 *
 * @template TCode The specific app-level error code represented by this error.
 * @template TDetails Optional typed payload containing structured context.
 */
export class AppError<TCode extends AppErrorCode = AppErrorCode, TDetails = unknown> extends Error {
    /**
     * Stable machine-readable code used for classification and monitoring.
     */
    readonly code: TCode;
    /**
     * Marks whether this error is expected during normal operation.
     */
    readonly expected: boolean;
    /**
     * Optional strongly typed details payload for structured context.
     */
    readonly details?: TDetails;
    /**
     * Safe message intended to be shown to end users.
     */
    readonly publicMessage: string;

    /**
     * Creates a typed application error.
     *
     * @param init Initialiser containing code, message, and optional metadata.
     */
    constructor(init: AppErrorInit<TCode, TDetails>) {
        super(init.message, { cause: init.cause });
        this.name = new.target.name;
        this.code = init.code;
        this.expected = init.expected ?? true;
        this.details = init.details;
        this.publicMessage = init.publicMessage ?? DEFAULT_PUBLIC_ERROR_MESSAGE;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Error indicating request or payload validation failure.
 *
 * These errors are expected and usually map to 400-level responses.
 *
 * @template TDetails Optional typed payload containing structured context.
 */
export class ValidationError<TDetails = unknown> extends AppError<typeof APP_ERROR_CODE.Validation, TDetails> {
    /**
     * @param message Internal developer-oriented message.
     * @param options Optional cause/details/public message metadata.
     */
    constructor(message = 'Validation failed.', options: ErrorOptionsWithDetails<TDetails> = {}) {
        super({
            code: APP_ERROR_CODE.Validation,
            message,
            expected: true,
            cause: options.cause,
            details: options.details,
            publicMessage: options.publicMessage ?? 'Invalid request.',
        });
    }
}

/**
 * Error indicating that a requested resource does not exist.
 *
 * These errors are expected and usually map to HTTP 404.
 *
 * @template TDetails Optional typed payload containing structured context.
 */
export class NotFoundError<TDetails = unknown> extends AppError<typeof APP_ERROR_CODE.NotFound, TDetails> {
    /**
     * @param message Internal developer-oriented message.
     * @param options Optional cause/details/public message metadata.
     */
    constructor(message = 'Resource not found.', options: ErrorOptionsWithDetails<TDetails> = {}) {
        super({
            code: APP_ERROR_CODE.NotFound,
            message,
            expected: true,
            cause: options.cause,
            details: options.details,
            publicMessage: options.publicMessage ?? 'Not found.',
        });
    }
}

/**
 * Error indicating authentication or authorization failure.
 *
 * These errors are expected and usually map to HTTP 401/403.
 *
 * @template TDetails Optional typed payload containing structured context.
 */
export class AuthError<TDetails = unknown> extends AppError<typeof APP_ERROR_CODE.Auth, TDetails> {
    /**
     * @param message Internal developer-oriented message.
     * @param options Optional cause/details/public message metadata.
     */
    constructor(message = 'Authorization failed.', options: ErrorOptionsWithDetails<TDetails> = {}) {
        super({
            code: APP_ERROR_CODE.Auth,
            message,
            expected: true,
            cause: options.cause,
            details: options.details,
            publicMessage: options.publicMessage ?? 'You are not authorized to perform this action.',
        });
    }
}

/**
 * Error indicating a business/data conflict (duplicate state, invalid transition,
 * etc.).
 *
 * These errors are expected and commonly map to HTTP 409.
 *
 * @template TDetails Optional typed payload containing structured context.
 */
export class ConflictError<TDetails = unknown> extends AppError<typeof APP_ERROR_CODE.Conflict, TDetails> {
    /**
     * @param message Internal developer-oriented message.
     * @param options Optional cause/details/public message metadata.
     */
    constructor(message = 'Resource conflict.', options: ErrorOptionsWithDetails<TDetails> = {}) {
        super({
            code: APP_ERROR_CODE.Conflict,
            message,
            expected: true,
            cause: options.cause,
            details: options.details,
            publicMessage: options.publicMessage ?? 'The request conflicts with existing data.',
        });
    }
}

/**
 * Error indicating a dependency outside this service failed (SMTP, cloud API,
 * auth provider, etc.).
 *
 * These errors are marked unexpected by default.
 *
 * @template TDetails Optional typed payload containing structured context.
 */
export class ExternalServiceError<TDetails = unknown> extends AppError<typeof APP_ERROR_CODE.ExternalService, TDetails> {
    /**
     * @param message Internal developer-oriented message.
     * @param options Optional cause/details/public message metadata.
     */
    constructor(message = 'External service failed.', options: ErrorOptionsWithDetails<TDetails> = {}) {
        super({
            code: APP_ERROR_CODE.ExternalService,
            message,
            expected: false,
            cause: options.cause,
            details: options.details,
            publicMessage: options.publicMessage ?? 'A required service is currently unavailable.',
        });
    }
}

/**
 * Error indicating an internal application failure.
 *
 * These errors are marked unexpected by default.
 *
 * @template TDetails Optional typed payload containing structured context.
 */
export class InternalError<TDetails = unknown> extends AppError<typeof APP_ERROR_CODE.Internal, TDetails> {
    /**
     * @param message Internal developer-oriented message.
     * @param options Optional cause/details/public message metadata.
     */
    constructor(message = 'Internal application error.', options: ErrorOptionsWithDetails<TDetails> = {}) {
        super({
            code: APP_ERROR_CODE.Internal,
            message,
            expected: false,
            cause: options.cause,
            details: options.details,
            publicMessage: options.publicMessage ?? DEFAULT_PUBLIC_ERROR_MESSAGE,
        });
    }
}

/**
 * Type guard that narrows unknown values to {@link AppError}.
 *
 * @param error Unknown value to test.
 * @returns `true` when the value is an AppError instance.
 */
export const isAppError = (error: unknown): error is AppError =>
    error instanceof AppError;

/**
 * Determines whether an error should be treated as expected.
 *
 * Classification rules:
 * - {@link AppError}: defer to its `expected` flag.
 * - {@link ZodError}: always expected (validation failures).
 * - Any other error/value: unexpected.
 *
 * @param error Unknown value to classify.
 * @returns `true` when the error is expected; otherwise `false`.
 */
export const isExpectedError = (error: unknown): boolean => {
    if (error instanceof AppError) {
        return error.expected;
    }

    if (error instanceof ZodError) {
        return true;
    }

    return false;
};

/**
 * Returns a safe user-facing message for any unknown error.
 *
 * Message resolution order:
 * 1. {@link AppError.publicMessage}
 * 2. Generic validation message for {@link ZodError}
 * 3. Caller-provided fallback
 *
 * @param error Unknown value to transform.
 * @param fallback Message used when no richer public message is available.
 * @returns A safe string suitable for UI/API consumers.
 */
export const toPublicMessage = (
    error: unknown,
    fallback = DEFAULT_PUBLIC_ERROR_MESSAGE,
): string => {
    if (error instanceof AppError) {
        return error.publicMessage;
    }

    if (error instanceof ZodError) {
        return 'Invalid request.';
    }

    return fallback;
};
