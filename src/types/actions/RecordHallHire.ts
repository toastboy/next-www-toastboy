import z from 'zod';

export const RecordHallHireInputSchema = z.object({
    amountPence: z.number().int().positive(),
    gameDayId: z.number().int().positive(),
    note: z.string().max(255).optional(),
});

export type RecordHallHireInput = z.infer<typeof RecordHallHireInputSchema>;

export type RecordHallHireProxy = (data: RecordHallHireInput) => Promise<void>;
