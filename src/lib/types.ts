import {
    Player as PrismaPlayer,
} from 'prisma/generated/prisma/client';

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

// TODO: Really, I'd like these enums to come straight from Prisma but they show
// up in the client components as undefined. Obviously, they'll need updating if
// the corresponding bits of the schema ever change.

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

export interface WDL {
    won: number,
    drawn: number,
    lost: number,
}
