jest.mock('components/PlayerForm/PlayerForm', () => {
    const MockPlayerForm = () => <div data-testid="mock-player-form" />;
    MockPlayerForm.displayName = 'MockPlayerForm';
    return MockPlayerForm;
});

jest.mock('components/PlayerLink/PlayerLink', () => {
    const MockPlayerLink = () => <div data-testid="mock-player-link" />;
    MockPlayerLink.displayName = 'MockPlayerLink';
    return MockPlayerLink;
});

jest.mock('components/PlayerMugshot/PlayerMugshot', () => {
    const MockPlayerMugshot = () => <div data-testid="mock-player-mugshot" />;
    MockPlayerMugshot.displayName = 'MockPlayerMugshot';
    return MockPlayerMugshot;
});

import { render, screen } from '@testing-library/react';

import TeamPlayer from '@/components/TeamPlayer/TeamPlayer';
import { defaultTeamPlayer } from '@/tests/mocks';

import { Wrapper } from './lib/common';

describe('TeamPlayer', () => {
    it('renders team player with form and mugshot', () => {
        render(
            <Wrapper>
                <TeamPlayer teamPlayer={defaultTeamPlayer} />
            </Wrapper>,
        );

        expect(screen.getByTestId('mock-player-link')).toBeInTheDocument();
        expect(screen.getByTestId('mock-player-mugshot')).toBeInTheDocument();
        expect(screen.getByTestId('mock-player-form')).toBeInTheDocument();
    });

    it('displays goalie status when applicable', () => {
        const goalieTeamPlayer = {
            ...defaultTeamPlayer,
            outcome: { ...defaultTeamPlayer.outcome, goalie: true },
        };

        render(
            <Wrapper>
                <TeamPlayer teamPlayer={goalieTeamPlayer} />
            </Wrapper>,
        );

        expect(screen.getByText('GOALIE!')).toBeInTheDocument();
    });
});
