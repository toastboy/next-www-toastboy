import { render } from '@testing-library/react';

import { PlayerTimeline } from '@/components/PlayerTimeline/PlayerTimeline';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerData } from '@/tests/mocks/data/playerData';

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
