import {
    Arse as PrismaArse,
    Club as PrismaClub,
    Country as PrismaCountry,
    GameDay as PrismaGameDay,
    Outcome as PrismaOutcome,
    Player as PrismaPlayer,
    PlayerRecord as PrismaPlayerRecord,
    Team as PrismaTeam,
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

export type Team = PrismaTeam

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
    bibs: Team | null,
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
