import type { GameDayStatus } from 'prisma/zod/schemas';

import { createMockGameDay, defaultGameDay } from '@/tests/mocks/data/gameDay';
import { createMockOutcome } from '@/tests/mocks/data/outcome';
import type { PlayerFormType } from '@/types';

export const createMockPaddingFormEntry = (playerId = 1): PlayerFormType => ({
    id: 0,
    gameDayId: 0,
    playerId,
    response: null,
    responseInterval: null,
    points: null,
    team: null,
    comment: null,
    pub: null,
    goalie: null,
});

/** Status that yields the given points for team 'A'. */
const statusForPoints = (points: 0 | 1 | 3 | null): GameDayStatus => {
    switch (points) {
        case 3:
            return 'AWin';
        case 1:
            return 'Draw';
        case 0:
            return 'BWin';
        default:
            return 'Scheduled';
    }
};

export const defaultPlayerFormList = Array.from({ length: 10 }, (_, index) => {
    const gameDayId = Math.floor(index / 10 + 1);
    const lookup = [0, 1, 3] as const;
    const points = index < 5 ? null : lookup[index % lookup.length];

    return {
        ...createMockOutcome({
            playerId: (index % 10) + 1,
            team: 'A',
            gameDayId,
        }),
        points,
        gameDay: createMockGameDay({
            id: gameDayId,
            status: statusForPoints(points),
            date: new Date(
                defaultGameDay.date.getTime() + index * 7 * 24 * 60 * 60 * 1000,
            ),
        }),
    };
}) satisfies PlayerFormType[];
