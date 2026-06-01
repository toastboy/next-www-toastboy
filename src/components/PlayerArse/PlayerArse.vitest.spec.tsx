import { render, screen } from '@testing-library/react';

import { PlayerArse } from '@/components/PlayerArse/PlayerArse';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultArse } from '@/tests/mocks/data/arse';

describe('PlayerArse', () => {
    it('renders arse table with data', () => {
        render(
            <Wrapper>
                <PlayerArse arse={defaultArse} />
            </Wrapper>,
        );

        expect(screen.getByText('In Goal')).toBeInTheDocument();
        expect(screen.getByText('Running')).toBeInTheDocument();
    });

    it('renders nothing when arse is null', () => {
        render(
            <Wrapper>
                <PlayerArse arse={null} />
            </Wrapper>,
        );

        const cells = screen.queryAllByText('-');
        expect(cells.length).toBe(0);
    });
});
