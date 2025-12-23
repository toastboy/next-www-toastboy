import { NextRequest } from 'next/server';

import { buildAdminOnlyResponse, handleGET } from '@/lib/api';
import arseService from '@/services/Arse';

/**
 * Handles a GET request to retrieve data related to a player's "arse" based on their ID.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including `id`.
 * @returns A Promise resolving to the player's "arse" data if the player exists, or `null` otherwise.
 *
 * The function uses `handleGET` to process the request, ensuring it adheres to admin-only access rules
 * via `buildAdminOnlyResponse`.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    const playerId = Number(params.id);

    return handleGET(
        async () => {
            if (Number.isNaN(playerId)) return null;
            return arseService.getByPlayer(playerId);
        },
        { params },
        { buildResponse: buildAdminOnlyResponse },
    );
};
