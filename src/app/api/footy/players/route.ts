import { NextRequest } from 'next/server';

import { buildUserOnlyResponse, handleGET } from '@/lib/api';
import playerService from '@/services/Player';

/**
 * Handles the GET request for retrieving all players.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters.
 * @returns A promise resolving to the response of the `handleGET` function,
 *          which retrieves all players using the `playerService`.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET(
        () => playerService.getAll(),
        { params },
        { buildResponse: buildUserOnlyResponse },
    );
};
