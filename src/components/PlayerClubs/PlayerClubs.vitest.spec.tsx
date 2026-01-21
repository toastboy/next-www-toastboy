
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { PlayerClubs } from '@/components/PlayerClubs/PlayerClubs';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultClubSupporterDataList } from '@/tests/mocks';

vi.mock('@/components/ClubBadge/ClubBadge');

describe('PlayerClubs', () => {
    it('renders club badges', () => {
        render(
            <Wrapper>
                <PlayerClubs clubs={defaultClubSupporterDataList} />
            </Wrapper>,
        );

        const badges = screen.getAllByText(/ClubBadge:/);
        expect(badges.length).toBeGreaterThan(0);
    });

    it('renders nothing when clubs list is empty', () => {
        render(
            <Wrapper>
                <PlayerClubs clubs={[]} />
            </Wrapper>,
        );

        const badges = screen.queryAllByText(/ClubBadge:/);
        expect(badges.length).toBe(0);
    });
});
