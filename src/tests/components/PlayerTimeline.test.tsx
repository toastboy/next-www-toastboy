import { render } from '@testing-library/react';

import PlayerTimeline from '@/components/PlayerTimeline/PlayerTimeline';
import { defaultPlayerData } from '@/tests/mocks';

import { Wrapper } from './lib/common';

describe('PlayerTimeline', () => {
    it('renders progress bar for player timeline', () => {
        const { container } = render(
            <Wrapper>
                <PlayerTimeline player={defaultPlayerData} currentGameId={100} />
            </Wrapper>,
        );

        const progressRoot = container.querySelector('[role="progressbar"]');
        expect(progressRoot).toBeInTheDocument();
    });
});
