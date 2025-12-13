jest.mock('@/components/ClubBadge/ClubBadge');

import { render, screen } from '@testing-library/react';

import { PlayerClubs } from '@/components/PlayerClubs/PlayerClubs';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultClubSupporterDataList } from '@/tests/mocks';

describe('PlayerClubs', () => {
    it('renders club badges', () => {
        render(
            <Wrapper>
                <PlayerClubs clubs={defaultClubSupporterDataList} />
            </Wrapper>,
        );

        screen.debug();

        const badges = screen.getAllByText(/ClubBadge:/);
        expect(badges.length).toBeGreaterThan(0);
    });

    it('renders nothing when clubs list is empty', () => {
        render(
            <Wrapper>
                <PlayerClubs clubs={[]} />
            </Wrapper>,
        );

        screen.debug();

        const badges = screen.queryAllByText(/ClubBadge:/);
        expect(badges.length).toBe(0);
    });
});
