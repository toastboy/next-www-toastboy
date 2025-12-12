import { render, screen } from '@testing-library/react';

import { PlayerArse } from '@/components/PlayerArse/PlayerArse';
import { defaultArse } from '@/tests/mocks';

import { Wrapper } from './lib/common';

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

    it('renders dashes when arse is null', () => {
        render(
            <Wrapper>
                <PlayerArse arse={null} />
            </Wrapper>,
        );

        const cells = screen.getAllByText('-');
        expect(cells.length).toBeGreaterThan(0);
    });
});
