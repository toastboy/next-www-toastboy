import 'server-only';

import moneyService from '@/services/Money';
import type { RecordHallHireInput } from '@/types/actions/RecordHallHire';

interface RecordHallHireDeps {
    moneyService: Pick<typeof moneyService, 'recordHallHire'>;
}

const defaultDeps: RecordHallHireDeps = {
    moneyService,
};

/**
 * Records a hall hire payment as a club-level HallHire transaction.
 *
 * @param data - The invoice details including amount in pence and optional note
 * @param deps - Optional dependencies for testing/injection
 */
export async function recordHallHireCore(
    data: RecordHallHireInput,
    deps: RecordHallHireDeps = defaultDeps,
): Promise<void> {
    return deps.moneyService.recordHallHire(data.amountPence, data.gameDayId, data.note);
}
