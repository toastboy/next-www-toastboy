import {
    Arse as PrismaArse,
    Club as PrismaClub,
    Country as PrismaCountry,
    GameDay as PrismaGameDay,
    Outcome as PrismaOutcome,
    Player as PrismaPlayer,
    PlayerRecord as PrismaPlayerRecord,
} from '@prisma/client';

export type Arse = PrismaArse

export type Club = PrismaClub

export type Country = PrismaCountry

export interface GameDay extends PrismaGameDay {
    outcomes: Outcome[],
}

export interface Outcome extends PrismaOutcome {
    player: Player,
}

export type Player = PrismaPlayer

export interface PlayerData extends Player {
    firstResponded: number | null;
    lastResponded: number | null;
    firstPlayed: number | null;
    lastPlayed: number | null;
    gamesPlayed: number;
    gamesWon: number;
    gamesDrawn: number;
    gamesLost: number;
}

export interface PlayerRecord extends PrismaPlayerRecord {
    player: Player,
}
