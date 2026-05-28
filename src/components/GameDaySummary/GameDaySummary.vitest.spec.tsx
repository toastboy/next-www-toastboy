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
});
