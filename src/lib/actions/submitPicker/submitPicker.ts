import 'server-only';

import type { SubmitPickerInput } from '@/types/actions/SubmitPicker';

/**
 * Placeholder: accepts the selected player list for the picker submission.
 *
 * @param data - The picker input containing the selected players.
 * @returns A promise resolving when the payload is accepted.
 */
export async function SubmitPickerCore(
    _data: SubmitPickerInput,
): Promise<void> {
    return Promise.resolve();
}
