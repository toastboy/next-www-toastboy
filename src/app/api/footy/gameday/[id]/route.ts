import { handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import gameDayService from 'services/GameDay';

/**
 * Handles the GET request for retrieving game day information by ID.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including the `id` of the game day.
 * @returns A Promise resolving to the response of the `handleGET` function, which fetches game day data.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(
        () => gameDayService.get(parseInt(params.id)),
        { params },
    );
};
