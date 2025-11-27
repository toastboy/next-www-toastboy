import { getUserRole } from "lib/authServer";
import { NextResponse } from "next/server";
import {
    OutcomeSchema,
    PlayerSchema,
} from 'prisma/generated/schemas';
import { OutcomeType } from "prisma/generated/schemas/models/Outcome.schema";
import { PlayerType } from "prisma/generated/schemas/models/Player.schema";
import { z } from "zod";

export const PublicOutcomeSchema = OutcomeSchema.transform((outcome) => ({
    ...outcome,
    comment: undefined,
}));

export type PublicOutcome = z.infer<typeof PublicOutcomeSchema>;

export const PublicPlayerSchema = PlayerSchema.transform((player) => ({
    ...player,
    login: undefined,
    email: undefined,
    born: undefined,
    comment: undefined,
}));

export type PublicPlayer = z.infer<typeof PublicPlayerSchema>;

export const UserPlayerSchema = PlayerSchema.transform((player) => ({
    ...player,
    born: undefined,
    comment: undefined,
}));

export type UserPlayer = z.infer<typeof UserPlayerSchema>;

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
    // If no sanitize hook provided, pass data through (cast via unknown to satisfy TS when S != T)
    const sanitize: (data: T) => Promise<S> = hooks?.sanitize ?? (async (data: T) => data as unknown as S);
    const buildResponse: (data: S) => Promise<NextResponse> = hooks?.buildResponse ?? buildJsonResponse;

    const data = await serviceFunction({ params });

    if (data == null) return new NextResponse('Not Found', { status: 404 });

    const sanitizedData: S = await sanitize(data);

    if (sanitizedData == null) return new NextResponse('Not Found', { status: 404 });

    return buildResponse(sanitizedData);
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
    return NextResponse.json(data, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * Builds a PNG response with the provided data.
 *
 * @param data - The Buffer to be converted into a PNG response.
 * @returns A promise that resolves to a `NextResponse` object with the data
 *          as a PNG and the appropriate headers.
 */
export async function buildPngResponse(data: Buffer): Promise<NextResponse> {
    return new NextResponse(new Uint8Array(data), {
        status: 200,
        headers: { 'Content-Type': 'image/png' },
    });
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
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        case 'user':
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        case 'admin':
            return buildResponse(data);
        default:
            return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
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
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        case 'user':
        case 'admin':
            return buildResponse(data);
        default:
            return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * Sanitizes player data based on the user's role.
 *
 * Depending on the role of the user, the function parses the provided
 * player data using the appropriate schema or returns the data as-is.
 *
 * - If the user role is 'none', the data is parsed using `PublicPlayerSchema`.
 * - If the user role is 'user', the data is parsed using `UserPlayerSchema`.
 * - If the user role is 'admin' or any other role, the data is returned without modification.
 *
 * @param data - The player data to be sanitized.
 * @returns The sanitized player data, either parsed or unmodified.
 * @throws Will throw an error if the data does not conform to the expected schema for the user's role.
 */
export async function sanitizePlayerData(data: PlayerType) {
    try {
        switch (await getUserRole()) {
            case 'none':
                return PublicPlayerSchema.parse(data);

            case 'user':
                return UserPlayerSchema.parse(data);

            case 'admin':
            default:
                return data;
        }
    } catch (error) {
        console.error('Error sanitizing player data:', error);
        throw error;
    }
}

/**
 * Sanitizes the provided outcome data based on the user's role.
 *
 * Depending on the role returned by `getUserRole`, the function applies
 * different levels of sanitization:
 * - For roles `'none'` and `'user'`, the data is validated and sanitized
 *   using the `PublicOutcomeSchema`.
 * - For the `'admin'` role or any other role, the data is returned as-is.
 *
 * @param data - The outcome data to be sanitized.
 * @returns A promise that resolves to the sanitized outcome data.
 */
export async function sanitizeOutcomeData(data: OutcomeType) {
    try {
        switch (await getUserRole()) {
            case 'none':
            case 'user':
                return PublicOutcomeSchema.parse(data);

            case 'admin':
            default:
                return data;
        }
    } catch (error) {
        console.error('Error sanitizing outcome data:', error);
        throw error;
    }
}

/**
 * Sanitizes an array of Outcome objects by processing each item through the `sanitizeOutcomeData` function.
 *
 * @param data - An array of `Outcome` objects to be sanitized.
 * @returns A promise that resolves to an array of sanitized `Outcome` objects.
 */
export async function sanitizeOutcomeArrayData(data: OutcomeType[]) {
    return await Promise.all(data.map(async (item) => sanitizeOutcomeData(item)));
}
