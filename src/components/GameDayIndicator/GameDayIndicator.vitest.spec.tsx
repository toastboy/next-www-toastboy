import { render } from '@testing-library/react';

import { GameDayIndicator } from '@/components/GameDayIndicator/GameDayIndicator';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultGameDay } from '@/tests/mocks/data/gameDay';

describe('GameDayIndicator', () => {
    it('renders a GameDayIndicator', () => {
        render(
            <Wrapper>
                <GameDayIndicator gameDay={defaultGameDay} />
            </Wrapper>,
        );
    });
});
