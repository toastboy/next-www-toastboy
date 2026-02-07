import 'server-only';

import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import gameDayService from '@/services/GameDay';
import type { CancelGameInput } from '@/types/actions/CancelGame';
import type { SendEmailToAllActivePlayersProxy } from '@/types/actions/SendEmailToAllActivePlayers';

interface CancelGameDeps {
    gameDayService: Pick<typeof gameDayService, 'get' | 'update'>;
}

const defaultDeps: CancelGameDeps = {
    gameDayService,
};

/**
 * Marks a game as cancelled and applies an optional cancellation reason.
 *
 * @param data - Validated cancellation input with gameDayId and reason.
 * @param deps - Service dependencies used for retrieving and persisting game
 * day state.
 * @returns The updated game day record.
 * @throws {Error} If the game day does not exist or the update fails.
 */
export async function cancelGameCore(
    data: CancelGameInput,
    sendEmailToAllActivePlayers: SendEmailToAllActivePlayersProxy,
    deps: CancelGameDeps = defaultDeps,
): Promise<GameDayType> {
    try {
        const gameDay = await deps.gameDayService.get(data.gameDayId);

        if (!gameDay) {
            throw new Error(`Game day not found (id: ${data.gameDayId}).`);
        }

        const updatedGameDay = await deps.gameDayService.update({
            id: gameDay.id,
            game: false,
            comment: data.reason,
        });

        await sendEmailToAllActivePlayers({
            cc: '',
            subject: `Game Cancelled: ${updatedGameDay.date.toDateString()}`,
            html: `<p>The game scheduled for ${updatedGameDay.date.toDateString()} has been cancelled.</p>` +
                (data.reason ? `<p>Reason: ${data.reason}</p>` : ''),
        });

        return updatedGameDay;
    } catch (error) {
        // Type-safe error handling
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unexpected error occurred while cancelling the game.', {
            cause: error,
        });
    }
}
