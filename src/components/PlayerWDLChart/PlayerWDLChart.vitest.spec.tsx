import { render } from '@testing-library/react';

import { PlayerWDLChart } from '@/components/PlayerWDLChart/PlayerWDLChart';
import { hoverForTooltip, Wrapper } from '@/tests/components/lib/common';
import {
    createMockPlayerData,
    defaultPlayerData,
} from '@/tests/mocks/data/playerData';

const getProgressSections = (container: HTMLElement) =>
    container.querySelectorAll('.mantine-Progress-section');

describe('PlayerWDLChart', () => {
    it('renders win/draw/loss progress chart', () => {
        const { container } = render(
            <Wrapper>
                <PlayerWDLChart player={defaultPlayerData} />
            </Wrapper>,
        );

        expect(
            container.querySelector('[role="progressbar"]'),
        ).toBeInTheDocument();
    });

    it.each([
        ['wins', 0],
        ['draws', 1],
        ['losses', 2],
    ])(
        'shows the combined P/W/D/L tooltip when the %s section is hovered',
        async (_name, index) => {
            const { container } = render(
                <Wrapper>
                    <PlayerWDLChart player={defaultPlayerData} />
                </Wrapper>,
            );

            const section = getProgressSections(container)[index];
            const tooltip = await hoverForTooltip(section as HTMLElement);
            expect(tooltip).toHaveTextContent('P90 W50 D20 L20');
        },
    );

    it('interpolates each count into the tooltip label', async () => {
        const player = createMockPlayerData({
            gamesWon: 1,
            gamesDrawn: 1,
            gamesLost: 1,
            gamesPlayed: 3,
        });
        const { container } = render(
            <Wrapper>
                <PlayerWDLChart player={player} />
            </Wrapper>,
        );

        const [wins] = getProgressSections(container);
        const tooltip = await hoverForTooltip(wins as HTMLElement);
        expect(tooltip).toHaveTextContent('P3 W1 D1 L1');
    });

    it('renders zero-width sections instead of NaN when the player has not played any games', () => {
        const player = createMockPlayerData({
            gamesWon: 0,
            gamesDrawn: 0,
            gamesLost: 0,
            gamesPlayed: 0,
        });
        const { container } = render(
            <Wrapper>
                <PlayerWDLChart player={player} />
            </Wrapper>,
        );

        const progressBars = container.querySelectorAll('[role="progressbar"]');
        expect(progressBars).toHaveLength(3);
        progressBars.forEach((bar) =>
            expect(bar).toHaveAttribute('aria-valuenow', '0'),
        );
    });
});
