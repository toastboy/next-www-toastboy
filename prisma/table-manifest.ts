import type { PrismaClient } from 'prisma/generated/client';

export interface TableEntry {
    fileName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- pragmatic: Prisma delegate types resist a safe common supertype
    getModel: (client: PrismaClient) => any;
}

// FK-safe insert order. Reverse for a safe delete order.
// PlayerRecord is last because seed.ts inserts it in chunks.
// importlivedb skips PlayerEmail and writes it separately from computed data.
export const GAME_DATA_TABLES: TableEntry[] = [
    { fileName: 'Player.json', getModel: (c) => c.player },
    { fileName: 'PlayerLogin.json', getModel: (c) => c.playerLogin },
    { fileName: 'PlayerEmail.json', getModel: (c) => c.playerExtraEmail },
    { fileName: 'GameDay.json', getModel: (c) => c.gameDay },
    { fileName: 'Outcome.json', getModel: (c) => c.outcome },
    { fileName: 'Transaction.json', getModel: (c) => c.transaction },
    { fileName: 'GameChat.json', getModel: (c) => c.gameChat },
    { fileName: 'Country.json', getModel: (c) => c.country },
    { fileName: 'CountrySupporter.json', getModel: (c) => c.countrySupporter },
    { fileName: 'Club.json', getModel: (c) => c.club },
    { fileName: 'ClubSupporter.json', getModel: (c) => c.clubSupporter },
    { fileName: 'Arse.json', getModel: (c) => c.arse },
    { fileName: 'PlayerRecord.json', getModel: (c) => c.playerRecord },
];

// Auth tables in insert order. Reverse for a safe delete order.
export const AUTH_TABLES: TableEntry[] = [
    { fileName: 'user.json', getModel: (c) => c.user },
    { fileName: 'account.json', getModel: (c) => c.account },
    { fileName: 'verification.json', getModel: (c) => c.verification },
];
