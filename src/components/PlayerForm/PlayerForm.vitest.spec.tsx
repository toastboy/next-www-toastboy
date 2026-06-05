
import { render, screen } from '@testing-library/react';

import { PlayerForm } from '@/components/PlayerForm/PlayerForm';
import { Wrapper } from '@/tests/components/lib/common';
import { createMockGameDay } from '@/tests/mocks/data/gameDay';
import { createMockOutcome } from '@/tests/mocks/data/outcome';
import { createMockPaddingFormEntry, defaultPlayerFormList } from '@/tests/mocks/data/playerForm';

describe('PlayerForm', () => {
    it('renders arc links for each game day', () => {
        render(
            <Wrapper>
                <PlayerForm form={defaultPlayerFormList} />
            </Wrapper>,
        );

        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(10);
        expect(links[0]).toHaveAttribute('href', '/footy/game/1');
    });

    it('renders nothing for empty form', () => {
        const { container } = render(
            <Wrapper>
                <PlayerForm form={[]} />
            </Wrapper>,
        );

        expect(container.querySelector('svg')).toBeNull();
    });

    it('renders padding entries as plain paths with no link or tooltip', () => {
        const form = [createMockPaddingFormEntry(), createMockPaddingFormEntry()];

        const { container } = render(
            <Wrapper>
                <PlayerForm form={form} />
            </Wrapper>,
        );

        expect(screen.queryAllByRole('link')).toHaveLength(0);
        expect(container.querySelectorAll('path')).toHaveLength(2);
    });

    it('renders a single entry with unknown points using the grey fallback colour and large arc', () => {
        const singleEntry = [{
            ...createMockOutcome({ playerId: 1, points: 2, gameDayId: 42 }),
            gameDay: createMockGameDay({ id: 42 }),
        }];

        const { container } = render(
            <Wrapper>
                <PlayerForm form={singleEntry} />
            </Wrapper>,
        );

        // Single entry with 270° arc span > 180° → large arc flag used
        const paths = container.querySelectorAll('path');
        expect(paths).toHaveLength(1);

        // Points=2 is not in colorMap → grey fallback colour applied
        const pathStroke = paths[0]?.getAttribute('stroke');
        expect(pathStroke).toContain('gray');

        // Entry has a gameDay → rendered as a link with empty result label (not in resultLabel map)
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(1);
        const ariaLabel = links[0]?.getAttribute('aria-label') ?? '';
        expect(ariaLabel).toMatch(/–\s*$/);
    });

    it('renders only real entries as links when mixed with padding', () => {
        const realEntries = defaultPlayerFormList.slice(0, 3);
        const form = [
            createMockPaddingFormEntry(),
            createMockPaddingFormEntry(),
            ...realEntries,
        ];

        const { container } = render(
            <Wrapper>
                <PlayerForm form={form} />
            </Wrapper>,
        );

        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(3);
        expect(container.querySelectorAll('path')).toHaveLength(5);
    });
});
