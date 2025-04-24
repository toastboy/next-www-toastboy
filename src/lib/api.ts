import { getUserRole } from "lib/authServer";
import { NextResponse } from "next/server";
import { GameDayWithOutcomesWithPlayers, Outcome, OutcomeWithGameDay, OutcomeWithPlayer, Player, PlayerRecordWithPlayer } from "./types";

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
    hooks?: {
        sanitize?: (data: T) => Promise<T>;
        buildResponse?: (data: T) => Promise<NextResponse>;
    },
): Promise<NextResponse> {
    const sanitize = hooks?.sanitize || (async data => data);
    const buildResponse = hooks?.buildResponse || buildJsonResponse;

    const data = await serviceFunction({ params });

    if (data == null) return new NextResponse('Not Found', { status: 404 });

    const sanitizedData = await sanitize(data);

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
 * Depending on the role returned by `getUserRole`, this function removes or retains
 * specific fields from the provided player data. For users with the role 'none',
 * sensitive fields such as `login`, `email`, `born`, and optionally `firstName` and
 * `lastName` (if the `anonymous` flag is set) are removed. For other roles, the data
 * is returned as-is.
 *
 * @param data - A partial object of the `Player` type containing player data to sanitize.
 * @returns A sanitized version of the player data, with sensitive fields removed
 *          for users with the role 'none'.
 */
export async function sanitizePlayerData(data: Partial<Player>) {
    switch (await getUserRole()) {
        case 'none':
            return {
                ...data,
                login: undefined,
                email: undefined,
                born: undefined,
                ...data?.anonymous ? { firstName: undefined, lastName: undefined } : {},
                comment: undefined,
            };

        case 'user':
        case 'admin':
        default:
            return data;
    }
}

/**
 * Sanitizes the provided `OutcomeWithGameDay` data based on the user's role.
 *
 * - If the user role is 'none' or 'user', the `comment` field in the data will be removed.
 * - If the user role is 'admin' or any other role, the data will remain unchanged.
 *
 * @param data - A partial object of type `OutcomeWithGameDay` to be sanitized.
 * @returns A sanitized version of the input data based on the user's role.
 */
export async function sanitizeOutcomeWithGameDayData(data: Partial<OutcomeWithGameDay> | null) {
    switch (await getUserRole()) {
        case 'none':
        case 'user':
            return {
                ...data,
                comment: undefined,
            };

        case 'admin':
        default:
            return data;
    }
}

/**
 * Sanitizes an array of `OutcomeWithGameDay` objects by applying the
 * `sanitizeOutcomeWithGameDayData` function to each item in the array. If the
 * input data is `null`, the function returns `null`.
 *
 * @param data - An array of partial `OutcomeWithGameDay` objects or `null`.
 * @returns A promise that resolves to an array of sanitized
 * `OutcomeWithGameDay` objects, or `null` if the input is `null`.
 */
export async function sanitizeOutcomeWithGameDayArrayData(data: Partial<OutcomeWithGameDay>[] | null): Promise<Partial<OutcomeWithGameDay>[] | null> {
    if (!data) return null;
    const sanitizedData = await Promise.all(
        data.map(async (item) => {
            return await sanitizeOutcomeWithGameDayData(item);
        }),
    );
    return sanitizedData.filter((item): item is Partial<OutcomeWithGameDay> => item !== null);
}

/**
 * Builds a JSON response based on the provided data and the user's role.
 *
 * Only admins should be able to see the `comment` field.
 *
 * @param data - A partial object of type `OutcomeWithGameDay` or `null` to be included in the response.
 * @returns A promise that resolves to a JSON response containing the modified data.
 */
export async function buildOutcomeWithGameDayResponse(data: Partial<OutcomeWithGameDay> | null) {

    return buildJsonResponse(data);
}

/**
 * Sanitizes a partial `PlayerRecordWithPlayer` object by processing its `player` property
 * using the `sanitizePlayerData` function. If the input data is `null`, it returns `null`.
 *
 * @param data - A partial `PlayerRecordWithPlayer` object or `null`.
 * @returns A sanitized version of the input object with the `player` property processed,
 *          or `null` if the input is `null`.
 */
export async function sanitizePlayerRecordWithPlayerData(data: Partial<PlayerRecordWithPlayer> | null) {
    if (!data) return null;

    return {
        ...data,
        player: data.player ? await sanitizePlayerData(data.player) : undefined,
    };
}

export async function sanitizePlayerRecordWithPlayerArrayData(
    data: Partial<PlayerRecordWithPlayer>[],
): Promise<Partial<PlayerRecordWithPlayer>[]> {
    if (!data) return [];

    const sanitizedData = await Promise.all(
        data.map(async (item) => {
            return await sanitizePlayerRecordWithPlayerData(item);
        }),
    );

    return sanitizedData.filter((item): item is PlayerRecordWithPlayer => item !== null);
}

/**
 * Sanitizes the provided outcome data based on the user's role.
 *
 * Depending on the role of the user, certain fields in the `Outcome` object
 * may be removed or modified to restrict access to sensitive information.
 *
 * - For users with the role `'none'` or `'user'`, the `comment` field will be removed.
 * - For users with the role `'admin'`, the data will remain unchanged.
 *
 * @param data - The `Outcome` object to sanitize. If `null` or `undefined`, the function returns `null`.
 * @returns A sanitized version of the `Outcome` object or `null` if the input is invalid.
 */
export async function sanitizeOutcomeData(data: Outcome) {
    if (!data) return null;

    switch (await getUserRole()) {
        case 'none':
        case 'user':
            return {
                ...data,
                comment: undefined,
            };

        case 'admin':
        default:
            return data;
    }
}

/**
 * Sanitizes the provided outcome data along with its associated player data.
 *
 * This function takes a partial `OutcomeWithPlayer` object or `null` as input.
 * If the input is `null` or does not contain a `player` property, it returns `null`.
 * Otherwise, it sanitizes the outcome data and the player data separately and
 * returns a new object containing the sanitized results.
 *
 * @param data - A partial `OutcomeWithPlayer` object or `null` to be sanitized.
 * @returns A promise that resolves to the sanitized outcome with player data, or `null` if the input is invalid.
 */
export async function sanitizeOutcomeWithPlayerData(data: Partial<OutcomeWithPlayer> | null) {
    if (!data || !data.player) return null;

    return {
        ...await sanitizeOutcomeData(data as Outcome),
        player: await sanitizePlayerData(data.player),
    };
}

/**
 * Sanitizes an array of `OutcomeWithPlayer` partial objects by processing each item
 * through the `sanitizeOutcomeWithPlayerData` function and filtering out invalid entries.
 *
 * @param data - An array of partial `OutcomeWithPlayer` objects to be sanitized.
 * @returns A promise that resolves to an array of sanitized `OutcomeWithPlayer` objects
 *          where each object includes a `player` property.
 */
export async function sanitizeOutcomeWithPlayerArrayData(data: Partial<OutcomeWithPlayer>[]) {
    const sanitizedData = await Promise.all(
        data.map(async (item) => {
            return await sanitizeOutcomeWithPlayerData(item);
        }),
    );

    return sanitizedData.filter((item): item is Partial<OutcomeWithPlayer> & { player: Partial<Player> } =>
        item !== null && item.player !== undefined,
    );
}

/**
 * Sanitizes the provided `GameDayWithOutcomesWithPlayers` data by ensuring
 * that the `outcomes` property is processed and sanitized. If the input data
 * is `null`, the function returns `null`.
 *
 * @param data - The `GameDayWithOutcomesWithPlayers` object to sanitize, or `null`.
 * @returns A sanitized version of the `GameDayWithOutcomesWithPlayers` object,
 *          or `null` if the input is `null`. The `outcomes` property will be
 *          sanitized using `sanitizeOutcomeWithPlayerArrayData`, or set to an
 *          empty array if it is not present.
 */
export async function sanitizeGameDayWithOutcomesWithPlayersData(data: GameDayWithOutcomesWithPlayers | null) {
    if (!data) return null;

    return {
        ...data,
        outcomes: data.outcomes ? await sanitizeOutcomeWithPlayerArrayData(data.outcomes) : [],
    };
}

export async function sanitizeOutcomeArrayData(data: Outcome[] | null) {
    if (!data) return null;

    const sanitizedData = await Promise.all(
        data.map(async (item) => {
            return await sanitizeOutcomeData(item);
        }),
    );

    return sanitizedData.filter((item): item is Outcome => item !== null);
}
