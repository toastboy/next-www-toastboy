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

    it('shows plural tooltip labels when each count exceeds 1', async () => {
        const user = userEvent.setup();
        const { container } = render(
            <Wrapper>
                <PlayerWDLChart player={defaultPlayerData} />
            </Wrapper>,
        );

        const [wins, draws, losses] = getProgressSections(container);

        await user.hover(wins);
        expect(await screen.findByRole('tooltip')).toHaveTextContent('50 wins');
        await user.unhover(wins);

        await user.hover(draws);
        expect(await screen.findByRole('tooltip')).toHaveTextContent('20 draws');
        await user.unhover(draws);

        await user.hover(losses);
        expect(await screen.findByRole('tooltip')).toHaveTextContent('20 losses');
    });

    it('shows singular tooltip labels when each count is 1', async () => {
        const user = userEvent.setup();
        const player = createMockPlayerData({ gamesWon: 1, gamesDrawn: 1, gamesLost: 1, gamesPlayed: 3 });
        const { container } = render(
            <Wrapper>
                <PlayerWDLChart player={player} />
            </Wrapper>,
        );

        const [wins, draws, losses] = getProgressSections(container);

        await user.hover(wins);
        expect(await screen.findByRole('tooltip')).toHaveTextContent('1 win');
        await user.unhover(wins);

        await user.hover(draws);
        expect(await screen.findByRole('tooltip')).toHaveTextContent('1 draw');
        await user.unhover(draws);

        await user.hover(losses);
        expect(await screen.findByRole('tooltip')).toHaveTextContent('1 loss');
    });
});
