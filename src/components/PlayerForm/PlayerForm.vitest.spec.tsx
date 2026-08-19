import { render, screen } from '@testing-library/react';

import { PlayerForm } from '@/components/PlayerForm/PlayerForm';
import { Wrapper } from '@/tests/components/lib/common';
import { createMockGameDay } from '@/tests/mocks/data/gameDay';
import { createMockOutcome } from '@/tests/mocks/data/outcome';
import {
    createMockPaddingFormEntry,
    defaultPlayerFormList,
} from '@/tests/mocks/data/playerForm';

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

        expect(screen.queryAllByRole('link')).toHaveLength(0);
        expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(
            0,
        );
    });

    it('renders padding entries as plain badges with no link or tooltip', () => {
        const form = [
            createMockPaddingFormEntry(),
            createMockPaddingFormEntry(),
        ];

        const { container } = render(
            <Wrapper>
                <PlayerForm form={form} />
            </Wrapper>,
        );

        expect(screen.queryAllByRole('link')).toHaveLength(0);
        expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(
            2,
        );
    });

    it('renders a single entry with unknown points using the grey fallback colour', () => {
        // points can only ever be 0/1/3/null in practice (it's derived from
        // GameDay.status + Outcome.team), but the component still defends
        // against an unmapped value defensively — simulate that here.
        const singleEntry = [
            {
                ...createMockOutcome({ playerId: 1, gameDayId: 42 }),
                points: 2 as unknown as 0 | 1 | 3,
                gameDay: createMockGameDay({ id: 42 }),
            },
        ];

        render(
            <Wrapper>
                <PlayerForm form={singleEntry} />
            </Wrapper>,
        );

        // Entry has a gameDay → rendered as a link with empty result label (not in resultLabel map)
        const links = screen.getAllByRole('link');
        expect(links).toHaveLength(1);
        const ariaLabel = links[0]?.getAttribute('aria-label') ?? '';
        expect(ariaLabel).toMatch(/–\s*$/);

        // Points=2 is not in colorMap → grey fallback colour applied
        expect(links[0]?.getAttribute('style')).toContain(
            'var(--mantine-color-gray-5)',
        );
    });

    it('renders only real entries as links when mixed with padding', () => {
        const realEntries = defaultPlayerFormList.slice(0, 3);
        const form = [
            createMockPaddingFormEntry(),
            createMockPaddingFormEntry(),
            ...realEntries,
        ];

        render(
            <Wrapper>
                <PlayerForm form={form} />
            </Wrapper>,
        );

        expect(screen.getAllByRole('link')).toHaveLength(3);
    });
});
