import { handleGET, sanitizePlayerRecordWithPlayerData } from 'lib/api';
import { PlayerRecordWithPlayer } from 'lib/types';
import { NextRequest } from 'next/server';
import playerService from 'services/Player';
import playerRecordService from 'services/PlayerRecord';

/**
 * Retrieves the record for a specific player and year.
 *
 * @param params - An object containing route parameters.
 * @param params.idOrLogin - The player's ID or login identifier.
 * @param params.year - The year for which the record is being retrieved.
 * @returns A promise that resolves to the player's record for the specified year,
 *          or `null` if the player does not exist.
 */
export async function getForYearByPlayer(
    { params }: { params: Record<string, string> },
) {
    const player = await playerService.getByIdOrLogin(params.idOrLogin);
    if (!player) return null;

    return await playerRecordService.getForYearByPlayer(parseInt(params.year), player.id);
}

/**
 * Handles a GET request to retrieve a player's record for a specific year.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including:
 *   - `idOrLogin`: The player's ID or login.
 *   - `year`: The year for which the record is being retrieved.
 * @returns A response containing the player's record for the specified year.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;
    return handleGET<Partial<PlayerRecordWithPlayer | null>>(
        () => getForYearByPlayer({ params }),
        { params },
        { sanitize: sanitizePlayerRecordWithPlayerData },
    );
};
