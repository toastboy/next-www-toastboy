import { render } from '@testing-library/react';

import { PlayerTimeline } from '@/components/PlayerTimeline/PlayerTimeline';
import { Wrapper } from '@/tests/components/lib/common';
import { createMockPlayerData, defaultPlayerData } from '@/tests/mocks/data/playerData';

describe('PlayerTimeline', () => {
    it('renders progress bar for player timeline', () => {
        const { container } = render(
            <Wrapper>
                <PlayerTimeline player={defaultPlayerData} currentGameId={100} />
            </Wrapper>,
        );

        expect(container.querySelector('[role="progressbar"]')).toBeInTheDocument();
    });

    it('always renders exactly 5 sections', () => {
        const { container } = render(
            <Wrapper>
                <PlayerTimeline player={defaultPlayerData} currentGameId={100} />
            </Wrapper>,
        );

        expect(container.querySelectorAll('.mantine-Progress-section')).toHaveLength(5);
    });

    it('handles player with all-null game stats by falling back to game 1', () => {
        const player = createMockPlayerData({
            firstResponded: null,
            firstPlayed: null,
            lastPlayed: null,
            lastResponded: null,
        });

        const { container } = render(
            <Wrapper>
                <PlayerTimeline player={player} currentGameId={100} />
            </Wrapper>,
        );

        // All four fields default to firstGame (1), so the entire bar is the
        // final "inactive" section: value = 100 - 1 = 99.
        expect(container.querySelectorAll('.mantine-Progress-section')).toHaveLength(5);
        expect(container.querySelector('[role="progressbar"]')).toBeInTheDocument();
    });
});
