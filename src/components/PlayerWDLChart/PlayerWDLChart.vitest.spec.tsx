import { render } from '@testing-library/react';

import { PlayerWDLChart } from '@/components/PlayerWDLChart/PlayerWDLChart';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerData } from '@/tests/mocks/data/playerData';

describe('PlayerWDLChart', () => {
    it('renders win/draw/loss progress chart', () => {
        const { container } = render(
            <Wrapper>
                <PlayerWDLChart player={defaultPlayerData} />
            </Wrapper>,
        );

        const progressRoot = container.querySelector('[role="progressbar"]');
        expect(progressRoot).toBeInTheDocument();
    });
});
