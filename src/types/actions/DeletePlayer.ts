import { z } from 'zod';

export const DeleteAccountSchema = z.object({
    confirmPhrase: z.string().min(1, { message: 'Please type DELETE to confirm' }),
    confirmPii: z.boolean().refine((value) => value, {
        message: 'Please confirm deletion of your personal data',
    }),
}).refine((data) => data.confirmPhrase.trim().toUpperCase() === 'DELETE', {
    message: 'Type DELETE to confirm',
    path: ['confirmPhrase'],
});

export type DeleteAccountInput = z.infer<typeof DeleteAccountSchema>;

/**
 * Server action proxy type for the deletePlayer action.
 * Enables dependency injection for components and stories without importing
 * the server-only action directly.
 *
 * This action initiates the process to delete the currently authenticated user account.
 * It sends a confirmation email and performs cleanup of player-associated data.
 */
export type DeletePlayerProxy = () => Promise<void>;
