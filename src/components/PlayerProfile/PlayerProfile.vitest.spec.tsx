
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { PlayerProfile } from '@/components/PlayerProfile/PlayerProfile';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultArse } from '@/tests/mocks/data/arse';
import { defaultClubSupporterDataList } from '@/tests/mocks/data/clubSupporterData';
import { defaultCountrySupporterDataList } from '@/tests/mocks/data/countrySupporterData';
import { defaultPlayer } from '@/tests/mocks/data/player';
import { defaultPlayerFormList } from '@/tests/mocks/data/playerForm';
import { defaultPlayerRecord, defaultTrophiesList } from '@/tests/mocks/data/playerRecord';

vi.mock('@/components/PlayerArse/PlayerArse');
vi.mock('@/components/PlayerBorn/PlayerBorn');
vi.mock('@/components/PlayerClubs/PlayerClubs');
vi.mock('@/components/PlayerCountries/PlayerCountries');
vi.mock('@/components/PlayerForm/PlayerForm');
vi.mock('@/components/PlayerHistory/PlayerHistory');
vi.mock('@/components/PlayerLastPlayed/PlayerLastPlayed');
vi.mock('@/components/PlayerMugshot/PlayerMugshot');
vi.mock('@/components/PlayerTrophies/PlayerTrophies');

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
