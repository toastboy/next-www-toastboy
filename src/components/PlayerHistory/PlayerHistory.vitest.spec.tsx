import { render, screen } from '@testing-library/react';

import { PlayerHistory } from '@/components/PlayerHistory/PlayerHistory';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerRecord } from '@/tests/mocks';

describe('PlayerHistory', () => {
    it('renders year selector and child components with active years', async () => {
        render(
            <Wrapper>
                <PlayerHistory
                    playerName={'Lionel Scruffy'}
                    activeYears={[2020, 2021, 2022, 2023]}
                    year={2023}
                    record={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        expect(await screen.findByRole('button', { name: '2023' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '2020' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '2021' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '2022' })).toBeInTheDocument();
        expect(screen.getByText((_, node) =>
            node?.textContent?.replace(/\s+/g, ' ').includes('2023 Results') ?? false,
        )).toBeInTheDocument();
        expect(screen.getByText((_, node) =>
            node?.textContent?.replace(/\s+/g, ' ').includes('2023 Positions') ?? false,
        )).toBeInTheDocument();
    });

    it('handles no active years', async () => {
        render(
            <Wrapper>
                <PlayerHistory
                    playerName={'Lionel Scruffy'}
                    activeYears={[]}
                    year={2023}
                    record={defaultPlayerRecord}
                />
            </Wrapper>,
        );

        expect(screen.queryByRole('button', { name: '2023' })).not.toBeInTheDocument();
        expect(screen.getByText((_, node) =>
            node?.textContent?.replace(/\s+/g, ' ').includes('2023 Results') ?? false,
        )).toBeInTheDocument();
        expect(screen.getByText((_, node) =>
            node?.textContent?.replace(/\s+/g, ' ').includes('2023 Positions') ?? false,
        )).toBeInTheDocument();
    });
});
