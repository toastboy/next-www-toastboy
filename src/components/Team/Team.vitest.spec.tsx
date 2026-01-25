
import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { Team } from '@/components/Team/Team';
import { Props as TeamPlayerProps } from '@/components/TeamPlayer/TeamPlayer';
import { extractMockProps, Wrapper } from '@/tests/components/lib/common';
import { defaultTeamPlayerList } from '@/tests/mocks/data/teamPlayer';

vi.mock('@/components/TeamPlayer/TeamPlayer');

describe('Team', () => {
    it('renders team players', () => {
        render(
            <Wrapper>
                <Team team={defaultTeamPlayerList} />
            </Wrapper>,
        );

        const props = extractMockProps<TeamPlayerProps>('TeamPlayer');
        expect(props.length).toBe(10);
        expect(props[0].teamPlayer.name).toEqual("Gary Player");
    });
});
