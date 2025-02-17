import {
    Arse as PrismaArse,
    Club as PrismaClub,
    Country as PrismaCountry,
    GameDay as PrismaGameDay,
    Outcome as PrismaOutcome,
    Player as PrismaPlayer,
    PlayerRecord as PrismaPlayerRecord,
    PlayerResponse as PrismaPlayerResponse,
    TableName as PrismaTableName,
    TeamName as PrismaTeamName,
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

export type PlayerResponse = PrismaPlayerResponse

export const PlayerResponse: typeof PrismaPlayerResponse = PrismaPlayerResponse;

export type TableName = PrismaTableName

export const TableName: typeof PrismaTableName = PrismaTableName;

export type TeamName = PrismaTeamName

export const TeamName: typeof PrismaTeamName = PrismaTeamName;

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
