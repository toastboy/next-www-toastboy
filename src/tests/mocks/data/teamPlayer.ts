import { createMockOutcome } from '@/tests/mocks/data/outcome';
import { TeamPlayerType } from '@/types';

import { defaultPlayer } from './player';
import { defaultPlayerFormList } from './playerForm';

export const defaultTeamPlayer = {
    ...defaultPlayer,
    outcome: createMockOutcome(),
    form: [defaultPlayerFormList[0]],
} satisfies TeamPlayerType;

export const defaultTeamPlayerList: TeamPlayerType[] = defaultPlayerFormList.map(
    (playerForm, index) => ({
        ...defaultPlayer,
        ...playerForm,
        id: index + 1,
        outcome: createMockOutcome(),
        form: [playerForm],
    }),
);
