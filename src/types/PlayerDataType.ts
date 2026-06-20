import type { PlayerSchema } from 'prisma/zod/schemas';
import type { PlayerExtraEmailType as PrismaPlayerExtraEmailType } from 'prisma/zod/schemas/models/PlayerExtraEmail.schema';
import type { z } from 'zod';

type PlayerDataExtraEmailType = Pick<PrismaPlayerExtraEmailType, 'email'> & { verified: boolean };

interface PlayerDataEmailType {
    id: number;
    name: string | null;
    accountEmail: string | null;
    extraEmails: PlayerDataExtraEmailType[];
}

export type PlayerDataEmailDisplayType = Omit<PlayerDataEmailType, 'name'> & { name: string };

export type PlayerDataType = Omit<z.infer<typeof PlayerSchema>, 'accountEmail'> & {
    accountEmail: string | null;
    extraEmails: PlayerDataExtraEmailType[];
    firstResponded: number | null;
    lastResponded: number | null;
    firstPlayed: number | null;
    lastPlayed: number | null;
    gamesPlayed: number;
    gamesWon: number;
    gamesDrawn: number;
    gamesLost: number;
};

export type PlayerDataDisplayType = Omit<PlayerDataType, 'name'> & { name: string };
