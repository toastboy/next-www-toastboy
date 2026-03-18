import z from 'zod';

export const RecordHallHireInputSchema = z.object({
    amount: z.number().int().positive(),
    note: z.string().max(255).optional(),
});

export type RecordHallHireInput = z.infer<typeof RecordHallHireInputSchema>;

export type RecordHallHireProxy = (data: RecordHallHireInput) => Promise<void>;
