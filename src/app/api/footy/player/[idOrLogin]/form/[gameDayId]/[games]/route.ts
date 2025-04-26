import { handleGET, sanitizeOutcomeArrayData } from 'lib/api';
import { NextRequest } from 'next/server';
import playerService from 'services/Player';

/**
 * Handles a GET request to retrieve the form of a player for a specific game day and number of games.
 *
 * @param request - The incoming Next.js request object.
 * @param props - An object containing route parameters.
 * @param props.params - A promise resolving to a record of route parameters, including:
 *   - `idOrLogin`: The player's ID or login identifier.
 *   - `gameDayId`: The ID of the game day.
 *   - `games`: The number of games to retrieve the form for.
 *
 * @returns A promise resolving to a response containing either:
 *   - An array of partial `OutcomeWithGameDay` objects representing the player's form.
 *   - `null` if the player is not found.
 *
 * The function uses `playerService` to fetch the player by their ID or login and then retrieves
 * their form data for the specified game day and number of games.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const params = await props.params;

    return handleGET(
        async () => {
            const player = await playerService.getByIdOrLogin(params.idOrLogin);
            if (!player) return null;
            return playerService.getForm(player.id, parseInt(params.gameDayId), parseInt(params.games));
        },
        { params },
        { sanitize: sanitizeOutcomeArrayData },
    );
};
