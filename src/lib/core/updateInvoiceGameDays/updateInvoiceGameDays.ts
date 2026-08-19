import 'server-only';

import type z from 'zod';

import { ConflictError } from '@/lib/errors';
import { isDecided } from '@/lib/gameResult';
import gameDayService from '@/services/GameDay';
import type { UpdateInvoiceGameDaysInputSchema } from '@/types/actions/UpdateInvoiceGameDays';

type UpdateInvoiceGameDaysInput = z.infer<
    typeof UpdateInvoiceGameDaysInputSchema
>;

interface UpdateInvoiceGameDaysDeps {
    gameDayService: Pick<typeof gameDayService, 'get' | 'update'>;
}

const defaultDeps: UpdateInvoiceGameDaysDeps = { gameDayService };

/**
 * Updates the game/no-game status of a set of game days in parallel.
 *
 * @param data - Validated input containing game day ids and their scheduled status.
 * @param deps - Injectable service dependencies for testing.
 * @throws {ConflictError} If any of the game days already has a decided
 * result (AWin/BWin/Draw) — this endpoint only toggles whether a game is
 * scheduled, and overwriting a decided game day's status here would silently
 * discard its recorded result.
 */
export async function updateInvoiceGameDaysCore(
    data: UpdateInvoiceGameDaysInput,
    deps: UpdateInvoiceGameDaysDeps = defaultDeps,
): Promise<void> {
    const existingGameDays = await Promise.all(
        data.gameDays.map((gd) => deps.gameDayService.get(gd.id)),
    );

    const decidedGameDayIds = existingGameDays
        .filter((gameDay) => gameDay != null && isDecided(gameDay.status))
        .map((gameDay) => gameDay!.id);

    if (decidedGameDayIds.length > 0) {
        throw new ConflictError(
            `Cannot change the scheduled status of game day(s) with a recorded result: ${decidedGameDayIds.join(', ')}.`,
            {
                details: { gameDayIds: decidedGameDayIds },
                publicMessage:
                    'One or more of these game days already has a recorded result and cannot be changed here.',
            },
        );
    }

    await Promise.all(
        data.gameDays.map((gd) =>
            deps.gameDayService.update({
                id: gd.id,
                status: gd.gameScheduled ? 'Scheduled' : 'NoGame',
            }),
        ),
    );
}
