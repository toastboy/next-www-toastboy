import { buildAdminOnlyResponse, handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import arseService from 'services/Arse';
import playerService from 'services/Player';

/**
 * Handles a GET request to retrieve data related to a player's "arse" based on their ID or login.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including `idOrLogin`.
 * @returns A Promise resolving to the player's "arse" data if the player exists, or `null` otherwise.
 *
 * The function uses `handleGET` to process the request, ensuring it adheres to admin-only access rules
 * via `buildAdminOnlyResponse`.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(
        async () => {
            const player = await playerService.getByIdOrLogin(params.idOrLogin);
            return player ? arseService.getByPlayer(player.id) : null;
        },
        { params },
        { buildResponse: buildAdminOnlyResponse },
    );
};
