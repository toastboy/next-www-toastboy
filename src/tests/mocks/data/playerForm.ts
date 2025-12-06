import { PlayerFormType } from 'types';

import { createMockGameDay, defaultGameDay } from '@/tests/mocks/data/gameDay';
import { createMockOutcome } from '@/tests/mocks/data/outcome';

export const defaultPlayerFormList: PlayerFormType[] =
    Array.from({ length: 10 }, (_, index) => {
        const gameDayId = Math.floor(index / 10 + 1);
        const lookup = [0, 1, 3];

        return {
            ...createMockOutcome({
                playerId: index % 10 + 1,
                points: index < 5 ? null : lookup[index % lookup.length],
                gameDayId,
            }),
            gameDay: createMockGameDay({
                id: gameDayId,
                date: new Date(defaultGameDay.date.getTime() + index * 7 * 24 * 60 * 60 * 1000),
            }),
        };
    });
