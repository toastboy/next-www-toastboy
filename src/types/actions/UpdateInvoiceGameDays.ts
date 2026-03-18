import z from 'zod';

export const UpdateInvoiceGameDaysInputSchema = z.object({
    gameDays: z.array(z.object({
        id: z.number().int().positive(),
        gameScheduled: z.boolean(),
    })),
});

export type UpdateInvoiceGameDaysInput = z.infer<typeof UpdateInvoiceGameDaysInputSchema>;

export type UpdateInvoiceGameDaysProxy = (data: UpdateInvoiceGameDaysInput) => Promise<void>;
