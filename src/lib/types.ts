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

// Really, I'd like these enums to come straight from Prisma but they show up in
// the client components as undefined. Obviously, they'll need updating if the
// corresponding bits of the schema ever change.

export enum PlayerResponse {
    Yes = 'Yes',
    No = 'No',
    Dunno = 'Dunno',
    Excused = 'Excused',
    Flaked = 'Flaked',
    Injured = 'Injured',
};

export enum TableName {
    points = 'points',
    averages = 'averages',
    stalwart = 'stalwart',
    speedy = 'speedy',
    pub = 'pub',
};

export enum TeamName {
    A = 'A',
    B = 'B',
};

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
    bibs: TeamName | null,
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
