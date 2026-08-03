import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PlayerWDLChart } from '@/components/PlayerWDLChart/PlayerWDLChart';
import { Wrapper } from '@/tests/components/lib/common';
import { createMockPlayerData, defaultPlayerData } from '@/tests/mocks/data/playerData';

const getProgressSections = (container: HTMLElement) =>
    container.querySelectorAll('.mantine-Progress-section');

describe('PlayerWDLChart', () => {
    it('renders win/draw/loss progress chart', () => {
        const { container } = render(
            <Wrapper>
                <PlayerWDLChart player={defaultPlayerData} />
            </Wrapper>,
        );

        expect(container.querySelector('[role="progressbar"]')).toBeInTheDocument();
    });

    it('shows a single combined P/W/D/L tooltip regardless of which section is hovered', async () => {
        const user = userEvent.setup();
        const { container } = render(
            <Wrapper>
                <PlayerWDLChart player={defaultPlayerData} />
            </Wrapper>,
        );

        const [wins, draws, losses] = getProgressSections(container);

        await user.hover(wins);
        expect(await screen.findByRole('tooltip')).toHaveTextContent('P90 W50 D20 L20');
        await user.unhover(wins);

        await user.hover(draws);
        expect(await screen.findByRole('tooltip')).toHaveTextContent('P90 W50 D20 L20');
        await user.unhover(draws);

        await user.hover(losses);
        expect(await screen.findByRole('tooltip')).toHaveTextContent('P90 W50 D20 L20');
    });

    it('interpolates each count into the tooltip label', async () => {
        const user = userEvent.setup();
        const player = createMockPlayerData({ gamesWon: 1, gamesDrawn: 1, gamesLost: 1, gamesPlayed: 3 });
        const { container } = render(
            <Wrapper>
                <PlayerWDLChart player={player} />
            </Wrapper>,
        );

        const [wins] = getProgressSections(container);

        await user.hover(wins);
        expect(await screen.findByRole('tooltip')).toHaveTextContent('P3 W1 D1 L1');
    });

    it('renders zero-width sections instead of NaN when the player has not played any games', () => {
        const player = createMockPlayerData({ gamesWon: 0, gamesDrawn: 0, gamesLost: 0, gamesPlayed: 0 });
        const { container } = render(
            <Wrapper>
                <PlayerWDLChart player={player} />
            </Wrapper>,
        );

        const progressBars = container.querySelectorAll('[role="progressbar"]');
        expect(progressBars).toHaveLength(3);
        progressBars.forEach((bar) => expect(bar).toHaveAttribute('aria-valuenow', '0'));
    });
});
