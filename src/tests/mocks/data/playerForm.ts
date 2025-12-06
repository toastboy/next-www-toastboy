import { PlayerFormType } from 'types';

import { createMockGameDay } from '@/tests/mocks/data/gameDay';
import { createMockOutcome } from '@/tests/mocks/data/outcome';

export const defaultPlayerFormList: PlayerFormType[] =
    Array.from({ length: 100 }, (_, index) => {
        const gameDayId = Math.floor(index / 10 + 1);

        return {
            ...createMockOutcome({
                playerId: index % 10 + 1,
                gameDayId,
            }),
            gameDay: createMockGameDay({ id: gameDayId }),
        };
    });
