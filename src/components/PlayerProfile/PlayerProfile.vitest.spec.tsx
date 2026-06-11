
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { PlayerProfile } from '@/components/PlayerProfile/PlayerProfile';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultArse } from '@/tests/mocks/data/arse';
import { defaultClubSupporterDataList } from '@/tests/mocks/data/clubSupporterData';
import { defaultCountrySupporterDataList } from '@/tests/mocks/data/countrySupporterData';
import { createMockPlayer, defaultPlayer } from '@/tests/mocks/data/player';
import { defaultPlayerFormList } from '@/tests/mocks/data/playerForm';
import { defaultPlayerRecord, defaultTrophiesList } from '@/tests/mocks/data/playerRecord';

vi.mock('@/components/PlayerArse/PlayerArse');
vi.mock('@/components/PlayerBorn/PlayerBorn');
vi.mock('@/components/PlayerCard/PlayerCard');
vi.mock('@/components/PlayerForm/PlayerForm');
vi.mock('@/components/PlayerHeatmap/PlayerHeatmap');
vi.mock('@/components/PlayerLastPlayed/PlayerLastPlayed');
vi.mock('@/components/PlayerPositions/PlayerPositions');
vi.mock('@/components/PlayerResults/PlayerResults');

describe('PlayerProfile', () => {
    it('renders player name and profile sections', () => {
        render(
            <Wrapper>
                <PlayerProfile
                    player={defaultPlayer}
                    year={2024}
                    history={defaultPlayerFormList}
                    lastPlayed={defaultPlayerFormList[0]}
                    clubs={defaultClubSupporterDataList}
                    countries={defaultCountrySupporterDataList}
                    arse={defaultArse}
                    activeYears={[2023, 2024]}
                    record={defaultPlayerRecord}
                    trophies={defaultTrophiesList}
                    prevPlayer={null}
                    nextPlayer={null}
                />
            </Wrapper>,
        );

        expect(screen.getByText(defaultPlayer.name)).toBeInTheDocument();
    });

    it('renders PlayerCard', () => {
        render(
            <Wrapper>
                <PlayerProfile
                    player={defaultPlayer}
                    year={2024}
                    history={defaultPlayerFormList}
                    lastPlayed={defaultPlayerFormList[0]}
                    clubs={defaultClubSupporterDataList}
                    countries={defaultCountrySupporterDataList}
                    arse={defaultArse}
                    activeYears={[2023, 2024]}
                    record={defaultPlayerRecord}
                    trophies={defaultTrophiesList}
                    prevPlayer={null}
                    nextPlayer={null}
                />
            </Wrapper>,
        );

        expect(screen.getByText(/PlayerCard:/)).toBeInTheDocument();
    });

    describe('prev/next navigation', () => {
        const prevPlayer = createMockPlayer({ id: 2, name: 'Previous Player' });
        const nextPlayer = createMockPlayer({ id: 3, name: 'Next Player' });
        const year = 2024;

        const baseProps = {
            player: defaultPlayer,
            year,
            history: defaultPlayerFormList,
            lastPlayed: defaultPlayerFormList[0],
            clubs: defaultClubSupporterDataList,
            countries: defaultCountrySupporterDataList,
            arse: defaultArse,
            activeYears: [2023, 2024],
            record: defaultPlayerRecord,
            trophies: defaultTrophiesList,
        };

        it('renders a labelled prev-arrow link when prevPlayer is provided', () => {
            render(
                <Wrapper>
                    <PlayerProfile {...baseProps} prevPlayer={prevPlayer} nextPlayer={null} />
                </Wrapper>,
            );

            const link = screen.getByRole('link', {
                name: `Previous player: ${prevPlayer.name}`,
            });
            expect(link).toHaveAttribute('href', `/footy/player/${prevPlayer.id}/${year}`);
            expect(screen.queryByTestId('player-prev-placeholder')).not.toBeInTheDocument();
        });

        it('renders the prev placeholder when prevPlayer is null', () => {
            render(
                <Wrapper>
                    <PlayerProfile {...baseProps} prevPlayer={null} nextPlayer={null} />
                </Wrapper>,
            );

            expect(screen.getByTestId('player-prev-placeholder')).toBeInTheDocument();
        });

        it('renders a labelled next-arrow link when nextPlayer is provided', () => {
            render(
                <Wrapper>
                    <PlayerProfile {...baseProps} prevPlayer={null} nextPlayer={nextPlayer} />
                </Wrapper>,
            );

            const link = screen.getByRole('link', { name: `Next player: ${nextPlayer.name}` });
            expect(link).toHaveAttribute('href', `/footy/player/${nextPlayer.id}/${year}`);
            expect(screen.queryByTestId('player-next-placeholder')).not.toBeInTheDocument();
        });

        it('renders the next placeholder when nextPlayer is null', () => {
            render(
                <Wrapper>
                    <PlayerProfile {...baseProps} prevPlayer={null} nextPlayer={null} />
                </Wrapper>,
            );

            expect(screen.getByTestId('player-next-placeholder')).toBeInTheDocument();
        });
    });
});
