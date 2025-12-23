import { NextRequest } from 'next/server';

import { handleGET } from '@/lib/api';
import playerService from '@/services/Player';

/**
 * Handles the GET request for retrieving the years during which a player has
 * been active.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters,
 * including `id`.
 * @returns A promise resolving to the years active of the player, or `null` if
 * the player is not found.
 *
 * This function retrieves a player by their ID and, if found, fetches
 * their active years. It uses the `handleGET` utility to process the request
 * and handle errors.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    const playerId = Number(params.id);

    return handleGET(
        async () => {
            if (Number.isNaN(playerId)) return null;
            const player = await playerService.getById(playerId);
            if (!player) { return null; }
            return playerService.getYearsActive(player.id);
        },
        { params },
    );
};
