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
