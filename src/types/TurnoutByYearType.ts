import { z } from 'zod';

export const TurnoutByYearSchema = z.object({
    year: z.number(),
    gameDays: z.number(),
    gamesScheduled: z.number(),
    gamesInitiated: z.number(),
    gamesPlayed: z.number(),
    gamesCancelled: z.number(),
    responses: z.number(),
    yesses: z.number(),
    players: z.number(),
    responsesPerGameInitiated: z.number(),
    yessesPerGameInitiated: z.number(),
    playersPerGamePlayed: z.number(),
});

export type TurnoutByYearType = z.infer<typeof TurnoutByYearSchema>;
