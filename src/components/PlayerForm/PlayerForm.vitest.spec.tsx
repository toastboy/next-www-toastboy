
import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { Props as GameDayLinkProps } from '@/components/GameDayLink/GameDayLink';
import { PlayerForm } from '@/components/PlayerForm/PlayerForm';
import { extractMockProps, Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerFormList } from '@/tests/mocks/data/playerForm';

vi.mock('@/components/GameDayLink/GameDayLink');

describe('PlayerForm', () => {
    it('renders progress bar with game links', () => {
        render(
            <Wrapper>
                <PlayerForm form={defaultPlayerFormList} />
            </Wrapper>,
        );

        {
            const props = extractMockProps<GameDayLinkProps>('GameDayLink');
            expect(props.length).toBe(10);
            expect(props[0].gameDay.id).toEqual(1);
            expect(props[9].gameDay.id).toEqual(1);
        }
    });
});
