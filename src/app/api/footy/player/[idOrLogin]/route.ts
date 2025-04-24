import { handleGET, sanitizePlayerData } from 'lib/api';
import { Player } from 'lib/types';
import { NextRequest } from 'next/server';
import playerService from 'services/Player';

/**
 * Handles the GET request for retrieving a player's information by their ID or login.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including `idOrLogin`.
 * @returns A response containing partial player information.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET<Partial<Player>>(() =>
        playerService.getByIdOrLogin(params.idOrLogin),
        { params },
        { sanitize: sanitizePlayerData },
    );
};
