
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { PlayerLastPlayed } from '@/components/PlayerLastPlayed/PlayerLastPlayed';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultPlayerFormList } from '@/tests/mocks/data/playerForm';

vi.mock('@/components/GameDayLink/GameDayLink');

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
