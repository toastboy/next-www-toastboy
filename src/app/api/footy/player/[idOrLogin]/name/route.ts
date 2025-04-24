import { handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import playerService from 'services/Player';

/**
 * Handles a GET request to retrieve the name of a player based on their ID or
 * login. There's no need to take account of the logged in user role because
 * `playerService.getName()` already anonymises as necessary.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters,
 * including `idOrLogin`.
 * @returns A promise that resolves to the player's name if found, or `null` if
 * the player does not exist.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(
        async () => {
            const player = await playerService.getByIdOrLogin(params.idOrLogin);
            if (!player) { return null; }
            return playerService.getName(player);
        },
        { params },
    );
};
