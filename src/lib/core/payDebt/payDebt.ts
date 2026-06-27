import 'server-only';

import moneyService from '@/services/Money';
import type { PayDebtInput } from '@/types/actions/PayDebt';

interface PayDebtDeps {
    moneyService: Pick<typeof moneyService, 'payMultiple'>;
}

const defaultDeps: PayDebtDeps = {
    moneyService,
};

/**
 * Processes debt payments for a player across multiple game days.
 *
 * Creates one payment transaction for each gameDayId in the input, distributing
 * the total amount across the unpaid charges.
 *
 * @param data - The payment details including player ID, total amount, and list
 * of gameDayIds to clear
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
    return await deps.moneyService.payMultiple(data.playerId, data.amount, data.gameDayIds);
}
