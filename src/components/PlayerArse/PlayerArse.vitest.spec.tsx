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
        expect(screen.getByText('Shooting')).toBeInTheDocument();
        expect(screen.getByText('Passing')).toBeInTheDocument();
        expect(screen.getByText('Ball Skill')).toBeInTheDocument();
        expect(screen.getByText('Attacking')).toBeInTheDocument();
        expect(screen.getByText('Defending')).toBeInTheDocument();
        expect(screen.getAllByText('10')).toHaveLength(7);
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

    it('renders dashes for null stat fields', () => {
        render(
            <Wrapper>
                <PlayerArse arse={{}} />
            </Wrapper>,
        );

        expect(screen.getAllByText('-')).toHaveLength(7);
    });
});
