jest.mock('@/components/GameDayLink/GameDayLink');

import { render, screen } from '@testing-library/react';

import { PlayerLastPlayed } from '@/components/PlayerLastPlayed/PlayerLastPlayed';
import { defaultPlayerFormList } from '@/tests/mocks';

import { Wrapper } from './lib/common';

describe('PlayerLastPlayed', () => {
    it('renders last played gameday', () => {
        render(
            <Wrapper>
                <PlayerLastPlayed lastPlayed={defaultPlayerFormList[0]} />
            </Wrapper>,
        );

        expect(screen.getByText(/Last played:/)).toBeInTheDocument();
    });

    it('renders "never" when lastPlayed is null', () => {
        render(
            <Wrapper>
                <PlayerLastPlayed lastPlayed={null} />
            </Wrapper>,
        );

        expect(screen.getByText(/Last played: never/)).toBeInTheDocument();
    });
});
