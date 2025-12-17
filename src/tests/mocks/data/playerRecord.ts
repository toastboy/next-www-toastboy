import { TableName, TableNameSchema } from '@/generated/zod/schemas';
import { PlayerRecordType } from '@/generated/zod/schemas/models/PlayerRecord.schema';
import { rankMap } from "@/lib/utils";

export const defaultPlayerRecord: PlayerRecordType = {
    id: 1,
    year: 2021,
    responses: 10,
    played: 10,
    won: 5,
    drawn: 3,
    lost: 2,
    points: 18,
    averages: 1.8,
    stalwart: 5,
    pub: 1,
    rankPoints: 1,
    rankAverages: 2,
    rankAveragesUnqualified: 2,
    rankStalwart: 3,
    rankSpeedy: 4,
    rankSpeedyUnqualified: 4,
    rankPub: 5,
    speedy: 4,

    gameDayId: 15,
    playerId: 12,
};

export const createMockPlayerRecord = (overrides: Partial<PlayerRecordType> = {}): PlayerRecordType => ({
    ...defaultPlayerRecord,
    ...overrides,
});

export const defaultPlayerRecordList: PlayerRecordType[] = Array.from({ length: 100 }, (_, index) =>
    createMockPlayerRecord({
        gameDayId: 10 + Math.floor(index / 10) + 1,
    }),
);

// Generate default trophies map - winners only
// TODO: This mock data needs more variety to be truly useful
export const defaultTrophiesList = new Map<TableName, PlayerRecordType[]>();
TableNameSchema.options.forEach((table) => {
    const rank = rankMap[table] as keyof PlayerRecordType;
    defaultTrophiesList.set(
        table,
        defaultPlayerRecordList.filter((record) => record[rank] === 1),
    );
});
