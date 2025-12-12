import { render } from '@testing-library/react';

import { PlayerWDLChart } from '@/components/PlayerWDLChart/PlayerWDLChart';
import { defaultPlayerData } from '@/tests/mocks';

import { Wrapper } from './lib/common';

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
