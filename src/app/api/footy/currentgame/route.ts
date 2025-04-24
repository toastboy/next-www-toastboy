import { handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import gameDayService from 'services/GameDay';

/**
 * Handles the GET request for retrieving the current game information.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing additional properties for the request.
 * @param props.params - A promise resolving to a record of route parameters.
 * @returns A promise resolving to the result of the `handleGET` function, which fetches the current game data.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(
        () => gameDayService.getCurrent(),
        { params },
    );
};
