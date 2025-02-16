import {
    Arse as PrismaArse,
    Club as PrismaClub,
    Country as PrismaCountry,
    GameDay as PrismaGameDay,
    Outcome as PrismaOutcome,
    Player as PrismaPlayer,
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
