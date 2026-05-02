import type { TeamName } from 'prisma/zod/schemas';

export interface Turnout {
    responses: number;
    players: number;
    cancelled: boolean;
    id: number;
    year: number;
    date: Date;
    game: boolean;
    mailSent: Date | null;
    comment: string | null;
    bibs: TeamName | null;
    pickerGamesHistory: number | null;
    yes: number;
    no: number;
    dunno: number;
    excused: number;
    flaked: number;
    injured: number;
};
