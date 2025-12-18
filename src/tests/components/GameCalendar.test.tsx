import { render, screen, within } from '@testing-library/react';
import { GameDaySchema } from 'prisma/zod/schemas/models/GameDay.schema';
import { z } from 'zod';

import { GameCalendar } from '@/components/GameCalendar/GameCalendar';
import { loadJsonFixture } from '@/tests/shared/fixtures';

import { Wrapper } from "./lib/common";

const GameDayResponseSchema = GameDaySchema.extend({
    date: z.coerce.date(),
    mailSent: z.coerce.date().nullish(),
});

const gameCalendarFixture = loadJsonFixture<unknown>('components/data/GameCalendar.json');

describe('GameCalendar', () => {
    beforeEach(() => {
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            json: () => Promise.resolve(
                GameDayResponseSchema.array().parse(gameCalendarFixture),
            ),
        } as Response);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders game day with link when game day exists and game is on', async () => {
        render(<Wrapper><GameCalendar date={new Date('2004-02-03')} /></Wrapper>);
        const gameDayLink = await screen.findByRole('link', { name: '27' });
        expect(gameDayLink).toBeInTheDocument();
        expect(gameDayLink).toHaveAttribute('href', '/footy/game/100');
        expect(within(gameDayLink).getByTestId('game-day-indicator-true')).toBeInTheDocument();
    });

    it('renders game day with link when game day exists and game is off', async () => {
        render(<Wrapper><GameCalendar date={new Date('2004-02-03')} /></Wrapper>);
        const gameDayLink = await screen.findByRole('link', { name: '3' });
        expect(gameDayLink).toBeInTheDocument();
        expect(gameDayLink).toHaveAttribute('href', '/footy/game/101');
        expect(within(gameDayLink).getByTestId('game-day-indicator-false')).toBeInTheDocument();
    });

    it('does not render game day with link when game day does not exist', async () => {
        render(<Wrapper><GameCalendar date={new Date('2004-02-03')} /></Wrapper>);
        // Wait for the first game day to render before checking
        await screen.findByRole('link', { name: '27' });
        const gameDayLink = screen.queryByRole('link', { name: '28' });
        expect(gameDayLink).not.toBeInTheDocument();
    });
});
