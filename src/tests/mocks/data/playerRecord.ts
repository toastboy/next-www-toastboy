import { PlayerRecordType } from "prisma/generated/schemas/models/PlayerRecord.schema";

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
