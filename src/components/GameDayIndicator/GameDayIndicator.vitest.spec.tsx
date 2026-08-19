import { render, screen } from '@testing-library/react';

import { GameDayIndicator } from '@/components/GameDayIndicator/GameDayIndicator';
import { Wrapper } from '@/tests/components/lib/common';
import { createMockGameDay, defaultGameDay } from '@/tests/mocks/data/gameDay';

// happy-dom expands borderBottom shorthands into sub-properties and spreads
// CSS variable values across border-bottom-width/style/color. Assertions
// therefore target the individual sub-properties and CSS variable names.

const futureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

const getIndicatorStyle = (id: number) =>
    screen.getByTestId(`gameday-indicator-${id}`).getAttribute('style') ?? '';

describe('GameDayIndicator', () => {
    it('renders the indicator element with the correct testid', () => {
        render(
            <Wrapper>
                <GameDayIndicator gameDay={defaultGameDay} />
            </Wrapper>,
        );
        expect(screen.getByTestId('gameday-indicator-1')).toBeInTheDocument();
    });

    describe('past game days (date before today)', () => {
        it('suppresses the border (border-bottom-style: none)', () => {
            render(
                <Wrapper>
                    <GameDayIndicator gameDay={defaultGameDay} />
                </Wrapper>,
            );
            expect(getIndicatorStyle(defaultGameDay.id)).toContain(
                'border-bottom-style: none',
            );
        });

        it('applies green background when status is Scheduled', () => {
            render(
                <Wrapper>
                    <GameDayIndicator
                        gameDay={createMockGameDay({ status: 'Scheduled' })}
                    />
                </Wrapper>,
            );
            expect(getIndicatorStyle(defaultGameDay.id)).toContain(
                'var(--mantine-color-green-6)',
            );
        });

        it('applies dark background when status is NoGame and mailSent is null', () => {
            render(
                <Wrapper>
                    <GameDayIndicator
                        gameDay={createMockGameDay({
                            status: 'NoGame',
                            mailSent: null,
                        })}
                    />
                </Wrapper>,
            );
            expect(getIndicatorStyle(defaultGameDay.id)).toContain(
                'var(--mantine-color-dark-6)',
            );
        });

        it('applies red background when status is NoGame and mailSent is set', () => {
            render(
                <Wrapper>
                    <GameDayIndicator
                        gameDay={createMockGameDay({
                            status: 'NoGame',
                            mailSent: new Date(),
                        })}
                    />
                </Wrapper>,
            );
            expect(getIndicatorStyle(defaultGameDay.id)).toContain(
                'var(--mantine-color-red-6)',
            );
        });
    });

    describe('future game days (date after today)', () => {
        it('uses a transparent background', () => {
            render(
                <Wrapper>
                    <GameDayIndicator
                        gameDay={createMockGameDay({ date: futureDate })}
                    />
                </Wrapper>,
            );
            expect(getIndicatorStyle(defaultGameDay.id)).toContain(
                'background: transparent',
            );
        });

        it('applies green border when status is Scheduled', () => {
            render(
                <Wrapper>
                    <GameDayIndicator
                        gameDay={createMockGameDay({
                            date: futureDate,
                            status: 'Scheduled',
                        })}
                    />
                </Wrapper>,
            );
            expect(getIndicatorStyle(defaultGameDay.id)).toContain(
                'var(--mantine-color-green-6)',
            );
        });

        it('applies dark border when status is NoGame and mailSent is null', () => {
            render(
                <Wrapper>
                    <GameDayIndicator
                        gameDay={createMockGameDay({
                            date: futureDate,
                            status: 'NoGame',
                            mailSent: null,
                        })}
                    />
                </Wrapper>,
            );
            expect(getIndicatorStyle(defaultGameDay.id)).toContain(
                'var(--mantine-color-dark-6)',
            );
        });

        it('applies red border when status is NoGame and mailSent is set', () => {
            render(
                <Wrapper>
                    <GameDayIndicator
                        gameDay={createMockGameDay({
                            date: futureDate,
                            status: 'NoGame',
                            mailSent: new Date(),
                        })}
                    />
                </Wrapper>,
            );
            expect(getIndicatorStyle(defaultGameDay.id)).toContain(
                'var(--mantine-color-red-6)',
            );
        });
    });
});
