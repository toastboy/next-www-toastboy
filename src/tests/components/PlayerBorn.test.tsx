import { render, screen } from '@testing-library/react';

import { PlayerBorn } from '@/components/PlayerBorn/PlayerBorn';
import { defaultPlayer } from '@/tests/mocks';

import { Wrapper } from './lib/common';

describe('PlayerBorn', () => {
    it('renders player birth date', () => {
        render(
            <Wrapper>
                <PlayerBorn player={defaultPlayer} />
            </Wrapper>,
        );

        const dateString = defaultPlayer.born!.toLocaleDateString('sv');
        expect(screen.getByText(dateString)).toBeInTheDocument();
    });

    it('renders "Unknown" when birth date is null', () => {
        render(
            <Wrapper>
                <PlayerBorn player={{ ...defaultPlayer, born: null }} />
            </Wrapper>,
        );

        expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
});
