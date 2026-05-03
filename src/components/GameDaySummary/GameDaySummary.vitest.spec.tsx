import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { GameDaySummary } from '@/components/GameDaySummary/GameDaySummary';
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
    it('renders game title when game exists', () => {
        render(
            <Wrapper>
                <GameDaySummary
                    gameDay={defaultGameDay}
                    teamA={teamWith(3)}
                    teamB={teamWith(0)}
                />
            </Wrapper>,
        );

        expect(screen.getByText(/Game 1:/)).toBeInTheDocument();
    });

    it('renders "No game" when game is false', () => {
        render(
            <Wrapper>
                <GameDaySummary
                    gameDay={{ ...defaultGameDay, game: false }}
                    teamA={[]}
                    teamB={[]}
                />
            </Wrapper>,
        );

        expect(screen.getByText(/No game/i)).toBeInTheDocument();
    });

    describe('winner badge', () => {
        it('shows "Team A won" when Team A wins', () => {
            render(
                <Wrapper>
                    <GameDaySummary
                        gameDay={defaultGameDay}
                        teamA={teamWith(3)}
                        teamB={teamWith(0)}
                    />
                </Wrapper>,
            );
            expect(screen.getByText('Team A won')).toBeInTheDocument();
        });

        it('shows "Team B won" when Team B wins', () => {
            render(
                <Wrapper>
                    <GameDaySummary
                        gameDay={defaultGameDay}
                        teamA={teamWith(0)}
                        teamB={teamWith(3)}
                    />
                </Wrapper>,
            );
            expect(screen.getByText('Team B won')).toBeInTheDocument();
        });

        it('shows "Draw" when both teams draw', () => {
            render(
                <Wrapper>
                    <GameDaySummary
                        gameDay={defaultGameDay}
                        teamA={teamWith(1)}
                        teamB={teamWith(1)}
                    />
                </Wrapper>,
            );
            expect(screen.getByText('Draw')).toBeInTheDocument();
        });

        it('shows "Result not set" when outcome is indeterminate', () => {
            render(
                <Wrapper>
                    <GameDaySummary
                        gameDay={defaultGameDay}
                        teamA={teamWith(3)}
                        teamB={teamWith(3)}
                    />
                </Wrapper>,
            );
            expect(screen.getByText('Result not set')).toBeInTheDocument();
        });
    });

    describe('comment display', () => {
        it('shows comment in parentheses when game exists', () => {
            render(
                <Wrapper>
                    <GameDaySummary
                        gameDay={defaultGameDay}
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
                        teamA={[]}
                        teamB={[]}
                    />
                </Wrapper>,
            );
            expect(screen.getByText(/^No game\s*$/)).toBeInTheDocument();
        });
    });

    describe('bibs display', () => {
        it('shows "Bibs: Team A" when bibs is A', () => {
            render(
                <Wrapper>
                    <GameDaySummary
                        gameDay={createMockGameDay({ bibs: 'A' })}
                        teamA={teamWith(3)}
                        teamB={teamWith(0)}
                    />
                </Wrapper>,
            );
            expect(screen.getByText('Bibs: Team A')).toBeInTheDocument();
        });

        it('shows "Bibs: Team B" when bibs is B', () => {
            render(
                <Wrapper>
                    <GameDaySummary
                        gameDay={createMockGameDay({ bibs: 'B' })}
                        teamA={teamWith(3)}
                        teamB={teamWith(0)}
                    />
                </Wrapper>,
            );
            expect(screen.getByText('Bibs: Team B')).toBeInTheDocument();
        });

        it('shows "Bibs: Not set" when bibs is null', () => {
            render(
                <Wrapper>
                    <GameDaySummary
                        gameDay={createMockGameDay({ bibs: null })}
                        teamA={teamWith(3)}
                        teamB={teamWith(0)}
                    />
                </Wrapper>,
            );
            expect(screen.getByText('Bibs: Not set')).toBeInTheDocument();
        });
    });
});
