import {
    Player as PrismaPlayer,
} from 'prisma/generated/prisma/client';
import { TeamNameType } from 'prisma/generated/zod';

export interface PlayerData extends PrismaPlayer {
    firstResponded: number | null;
    lastResponded: number | null;
    firstPlayed: number | null;
    lastPlayed: number | null;
    gamesPlayed: number;
    gamesWon: number;
    gamesDrawn: number;
    gamesLost: number;
}

export interface Turnout {
    responses: number,
    players: number,
    cancelled: boolean,
    id: number,
    year: number,
    date: Date,
    game: boolean,
    mailSent: Date | null,
    comment: string | null,
    bibs: TeamNameType | null,
    pickerGamesHistory: number | null,
    yes: number,
    no: number,
    dunno: number,
    excused: number,
    flaked: number,
    injured: number,
}

export interface TurnoutByYear {
    year: number,
    gameDays: number,
    gamesScheduled: number,
    gamesInitiated: number,
    gamesPlayed: number,
    gamesCancelled: number,
    responses: number,
    yesses: number,
    players: number,
    responsesPerGameInitiated: number,
    yessesPerGameInitiated: number,
    playersPerGamePlayed: number,
}

export interface WDL {
    won: number,
    drawn: number,
    lost: number,
}
