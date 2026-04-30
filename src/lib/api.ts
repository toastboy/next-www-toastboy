import { NextResponse } from 'next/server';

import { normalizeUnknownError, toHttpErrorResponse } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';

import { getPublicBaseUrl } from './urls';

/**
 * Handles a GET request by invoking a service function and building a response.
 *
 * @template T - The type of the data returned by the service function.
 * @param serviceFunction - A function that processes the request parameters and returns a Promise
 *                          resolving to the data of type `T` or `null` if no data is found.
 * @param params - An object containing the request parameters as key-value pairs.
 * @param buildResponse - An optional function to build the response from the data. Defaults to `buildJsonResponse`.
 * @returns A Promise that resolves to a `NextResponse` object. If the service function returns `null`,
 *          a 404 response is returned. Otherwise, the response is built using the `buildResponse` function.
 */
export async function handleGET<T, S = T>(
    serviceFunction: ({ params }: { params: Record<string, string> }) => Promise<T | null>,
    { params }: { params: Record<string, string> },
    hooks?: {
        sanitize?: (data: T) => Promise<S>;
        buildResponse?: (data: S) => Promise<NextResponse>;
    },
): Promise<NextResponse> {
    try {
        // If no sanitize hook provided, pass data through (cast via unknown to satisfy TS when S != T)
        const sanitize: (data: T) => Promise<S> = hooks?.sanitize ?? (async (data: T) => await data as unknown as S);
        const buildResponse: (data: S) => Promise<NextResponse> = hooks?.buildResponse ?? buildJsonResponse;

        const data = await serviceFunction({ params });

        if (data == null) return new NextResponse('Not Found', { status: 404 });

        const sanitizedData: S = await sanitize(data);

        if (sanitizedData == null) return new NextResponse('Not Found', { status: 404 });

        return buildResponse(sanitizedData);
    } catch (error) {
        const normalizedError = normalizeUnknownError(error);
        captureUnexpectedError(normalizedError, {
            layer: 'route',
            action: 'handleGET',
            extra: {
                params,
            },
        });
        const { status, message } = toHttpErrorResponse(normalizedError);

        return new NextResponse(`Error: ${message}`, {
            status,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }
}

/**
 * Builds a JSON response with the provided data.
 *
 * @template T - The type of the data to include in the response.
 * @param data - The data to be serialized into JSON and included in the response body.
 * @returns A promise that resolves to a `NextResponse` object with the serialized JSON data,
 *          a status code of 200, and a `Content-Type` header set to `application/json`.
 */
async function buildJsonResponse<T>(data: T): Promise<NextResponse> {
    return Promise.resolve(NextResponse.json(data, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    }));
}


/**
 * Builds a JSON error response for HTTP requests.
 *
 * Converts an error object into a standardized HTTP error response with
 * appropriate status code and JSON body containing the error message.
 *
 * @param error - The error object to convert. Can be any type.
 * @param fallbackMessage - The message to use if the error cannot be converted
 * to an HTTP response. Defaults to 'Internal Server Error'.
 * @returns A promise that resolves to a NextResponse with JSON-formatted error
 * details.
 */
export async function buildJsonErrorResponse(
    error: unknown,
    fallbackMessage = 'Internal Server Error',
): Promise<NextResponse> {
    const { status, message } = toHttpErrorResponse(error, fallbackMessage);

    return Promise.resolve(NextResponse.json({ message }, {
        status,
        headers: { 'Content-Type': 'application/json' },
    }));
}

/**
 * Builds a PNG response with the provided data.
 *
 * @param data - The Buffer to be converted into a PNG response.
 * @returns A promise that resolves to a `NextResponse` object with the data
 *          as a PNG and the appropriate headers.
 */
export async function buildPngResponse(data: Buffer): Promise<NextResponse> {
    return Promise.resolve(new NextResponse(new Uint8Array(data), {
        status: 200,
        headers: { 'Content-Type': 'image/png' },
    }));
}

/**
 * Build a URL by resolving a base URI against the application's public base URL
 * and appending query parameters.
 *
 * To prevent open-redirect attacks, the resulting URL's origin must match the
 * application's public base URL. If the caller supplies an absolute URL whose
 * origin differs (e.g. `https://evil.com`), the path is discarded and the
 * application root (`/`) is used instead.
 *
 * @param baseUri - The base path or URL to resolve. Should be a relative path
 * (e.g. `/footy/response`). Absolute URLs pointing to a different origin are
 * treated as the root path.
 * @param params - An object whose keys and values will be appended as query
 * parameters. Multiple values for the same key will be appended (not replaced).
 * @returns A URL instance representing the resolved URL with the appended query
 * parameters.
 */
export function buildURLWithParams(baseUri: string, params: Record<string, string>) {
    const base = getPublicBaseUrl().toString();
    const url = new URL(baseUri, base);
    const expectedOrigin = new URL(base).origin;

    // Prevent open redirects: if the resolved origin differs from our own,
    // fall back to the application root.
    if (url.origin !== expectedOrigin) {
        return buildURLWithParams('/', params);
    }

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });

    return url;
}
