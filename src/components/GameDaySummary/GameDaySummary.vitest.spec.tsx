import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { GameDaySummary } from '@/components/GameDaySummary/GameDaySummary';
import { formatDate } from '@/lib/dates';
import { Wrapper } from '@/tests/components/lib/common';
import { createMockGameDay, defaultGameDay } from '@/tests/mocks/data/gameDay';
import { createMockOutcome } from '@/tests/mocks/data/outcome';
import { defaultTeamPlayer } from '@/tests/mocks/data/teamPlayer';
import { TeamPlayerType } from '@/types';

vi.mock('@/components/Team/Team');

/** One-player team with a specific points outcome. */
const teamWith = (points: 0 | 1 | 3): TeamPlayerType[] => [
    { ...defaultTeamPlayer, outcome: createMockOutcome({ points }) },
];

describe('GameDaySummary', () => {
    it('renders game title and empty navigation placeholders when no adjacent game days exist', () => {
        render(
            <Wrapper>
                <GameDaySummary
                    gameDay={defaultGameDay}
                    prevGameDay={null}
                    nextGameDay={null}
                    teamA={teamWith(3)}
                    teamB={teamWith(0)}
                />
            </Wrapper>,
        );

        expect(
            screen.getByRole('heading', {
                name: formatDate(defaultGameDay.date),
            }),
        ).toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        expect(screen.getByTestId('game-day-prev-placeholder')).toBeInTheDocument();
        expect(screen.getByTestId('game-day-next-placeholder')).toBeInTheDocument();
    });

    it('renders "No game" when game is false', () => {
        render(
            <Wrapper>
                <GameDaySummary
                    gameDay={{ ...defaultGameDay, game: false }}
                    prevGameDay={null}
                    nextGameDay={null}
                    teamA={[]}
                    teamB={[]}
                />
            </Wrapper>,
        );

        expect(screen.getByText(/No game/i)).toBeInTheDocument();
    });

    describe('previous and next links', () => {
        it('renders both previous and next links when both game days exist', () => {
            const prevGameDay = createMockGameDay({ id: 10, date: new Date('2020-12-27') });
            const nextGameDay = createMockGameDay({ id: 12, date: new Date('2021-01-10') });

            render(
                <Wrapper>
                    <GameDaySummary
                        gameDay={defaultGameDay}
                        prevGameDay={prevGameDay}
                        nextGameDay={nextGameDay}
                        teamA={teamWith(3)}
                        teamB={teamWith(0)}
                    />
                </Wrapper>,
            );

            const links = screen.getAllByRole('link');
            expect(links).toHaveLength(2);
            expect(links[0]).toHaveAttribute('href', '/footy/game/10');
            expect(links[1]).toHaveAttribute('href', '/footy/game/12');
            expect(screen.queryByTestId('game-day-prev-placeholder')).not.toBeInTheDocument();
            expect(screen.queryByTestId('game-day-next-placeholder')).not.toBeInTheDocument();
        });

        it('omits the previous link and renders a left placeholder when there is no previous game day', () => {
            const nextGameDay = createMockGameDay({ id: 12, date: new Date('2021-01-10') });

            render(
                <Wrapper>
                    <GameDaySummary
                        gameDay={defaultGameDay}
                        prevGameDay={null}
                        nextGameDay={nextGameDay}
                        teamA={teamWith(3)}
                        teamB={teamWith(0)}
                    />
                </Wrapper>,
            );

            const links = screen.getAllByRole('link');
            expect(links).toHaveLength(1);
            expect(links[0]).toHaveAttribute('href', '/footy/game/12');
            expect(screen.getByTestId('game-day-prev-placeholder')).toBeInTheDocument();
            expect(screen.queryByTestId('game-day-next-placeholder')).not.toBeInTheDocument();
        });

        it('omits the next link and renders a right placeholder when there is no next game day', () => {
            const prevGameDay = createMockGameDay({ id: 10, date: new Date('2020-12-27') });

            render(
                <Wrapper>
                    <GameDaySummary
                        gameDay={defaultGameDay}
                        prevGameDay={prevGameDay}
                        nextGameDay={null}
                        teamA={teamWith(3)}
                        teamB={teamWith(0)}
                    />
                </Wrapper>,
            );

            const links = screen.getAllByRole('link');
            expect(links).toHaveLength(1);
            expect(links[0]).toHaveAttribute('href', '/footy/game/10');
            expect(screen.queryByTestId('game-day-prev-placeholder')).not.toBeInTheDocument();
            expect(screen.getByTestId('game-day-next-placeholder')).toBeInTheDocument();
        });

        it('renders both placeholders when there are no previous and next game days', () => {
            render(
                <Wrapper>
                    <GameDaySummary
                        gameDay={defaultGameDay}
                        prevGameDay={null}
                        nextGameDay={null}
                        teamA={teamWith(3)}
                        teamB={teamWith(0)}
                    />
                </Wrapper>,
            );

            expect(screen.queryByRole('link')).not.toBeInTheDocument();
            expect(screen.getByTestId('game-day-prev-placeholder')).toBeInTheDocument();
            expect(screen.getByTestId('game-day-next-placeholder')).toBeInTheDocument();
        });
    });

    describe('comment display', () => {
        it('shows comment in parentheses when game exists', () => {
            render(
                <Wrapper>
                    <GameDaySummary
                        gameDay={defaultGameDay}
                        prevGameDay={null}
                        nextGameDay={null}
                        teamA={teamWith(3)}
                        teamB={teamWith(0)}
                    />
                </Wrapper>,
            );
            expect(screen.getByText(`(${defaultGameDay.comment})`)).toBeInTheDocument();
        });

        it('shows no comment text when comment is null', () => {
            render(
                <Wrapper>
                    <GameDaySummary
                        gameDay={createMockGameDay({ comment: null })}
                        prevGameDay={null}
                        nextGameDay={null}
                        teamA={teamWith(3)}
                        teamB={teamWith(0)}
                    />
                </Wrapper>,
            );
            expect(screen.queryByText(/\(/)).not.toBeInTheDocument();
        });

        it('includes comment in the "No game" message', () => {
            render(
                <Wrapper>
                    <GameDaySummary
                        gameDay={{ ...defaultGameDay, game: false }}
                        prevGameDay={null}
                        nextGameDay={null}
                        teamA={[]}
                        teamB={[]}
                    />
                </Wrapper>,
            );
            expect(screen.getByText(`No game (${defaultGameDay.comment})`)).toBeInTheDocument();
        });

        it('shows "No game" with no trailing comment when comment is null', () => {
            render(
                <Wrapper>
                    <GameDaySummary
                        gameDay={createMockGameDay({ game: false, comment: null })}
                        prevGameDay={null}
                        nextGameDay={null}
                        teamA={[]}
                        teamB={[]}
                    />
                </Wrapper>,
            );
            expect(screen.getByText(/^No game\s*$/)).toBeInTheDocument();
        });
    });
});
