import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { authClient } from "./auth-client";

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
export async function handleGET<T>(
    serviceFunction: ({ params }: { params: Record<string, string> }) => Promise<T | null>,
    { params }: { params: Record<string, string> },
    buildResponse: (data: T) => Promise<NextResponse> = buildJsonResponse,
): Promise<NextResponse> {
    const data = await serviceFunction({ params });

    if (data == null) return new NextResponse('Not Found', { status: 404 });

    return buildResponse(data);
}

/**
 * Builds a JSON response with the provided data.
 *
 * @template T - The type of the data to include in the response.
 * @param data - The data to be serialized into JSON and included in the response body.
 * @returns A promise that resolves to a `NextResponse` object with the serialized JSON data,
 *          a status code of 200, and a `Content-Type` header set to `application/json`.
 */
export async function buildJsonResponse<T>(data: T): Promise<NextResponse> {
    return new NextResponse(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * Builds a PNG response with the provided data.
 *
 * @template T - The type of the data to be included in the response.
 * @param data - The data to be converted into a PNG response.
 * @returns A promise that resolves to a `NextResponse` object with the data
 *          as a PNG and the appropriate headers.
 */
export async function buildPngResponse<T>(data: T): Promise<NextResponse> {
    return new NextResponse(data as Buffer, {
        status: 200,
        headers: { 'Content-Type': 'image/png' },
    });
}

/**
 * Retrieves the role of the currently authenticated user.
 *
 * @returns A promise that resolves to one of the following roles:
 * - `'none'`: If there is no active session or the session data is null.
 * - `'user'`: If the user is authenticated but does not have an admin role.
 * - `'admin'`: If the user is authenticated and has an admin role.
 *
 * The function uses the `authClient` to fetch the current session and determines
 * the user's role based on the session data.
 */
export async function getUserRole(): Promise<'none' | 'user' | 'admin'> {
    const session = await authClient.getSession({
        fetchOptions: {
            headers: await headers(),
        },
    });

    if (session?.data === null) {
        return 'none';
    }
    else if (session?.data?.user?.role === 'admin') {
        return 'admin';
    }
    else {
        return 'user';
    }
}

/**
 * Builds a response that is restricted to admin users only.
 *
 * Depending on the user's role, this function returns different HTTP responses:
 * - If the user has no role (`'none'`), it returns a 401 Unauthorized response.
 * - If the user is a regular user (`'user'`), it returns a 403 Forbidden response.
 * - If the user is an admin (`'admin'`), it invokes the provided `buildResponse` function
 *   to generate the response using the provided `data`.
 * - For any other case, it returns a 500 Internal Server Error response.
 *
 * @template T - The type of the data to be passed to the response builder.
 * @param data - The data to be used for building the response.
 * @param buildResponse - An optional function to build the response. Defaults to `buildJsonResponse`.
 * @returns A `Promise` that resolves to a `NextResponse` object.
 */
export async function buildAdminOnlyResponse<T>(
    data: T,
    buildResponse: (data: T) => Promise<NextResponse> = buildJsonResponse,
): Promise<NextResponse> {
    switch (await getUserRole()) {
        case 'none':
            return new NextResponse('Unauthorized', { status: 401 });
        case 'user':
            return new NextResponse('Forbidden', { status: 403 });
        case 'admin':
            return buildResponse(data);
        default:
            return new NextResponse('Internal Server Error', { status: 500 });
    }
}

/**
 * Builds a response for user-only access based on the user's role.
 *
 * This function checks the user's role and returns an appropriate response:
 * - If the role is 'none', it returns a 401 Unauthorized response.
 * - If the role is 'user' or 'admin', it invokes the provided `buildResponse` function
 *   to generate the response using the given data.
 * - For any other role, it returns a 500 Internal Server Error response.
 *
 * @template T - The type of the data to be included in the response.
 * @param data - The data to be passed to the `buildResponse` function.
 * @param buildResponse - An optional function to build the response. Defaults to `buildJsonResponse`.
 * @returns A promise that resolves to a `NextResponse` object.
 */
export async function buildUserOnlyResponse<T>(
    data: T,
    buildResponse: (data: T) => Promise<NextResponse> = buildJsonResponse,
): Promise<NextResponse> {
    switch (await getUserRole()) {
        case 'none':
            return new NextResponse('Unauthorized', { status: 401 });
        case 'user':
        case 'admin':
            return buildResponse(data);
        default:
            return new NextResponse('Internal Server Error', { status: 500 });
    }
}
