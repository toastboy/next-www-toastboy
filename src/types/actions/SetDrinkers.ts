import { z } from 'zod';

export const SetDrinkersPlayerInputSchema = z.object({
    playerId: z.number().int().min(1),
    drinker: z.boolean(),
});

export const SetDrinkersInputSchema = z.object({
    gameDayId: z.number().int().min(1),
    players: z.array(SetDrinkersPlayerInputSchema),
});

export type SetDrinkersInput = z.infer<typeof SetDrinkersInputSchema>;

export const SetDrinkersResultSchema = z.object({
    gameDayId: z.number().int().min(1),
    updated: z.number().int().min(0),
    drinkers: z.number().int().min(0),
});

export type SetDrinkersResult = z.infer<typeof SetDrinkersResultSchema>;

export type SetDrinkersProxy = (data: SetDrinkersInput) => Promise<SetDrinkersResult>;
