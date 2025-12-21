import { handleGET } from 'lib/api';
import { NextRequest } from 'next/server';
import clubSupporterService from 'services/ClubSupporter';
import playerService from 'services/Player';

/**
 * Handles a GET request to retrieve the clubs associated with a specific player.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including `id`.
 * @returns A promise resolving to the list of clubs supported by the player, or `null` if the player is not found.
 *
 * The function uses `playerService` to fetch the player by their ID and
 * `clubSupporterService` to retrieve the clubs associated with the player.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    const playerId = Number(params.id);

    return handleGET(
        async () => {
            if (Number.isNaN(playerId)) return null;
            const player = await playerService.getById(playerId);
            if (!player) { return null; }
            return await clubSupporterService.getByPlayer(player.id);
        },
        { params },
    );
};
