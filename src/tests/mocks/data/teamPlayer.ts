import { TeamPlayerType } from 'types';

import { createMockOutcome } from '@/tests/mocks/data/outcome';

import { defaultPlayer } from './player';
import { defaultPlayerFormList } from './playerForm';

export const defaultTeamPlayer: TeamPlayerType = {
    ...defaultPlayer,
    outcome: createMockOutcome(),
    form: [defaultPlayerFormList[0]],
};

export const defaultTeamPlayerList: TeamPlayerType[] = defaultPlayerFormList.map(
    (playerForm, index) => ({
        ...defaultPlayer,
        ...playerForm,
        id: index + 1,
        outcome: createMockOutcome(),
        form: [playerForm],
    }),
) as TeamPlayerType[];
