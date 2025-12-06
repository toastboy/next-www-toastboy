import { createMockGameDay, createMockOutcome } from '@/tests/mocks';
import { GameDayType } from 'prisma/generated/schemas/models/GameDay.schema';
import { OutcomeType } from 'prisma/generated/schemas/models/Outcome.schema';

export const defaultPlayerFormList: (OutcomeType & { gameDay: GameDayType })[] =
    Array.from({ length: 100 }, (_, index) =>
        createMockOutcome({
            playerId: index % 10 + 1,
            gameDayId: Math.floor(index / 10 + 1),
            gameDay: createMockGameDay(),
        }),
    );
