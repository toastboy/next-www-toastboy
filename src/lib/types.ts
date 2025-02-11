import {
    Club as PrismaClub,
    GameDay as PrismaGameDay,
    Outcome as PrismaOutcome,
    Player as PrismaPlayer,
} from '@prisma/client';

export type Club = PrismaClub

export interface GameDay extends PrismaGameDay {
    outcomes: Outcome[],
}

export interface Outcome extends PrismaOutcome {
    player: Player,
}

export type Player = PrismaPlayer
