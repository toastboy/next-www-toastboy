jest.mock('@/components/PlayerArse/PlayerArse');
jest.mock('@/components/PlayerBorn/PlayerBorn');
jest.mock('@/components/PlayerClubs/PlayerClubs');
jest.mock('@/components/PlayerCountries/PlayerCountries');
jest.mock('@/components/PlayerForm/PlayerForm');
jest.mock('@/components/PlayerHistory/PlayerHistory');
jest.mock('@/components/PlayerLastPlayed/PlayerLastPlayed');
jest.mock('@/components/PlayerMugshot/PlayerMugshot');
jest.mock('@/components/PlayerTrophies/PlayerTrophies');

import { render, screen } from '@testing-library/react';

import { PlayerProfile } from '@/components/PlayerProfile/PlayerProfile';
import { Wrapper } from '@/tests/components/lib/common';
import {
    defaultArse,
    defaultClubSupporterDataList,
    defaultCountrySupporterDataList,
    defaultPlayer,
    defaultPlayerFormList,
    defaultPlayerRecord,
    defaultTrophiesList,
} from '@/tests/mocks';

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
