import { NextRequest } from 'next/server';

import { handleGET } from '@/lib/api';
import playerService from '@/services/Player';

/**
 * Handles a GET request to retrieve the name of a player based on their ID.
 * There's no need to take account of the logged in user role because
 * `playerService.getName()` already anonymises as necessary.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters,
 * including `id`.
 * @returns A promise that resolves to the player's name if found, or `null` if
 * the player does not exist.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    const playerId = Number(params.id);

    return handleGET(
        async () => {
            if (Number.isNaN(playerId)) return null;
            const player = await playerService.getById(playerId);
            if (!player) { return null; }
            return playerService.getName(player);
        },
        { params },
    );
};
