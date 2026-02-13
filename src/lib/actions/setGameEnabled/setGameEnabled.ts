import 'server-only';

import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import gameDayService from '@/services/GameDay';
import type { SendEmailToAllActivePlayersProxy } from '@/types/actions/SendEmailToAllActivePlayers';
import type { SetGameEnabledInput } from '@/types/actions/SetGameEnabled';

interface SetGameEnabledDeps {
    gameDayService: Pick<typeof gameDayService, 'get' | 'update'>;
}

const defaultDeps: SetGameEnabledDeps = {
    gameDayService,
};

/**
 * Sets the enabled/disabled status of a game for a specific game day and
 * notifies all active players.
 *
 * @param data - The input data containing the game day ID, game enabled status,
 * and optional reason
 * @param sendEmailToAllActivePlayers - Proxy function to send email
 * notifications to all active players
 * @param deps - Service dependencies for game day operations (defaults to
 * defaultDeps)
 *
 * @returns A promise that resolves to the updated GameDayType object
 *
 * @throws {Error} If the game day with the specified ID is not found
 * @throws {Error} If an unexpected error occurs during the game status update
 * or email notification
 *
 * @remarks
 * This function performs the following operations:
 * 1. Retrieves the game day record using the provided ID
 * 2. Updates the game day with the new game status and optional comment
 * 3. Sends an email notification to all active players about the game status
 *    change
 *
 * The email subject and content will reflect whether the game was reinstated or
 * cancelled.
 */
export async function setGameEnabledCore(
    data: SetGameEnabledInput,
    sendEmailToAllActivePlayers: SendEmailToAllActivePlayersProxy,
    deps: SetGameEnabledDeps = defaultDeps,
): Promise<GameDayType> {
    try {
        const gameDay = await deps.gameDayService.get(data.gameDayId);

        if (!gameDay) {
            throw new Error(`Game day not found (id: ${data.gameDayId}).`);
        }

        const updatedGameDay = await deps.gameDayService.update({
            id: gameDay.id,
            game: data.game,
            comment: data.reason,
        });

        await sendEmailToAllActivePlayers({
            subject: `Game ${data.game ? 'Reinstated' : 'Cancelled'}: ${updatedGameDay.date.toDateString()}`,
            html: `<p>The game scheduled for ${updatedGameDay.date.toDateString()} has been ${data.game ? 'reinstated' : 'cancelled'}.</p>` +
                (data.reason ? `<p>Reason: ${data.reason}</p>` : ''),
        });

        return updatedGameDay;
    } catch (error) {
        // Type-safe error handling
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred while setting the game status.', {
            cause: error,
        });
    }
}
