import 'server-only';

import type z from 'zod';

import gameDayService from '@/services/GameDay';
import type { UpdateInvoiceGameDaysInputSchema } from '@/types/actions/UpdateInvoiceGameDays';

type UpdateInvoiceGameDaysInput = z.infer<typeof UpdateInvoiceGameDaysInputSchema>;

interface UpdateInvoiceGameDaysDeps {
    gameDayService: Pick<typeof gameDayService, 'update'>;
}

const defaultDeps: UpdateInvoiceGameDaysDeps = { gameDayService };

/**
 * Updates the game/no-game status of a set of game days in parallel.
 *
 * @param data - Validated input containing game day ids and their scheduled status.
 * @param deps - Injectable service dependencies for testing.
 */
export async function updateInvoiceGameDaysCore(
    data: UpdateInvoiceGameDaysInput,
    deps: UpdateInvoiceGameDaysDeps = defaultDeps,
): Promise<void> {
    await Promise.all(
        data.gameDays.map((gd) => deps.gameDayService.update({ id: gd.id, game: gd.gameScheduled })),
    );
}
