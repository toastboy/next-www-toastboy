
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

vi.mock('@/components/GameDayLink/GameDayLink');
vi.mock('@/components/PlayerArse/PlayerArse');
vi.mock('@/components/PlayerCard/PlayerCard');
vi.mock('@/components/PlayerHeatmap/PlayerHeatmap');
vi.mock('@/components/PlayerLink/PlayerLink');
vi.mock('@/components/PlayerPositions/PlayerPositions');
vi.mock('@/components/PlayerResults/PlayerResults');
vi.mock('@/components/TitleWithYearDropdown/TitleWithYearDropdown');

describe('PlayerProfile', () => {
    it('renders player name and profile sections', () => {
        render(
            <Wrapper>
                <PlayerProfile
                    player={defaultPlayer}
                    introducedBy={null}
                    year={2024}
                    history={defaultPlayerFormList}
                    lastPlayed={defaultPlayerFormList[0]}
                    lastWon={defaultPlayerFormList[0]}
                    clubs={defaultClubSupporterDataList}
                    countries={defaultCountrySupporterDataList}
                    arse={defaultArse}
                    activeYears={[2023, 2024]}
                    record={defaultPlayerRecord}
                    trophies={defaultTrophiesList}
                    prevPlayer={null}
                    nextPlayer={null}
                    isAuthenticated={true}
                    isAdmin={true}
                />
            </Wrapper>,
        );

        expect(screen.getByText((content) =>
            content.startsWith('TitleWithYearDropdown:') && content.includes(defaultPlayer.name),
        )).toBeInTheDocument();
    });

    it('renders PlayerCard', () => {
        render(
            <Wrapper>
                <PlayerProfile
                    player={defaultPlayer}
                    introducedBy={null}
                    year={2024}
                    history={defaultPlayerFormList}
                    lastPlayed={defaultPlayerFormList[0]}
                    lastWon={defaultPlayerFormList[0]}
                    clubs={defaultClubSupporterDataList}
                    countries={defaultCountrySupporterDataList}
                    arse={defaultArse}
                    activeYears={[2023, 2024]}
                    record={defaultPlayerRecord}
                    trophies={defaultTrophiesList}
                    prevPlayer={null}
                    nextPlayer={null}
                    isAuthenticated={true}
                    isAdmin={true}
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
            introducedBy: null,
            history: defaultPlayerFormList,
            lastPlayed: defaultPlayerFormList[0],
            lastWon: defaultPlayerFormList[0],
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

            expect(screen.getByText((content) =>
                content.startsWith('PlayerLink:') &&
                content.includes(`"id":${prevPlayer.id}`) &&
                content.includes('"format":"left-arrow"'),
            )).toBeInTheDocument();
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

            expect(screen.getByText((content) =>
                content.startsWith('PlayerLink:') &&
                content.includes(`"id":${nextPlayer.id}`) &&
                content.includes('"format":"right-arrow"'),
            )).toBeInTheDocument();
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

    describe('table rows', () => {
        const rowBaseProps = {
            player: defaultPlayer,
            year: 2024,
            introducedBy: null,
            history: defaultPlayerFormList,
            lastPlayed: null,
            lastWon: null,
            clubs: defaultClubSupporterDataList,
            countries: defaultCountrySupporterDataList,
            arse: defaultArse,
            activeYears: [2023, 2024],
            record: defaultPlayerRecord,
            trophies: defaultTrophiesList,
            prevPlayer: null,
            nextPlayer: null,
        };

        describe('email row', () => {
            it('shows when isAdmin is true', () => {
                render(<Wrapper><PlayerProfile {...rowBaseProps} isAdmin={true} /></Wrapper>);
                expect(screen.getByText('Email')).toBeInTheDocument();
            });

            it('is hidden when isAdmin is false', () => {
                render(<Wrapper><PlayerProfile {...rowBaseProps} isAdmin={false} /></Wrapper>);
                expect(screen.queryByText('Email')).not.toBeInTheDocument();
            });

            it('is hidden by default', () => {
                render(<Wrapper><PlayerProfile {...rowBaseProps} /></Wrapper>);
                expect(screen.queryByText('Email')).not.toBeInTheDocument();
            });
        });

        describe('born row', () => {
            it('shows when isAuthenticated is true', () => {
                render(<Wrapper><PlayerProfile {...rowBaseProps} isAuthenticated={true} /></Wrapper>);
                expect(screen.getByText('Born')).toBeInTheDocument();
            });

            it('is hidden when isAuthenticated is false', () => {
                render(<Wrapper><PlayerProfile {...rowBaseProps} isAuthenticated={false} /></Wrapper>);
                expect(screen.queryByText('Born')).not.toBeInTheDocument();
            });
        });

        describe('introducedBy row', () => {
            it('shows when introducedBy is provided', () => {
                const introducer = createMockPlayer({ id: 2, name: 'Introducer' });
                render(<Wrapper><PlayerProfile {...rowBaseProps} introducedBy={introducer} /></Wrapper>);
                expect(screen.getByText('Introduced by')).toBeInTheDocument();
                expect(screen.getByText((content) =>
                    content.startsWith('PlayerLink:') && content.includes('"name":"Introducer"'),
                )).toBeInTheDocument();
            });

            it('is hidden when introducedBy is null', () => {
                render(<Wrapper><PlayerProfile {...rowBaseProps} introducedBy={null} /></Wrapper>);
                expect(screen.queryByText('Introduced by')).not.toBeInTheDocument();
            });
        });

        describe('lastWon row', () => {
            it('is always present regardless of lastWon value', () => {
                render(<Wrapper><PlayerProfile {...rowBaseProps} lastWon={null} /></Wrapper>);
                expect(screen.getByText('Last won')).toBeInTheDocument();
            });

            it('passes the game day through to GameDayLink when lastWon is provided', () => {
                render(<Wrapper><PlayerProfile {...rowBaseProps} lastWon={defaultPlayerFormList[0]} /></Wrapper>);
                expect(screen.getByText((content) =>
                    content.startsWith('GameDayLink:') && content.includes('"gameDay"'),
                )).toBeInTheDocument();
            });
        });
    });
});
