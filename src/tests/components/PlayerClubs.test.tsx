jest.mock('components/ClubBadge/ClubBadge', () => {
    const MockClubBadge = () => <div data-testid="mock-club-badge" />;
    MockClubBadge.displayName = 'MockClubBadge';
    return MockClubBadge;
});

import { render, screen } from '@testing-library/react';

import PlayerClubs from '@/components/PlayerClubs/PlayerClubs';
import { defaultClubSupporterDataList } from '@/tests/mocks';

import { Wrapper } from './lib/common';

describe('PlayerClubs', () => {
    it('renders club badges', () => {
        render(
            <Wrapper>
                <PlayerClubs clubs={defaultClubSupporterDataList} />
            </Wrapper>,
        );

        const badges = screen.getAllByTestId('mock-club-badge');
        expect(badges.length).toBeGreaterThan(0);
    });

    it('renders nothing when clubs list is empty', () => {
        const { container } = render(
            <Wrapper>
                <PlayerClubs clubs={[]} />
            </Wrapper>,
        );

        expect(container.firstChild).toBeEmptyDOMElement();
    });
});
