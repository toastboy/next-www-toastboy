import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { PlayerCard } from '@/components/PlayerCard/PlayerCard';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultClubSupporterDataList } from '@/tests/mocks/data/clubSupporterData';
import { defaultCountrySupporterDataList } from '@/tests/mocks/data/countrySupporterData';
import { defaultPlayer } from '@/tests/mocks/data/player';
import { defaultTrophiesList } from '@/tests/mocks/data/playerRecord';

vi.mock('@/components/PlayerClubs/PlayerClubs');
vi.mock('@/components/PlayerCountries/PlayerCountries');
vi.mock('@/components/PlayerMugshot/PlayerMugshot');
vi.mock('@/components/PlayerTrophies/PlayerTrophies');

describe('PlayerCard', () => {
    const defaultProps = {
        player: defaultPlayer,
        clubs: defaultClubSupporterDataList,
        countries: defaultCountrySupporterDataList,
        trophies: defaultTrophiesList,
    };

    it('renders PlayerMugshot', () => {
        render(
            <Wrapper>
                <PlayerCard {...defaultProps} />
            </Wrapper>,
        );

        expect(screen.getByText(/PlayerMugshot:/)).toBeInTheDocument();
    });

    it('renders PlayerTrophies', () => {
        render(
            <Wrapper>
                <PlayerCard {...defaultProps} />
            </Wrapper>,
        );

        expect(screen.getByText(/PlayerTrophies:/)).toBeInTheDocument();
    });

    it('renders PlayerClubs', () => {
        render(
            <Wrapper>
                <PlayerCard {...defaultProps} />
            </Wrapper>,
        );

        expect(screen.getByText(/PlayerClubs:/)).toBeInTheDocument();
    });

    it('renders PlayerCountries', () => {
        render(
            <Wrapper>
                <PlayerCard {...defaultProps} />
            </Wrapper>,
        );

        expect(screen.getByText(/PlayerCountries:/)).toBeInTheDocument();
    });
});
