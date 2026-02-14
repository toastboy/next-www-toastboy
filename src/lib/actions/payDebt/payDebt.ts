import 'server-only';

import moneyService from '@/services/Money';
import type { PayDebtInput } from '@/types/actions/PayDebt';

interface PayDebtDeps {
    moneyService: Pick<typeof moneyService, 'pay'>;
}

const defaultDeps: PayDebtDeps = {
    moneyService,
};

/**
 * Processes a debt payment for a player.
 *
 * @param data - The payment details including player ID and amount
 * @param deps - Optional dependencies for testing/injection, defaults to
 * defaultDeps
 * @returns A promise that resolves with the result of the payment operation
 *
 * @remarks
 * This function delegates to the money service to execute the actual payment.
 * Dependencies can be injected for testing purposes.
 */
export async function payDebtCore(
    data: PayDebtInput,
    deps: PayDebtDeps = defaultDeps,
) {
    return await deps.moneyService.pay(data.playerId, data.amount);
}
