'use server';

import { revalidatePath } from 'next/cache';

import { payDebtCore } from '@/lib/actions/payDebt';
import { PayDebtInputSchema } from '@/types/actions/PayDebt';

/**
 * Processes a debt payment and revalidates related pages.
 *
 * @param rawData - The raw payment data to be validated against
 * PayDebtInputSchema
 * @returns A promise that resolves to the result of the payment operation
 * @throws {ZodError} If the input data fails validation against
 * PayDebtInputSchema
 *
 * @remarks
 * This function validates the input data, processes the payment through
 * payDebtCore, and triggers revalidation of the admin money page and game page
 * to reflect the updated state.
 */
export async function payDebt(rawData: unknown) {
    const data = PayDebtInputSchema.parse(rawData);
    const result = await payDebtCore(data);

    revalidatePath('/footy/admin/money');
    revalidatePath('/footy/game');

    return result;
}
