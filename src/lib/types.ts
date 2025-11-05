import { PlayerSchema, TeamNameSchema } from 'prisma/generated/schemas';
import { z } from 'zod';

export const PlayerDataSchema = z.object({
    firstResponded: z.number().nullable(),
    lastResponded: z.number().nullable(),
    firstPlayed: z.number().nullable(),
    lastPlayed: z.number().nullable(),
    gamesPlayed: z.number(),
    gamesWon: z.number(),
    gamesDrawn: z.number(),
    gamesLost: z.number(),
}).merge(PlayerSchema);

export type PlayerData = z.infer<typeof PlayerDataSchema>;

export const TurnoutSchema = z.object({
    responses: z.number(),
    players: z.number(),
    cancelled: z.boolean(),
    id: z.number(),
    year: z.number(),
    date: z.date(),
    game: z.boolean(),
    mailSent: z.date().nullable(),
    comment: z.string().nullable(),
    bibs: TeamNameSchema.nullable(),
    pickerGamesHistory: z.number().nullable(),
    yes: z.number(),
    no: z.number(),
    dunno: z.number(),
    excused: z.number(),
    flaked: z.number(),
    injured: z.number(),
});

export type Turnout = z.infer<typeof TurnoutSchema>;

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

export type TurnoutByYear = z.infer<typeof TurnoutByYearSchema>;

export const WDLSchema = z.object({
    won: z.number(),
    drawn: z.number(),
    lost: z.number(),
});

export type WDL = z.infer<typeof WDLSchema>;
