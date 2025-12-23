import { NextRequest } from 'next/server';

import { handleGET } from '@/lib/api';
import countrySupporterService from '@/services/CountrySupporter';
import playerService from '@/services/Player';

/**
 * Handles a GET request to retrieve the countries associated with a player.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including `id`.
 * @returns A promise resolving to the list of countries associated with the player, or `null` if the player is not found.
 *
 * This function uses `playerService` to fetch the player by their ID and
 * `countrySupporterService` to retrieve the countries associated with the player's ID.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    const playerId = Number(params.id);

    return handleGET(
        async () => {
            if (Number.isNaN(playerId)) return null;
            const player = await playerService.getById(playerId);
            if (!player) { return null; }
            return await countrySupporterService.getByPlayer(player.id);
        },
        { params },
    );
};
