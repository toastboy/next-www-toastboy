import { NextRequest } from 'next/server';

import { handleGET, sanitizeOutcomeData } from '@/lib/api';
import playerService from '@/services/Player';

/**
 * Handles a GET request to retrieve the last played information for a specific player.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including `id`.
 * @returns A promise resolving to the last played data of the player, or `null` if the player is not found.
 *
 * This function uses `playerService` to fetch the player by their ID and
 * retrieves the last played information associated with the player's ID.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    const playerId = Number(params.id);

    return handleGET(
        async () => {
            if (Number.isNaN(playerId)) return null;
            const player = await playerService.getById(playerId);
            if (!player) return null;
            return playerService.getLastPlayed(player.id);
        },
        { params },
        { sanitize: sanitizeOutcomeData },
    );
};
