import { handleGET, sanitizeOutcomeArrayData } from 'lib/api';
import { NextRequest } from 'next/server';
import outcomeService from 'services/Outcome';

/**
 * Handles a GET request to retrieve game outcomes for a specific game day and team.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including:
 *   - `gameDay`: The game day as a string, which will be parsed into an integer.
 *   - `team`: The team identifier, expected to be either 'A' or 'B'.
 * @returns A Promise resolving to the result of the `handleGET` function, which fetches
 *          game outcomes based on the provided game day and team.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(
        () => outcomeService.getByGameDay(
            parseInt(params.gameDay),
            params.team as 'A' | 'B',
        ),
        { params },
        { sanitize: sanitizeOutcomeArrayData },
    );
};
