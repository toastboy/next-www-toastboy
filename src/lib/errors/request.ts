import {
    type AppError,
    AuthError,
    ConflictError,
    ExternalServiceError,
    InternalError,
    NotFoundError,
    ValidationError,
} from '@/lib/errors/AppError';

/**
 * Structured context attached to errors created from failed HTTP responses.
 */
export interface RequestErrorDetails {
    status: number;
    statusText: string;
    url?: string;
    method?: string;
}

interface ToRequestErrorOptions {
    method?: string;
    fallbackMessage?: string;
}

/**
 * Best-effort extraction of a public-facing message from a failed HTTP
 * response body.
 */
const extractResponseMessage = (bodyText: string): string | undefined => {
    const trimmed = bodyText.trim();
    if (!trimmed) {
        return undefined;
    }

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
            const parsed = JSON.parse(trimmed) as unknown;
            if (parsed && typeof parsed === 'object') {
                if ('message' in parsed && typeof parsed.message === 'string') {
                    return parsed.message;
                }
                if ('error' in parsed && typeof parsed.error === 'string') {
                    return parsed.error;
                }
            }
        } catch {
            // Fall through to plain-text handling when JSON parsing fails.
        }
    }

    return trimmed.replace(/^Error:\s*/i, '');
};

/**
 * Creates a typed app error from a non-2xx HTTP response.
 *
 * Status codes are mapped to existing AppError subclasses so callers can
 * preserve expected/unsupported classification semantics.
 */
export const toRequestError = async (
    response: Response,
    options: ToRequestErrorOptions = {},
): Promise<AppError> => {
    const bodyText = await response.text().catch(() => '');
    const extractedMessage = extractResponseMessage(bodyText);
    const fallbackMessage = options.fallbackMessage ?? 'Request failed.';
    const publicMessage = extractedMessage ?? fallbackMessage;
    const details: RequestErrorDetails = {
        status: response.status,
        statusText: response.statusText,
        url: response.url || undefined,
        method: options.method,
    };
    const internalMessage = `HTTP ${response.status} ${response.statusText}${response.url ? ` for ${response.url}` : ''}`;

    switch (response.status) {
        case 400:
            return new ValidationError(internalMessage, {
                publicMessage,
                details,
            });
        case 401:
        case 403:
            return new AuthError(internalMessage, {
                publicMessage,
                details,
            });
        case 404:
            return new NotFoundError(internalMessage, {
                publicMessage,
                details,
            });
        case 409:
            return new ConflictError(internalMessage, {
                publicMessage,
                details,
            });
        case 502:
        case 503:
        case 504:
            return new ExternalServiceError(internalMessage, {
                publicMessage,
                details,
            });
        default:
            if (response.status >= 400 && response.status < 500) {
                return new ValidationError(internalMessage, {
                    publicMessage,
                    details,
                });
            }
            return new InternalError(internalMessage, {
                publicMessage,
                details,
            });
    }
};

/**
 * Throws a typed error for non-2xx responses and returns the original response
 * when successful.
 */
export const assertOkResponse = async (
    response: Response,
    options: ToRequestErrorOptions = {},
): Promise<Response> => {
    if (response.ok) {
        return response;
    }

    throw await toRequestError(response, options);
};
