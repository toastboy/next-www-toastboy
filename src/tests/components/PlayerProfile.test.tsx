jest.mock('@/components/PlayerArse/PlayerArse', () => {
    const MockPlayerArse = () => <div data-testid="mock-player-arse" />;
    MockPlayerArse.displayName = 'MockPlayerArse';
    return MockPlayerArse;
});

jest.mock('@/components/PlayerBorn/PlayerBorn', () => {
    const MockPlayerBorn = () => <div data-testid="mock-player-born" />;
    MockPlayerBorn.displayName = 'MockPlayerBorn';
    return MockPlayerBorn;
});

jest.mock('@/components/PlayerClubs/PlayerClubs', () => {
    const MockPlayerClubs = () => <div data-testid="mock-player-clubs" />;
    MockPlayerClubs.displayName = 'MockPlayerClubs';
    return MockPlayerClubs;
});

jest.mock('@/components/PlayerCountries/PlayerCountries', () => {
    const MockPlayerCountries = () => <div data-testid="mock-player-countries" />;
    MockPlayerCountries.displayName = 'MockPlayerCountries';
    return MockPlayerCountries;
});

jest.mock('@/components/PlayerForm/PlayerForm', () => {
    const MockPlayerForm = () => <div data-testid="mock-player-form" />;
    MockPlayerForm.displayName = 'MockPlayerForm';
    return { PlayerForm: MockPlayerForm };
});

jest.mock('@/components/PlayerHistory/PlayerHistory', () => {
    const MockPlayerHistory = () => <div data-testid="mock-player-history" />;
    MockPlayerHistory.displayName = 'MockPlayerHistory';
    return MockPlayerHistory;
});

jest.mock('@/components/PlayerLastPlayed/PlayerLastPlayed', () => {
    const MockPlayerLastPlayed = () => <div data-testid="mock-player-last-played" />;
    MockPlayerLastPlayed.displayName = 'MockPlayerLastPlayed';
    return MockPlayerLastPlayed;
});

jest.mock('@/components/PlayerMugshot/PlayerMugshot', () => {
    const MockPlayerMugshot = () => <div data-testid="mock-player-mugshot" />;
    MockPlayerMugshot.displayName = 'MockPlayerMugshot';
    return { PlayerMugshot: MockPlayerMugshot };
});

jest.mock('@/components/PlayerTrophies/PlayerTrophies', () => {
    const MockPlayerTrophies = () => <div data-testid="mock-player-trophies" />;
    MockPlayerTrophies.displayName = 'MockPlayerTrophies';
    return { PlayerTrophies: MockPlayerTrophies };
});

import { render, screen } from '@testing-library/react';

import { PlayerProfile } from '@/components/PlayerProfile/PlayerProfile';
import {
    defaultArse,
    defaultClubSupporterDataList,
    defaultCountrySupporterDataList,
    defaultPlayer,
    defaultPlayerFormList,
    defaultPlayerRecord,
    defaultTrophiesList,
} from '@/tests/mocks';

import { Wrapper } from './lib/common';

describe('PlayerProfile', () => {
    it('renders player name and profile sections', () => {
        render(
            <Wrapper>
                <PlayerProfile
                    playerName="Test Player"
                    player={defaultPlayer}
                    year={2024}
                    form={defaultPlayerFormList}
                    lastPlayed={defaultPlayerFormList[0]}
                    clubs={defaultClubSupporterDataList}
                    countries={defaultCountrySupporterDataList}
                    arse={defaultArse}
                    activeYears={[2023, 2024]}
                    record={defaultPlayerRecord}
                    trophies={defaultTrophiesList}
                />
            </Wrapper>,
        );

        expect(screen.getByText(defaultPlayer.name!)).toBeInTheDocument();
    });
});
