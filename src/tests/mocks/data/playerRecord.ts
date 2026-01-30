import { TableName, TableNameSchema } from 'prisma/zod/schemas';
import { PlayerRecordType } from 'prisma/zod/schemas/models/PlayerRecord.schema';

import { rankMap } from '@/lib/utils';

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

/**
 * Generates a list of varied mock player records for testing.
 * Creates records with:
 * - Multiple players (20 different players)
 * - Multiple years (2020-2024)
 * - Varied game days
 * - Realistic ranking variations (1st, 2nd, 3rd place, unranked)
 * - Varied statistics (points, averages, stalwart, speedy, pub)
 * 
 * Note: The first record matches defaultPlayerRecord to maintain backward compatibility.
 */
export const defaultPlayerRecordList: PlayerRecordType[] = [
    // First record is the default player record for backward compatibility
    defaultPlayerRecord,
    // Generate 99 more varied records
    ...Array.from({ length: 99 }, (_, i) => {
        const index = i + 1; // Start from 1 since 0 is the default record
        const playerId = (index % 20) + 1;
        const year = 2020 + Math.floor(index / 20);
        const gameDayId = 10 + Math.floor(index / 10) + 1;
        
        // Create varied rankings - some winners, some runners-up, some unranked
        const rankPosition = (index % 5) + 1; // Cycles through ranks 1-5
        
        // Vary stats based on ranking
        const basePlayed = 10 + (index % 5);
        const baseWon = Math.max(0, basePlayed - rankPosition);
        const baseDrawn = Math.min(3, index % 4);
        const baseLost = basePlayed - baseWon - baseDrawn;
        
        return createMockPlayerRecord({
            id: index + 1,
            playerId,
            year,
            gameDayId,
            
            // Varied game statistics
            responses: basePlayed,
            played: basePlayed,
            won: baseWon,
            drawn: baseDrawn,
            lost: baseLost,
            
            // Points table stats (3 points for win, 1 for draw)
            points: baseWon * 3 + baseDrawn,
            averages: parseFloat(((baseWon * 3 + baseDrawn) / basePlayed).toFixed(2)),
            
            // Other table stats
            stalwart: basePlayed - (rankPosition - 1),
            speedy: Math.max(1, 6 - rankPosition),
            pub: Math.max(1, 6 - rankPosition),
            
            // Rankings - vary across different tables
            rankPoints: rankPosition,
            rankAverages: ((rankPosition + 1) % 5) + 1,
            rankAveragesUnqualified: ((rankPosition + 1) % 5) + 1,
            rankStalwart: ((rankPosition + 2) % 5) + 1,
            rankSpeedy: ((rankPosition + 3) % 5) + 1,
            rankSpeedyUnqualified: ((rankPosition + 3) % 5) + 1,
            rankPub: ((rankPosition + 4) % 5) + 1,
        });
    }),
];

/**
 * Generates default trophies map with winners across all ranking tables.
 * Each table will have records where the player ranked 1st.
 */
export const defaultTrophiesList = new Map<TableName, PlayerRecordType[]>();
TableNameSchema.options.forEach((table) => {
    const rank = rankMap[table][0] as keyof PlayerRecordType;
    defaultTrophiesList.set(
        table,
        defaultPlayerRecordList.filter((record) => record[rank] === 1),
    );
});
