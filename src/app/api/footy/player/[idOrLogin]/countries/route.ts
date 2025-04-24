import { handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import countrySupporterService from 'services/CountrySupporter';
import playerService from 'services/Player';

/**
 * Handles a GET request to retrieve the countries associated with a player.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including `idOrLogin`.
 * @returns A promise resolving to the list of countries associated with the player, or `null` if the player is not found.
 *
 * This function uses `playerService` to fetch the player by their ID or login and
 * `countrySupporterService` to retrieve the countries associated with the player's ID.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(
        async () => {
            const player = await playerService.getByIdOrLogin(params.idOrLogin);
            if (!player) { return null; }
            return await countrySupporterService.getByPlayer(player.id);
        },
        { params },
    );
};
