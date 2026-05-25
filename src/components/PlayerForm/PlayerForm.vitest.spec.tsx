
import { render, screen } from '@testing-library/react';

import { PlayerForm } from '@/components/PlayerForm/PlayerForm';
import { Wrapper } from '@/tests/components/lib/common';
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
