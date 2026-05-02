import { z } from 'zod';

const SetDrinkersPlayerInputSchema = z.object({
    playerId: z.number().int().min(1),
    drinker: z.boolean(),
});

export const SetDrinkersInputSchema = z.object({
    gameDayId: z.number().int().min(1),
    players: z.array(SetDrinkersPlayerInputSchema),
});

export type SetDrinkersInput = z.infer<typeof SetDrinkersInputSchema>;

export interface SetDrinkersResult {
    gameDayId: number;
    updated: number;
    drinkers: number;
};

export type SetDrinkersProxy = (data: SetDrinkersInput) => Promise<SetDrinkersResult>;
