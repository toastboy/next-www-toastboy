import { z } from 'zod';

export const SubmitPickerPlayerSchema = z.object({
    playerId: z.number().min(1),
    name: z.string().nullish(),
});

export const SubmitPickerInputSchema = z.array(SubmitPickerPlayerSchema);

export type SubmitPickerInput = z.infer<typeof SubmitPickerInputSchema>;
export type SubmitPickerPlayerInput = z.infer<typeof SubmitPickerPlayerSchema>;

/**
 * Server action proxy type for the SubmitPicker action. Enables
 * dependency injection for components and stories without importing the
 * server-only action directly.
 *
 * Validates picker data for the selected players.
 *
 * @param data - Validated picker input including the selected player list.
 * @returns A promise that resolves when the selection payload is accepted.
 */
export type SubmitPickerProxy = (
    data: SubmitPickerInput,
) => Promise<void>;
