import { render, screen, waitFor } from '@testing-library/react';
import GameCalendar from 'components/GameCalendar/GameCalendar';
import { Wrapper } from "./lib/common";

describe('GameCalendar', () => {
    beforeEach(() => {
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            json: async () => ([
                {
                    "id": 100,
                    "year": 2004,
                    "date": "2004-01-27T18:00:00.000Z",
                    "game": true,
                    "mailSent": "2004-01-26T09:00:08.000Z",
                    "comment": null,
                    "bibs": null,
                    "picker_games_history": null,
                },
                {
                    "id": 101,
                    "year": 2004,
                    "date": "2004-02-03T18:00:00.000Z",
                    "game": false,
                    "mailSent": "2004-02-02T11:13:35.000Z",
                    "comment": "No game this week.",
                    "bibs": null,
                    "picker_games_history": null,
                },
                {
                    "id": 102,
                    "year": 2004,
                    "date": "2004-02-10T18:00:00.000Z",
                    "game": true,
                    "mailSent": "2004-02-09T09:00:10.000Z",
                    "comment": null,
                    "bibs": null,
                    "picker_games_history": null,
                },
                {
                    "id": 103,
                    "year": 2004,
                    "date": "2004-02-17T18:00:00.000Z",
                    "game": true,
                    "mailSent": "2004-02-16T09:00:11.000Z",
                    "comment": null,
                    "bibs": null,
                    "picker_games_history": null,
                },
                {
                    "id": 104,
                    "year": 2004,
                    "date": "2004-02-24T18:00:00.000Z",
                    "game": true,
                    "mailSent": "2004-02-23T09:00:11.000Z",
                    "comment": null,
                    "bibs": null,
                    "picker_games_history": null,
                },
                {
                    "id": 105,
                    "year": 2004,
                    "date": "2004-03-02T18:00:00.000Z",
                    "game": true,
                    "mailSent": "2004-03-01T09:01:54.000Z",
                    "comment": null,
                    "bibs": null,
                    "picker_games_history": null,
                },
                {
                    "id": 106,
                    "year": 2004,
                    "date": "2004-03-09T18:00:00.000Z",
                    "game": true,
                    "mailSent": "2004-03-08T09:00:10.000Z",
                    "comment": null,
                    "bibs": null,
                    "picker_games_history": null,
                },
                {
                    "id": 107,
                    "year": 2004,
                    "date": "2004-03-16T18:00:00.000Z",
                    "game": true,
                    "mailSent": "2004-03-15T09:00:11.000Z",
                    "comment": null,
                    "bibs": null,
                    "picker_games_history": null,
                },
                {
                    "id": 108,
                    "year": 2004,
                    "date": "2004-03-23T18:00:00.000Z",
                    "game": true,
                    "mailSent": "2004-03-22T09:00:18.000Z",
                    "comment": null,
                    "bibs": null,
                    "picker_games_history": null,
                },
                {
                    "id": 109,
                    "year": 2004,
                    "date": "2004-03-30T17:00:00.000Z",
                    "game": true,
                    "mailSent": "2004-03-29T09:00:33.000Z",
                    "comment": null,
                    "bibs": null,
                    "picker_games_history": null,
                },
            ]),
        } as Response);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders game day with link when game day exists and game is on', async () => {
        render(<Wrapper><GameCalendar date={new Date('2004-02-03')} /></Wrapper>);
        const gameDayLink = await waitFor(() => screen.getByRole('link', { name: '27' }));
        expect(gameDayLink).toBeInTheDocument();
        expect(gameDayLink).toHaveAttribute('href', '/footy/game/100');
        expect(gameDayLink.querySelector('div')).toHaveStyle({ '--indicator-color': 'var(--mantine-color-green-filled)' });
    });

    it('renders game day with link when game day exists and game is off', async () => {
        render(<Wrapper><GameCalendar date={new Date('2004-02-03')} /></Wrapper>);
        const gameDayLink = await waitFor(() => screen.getByRole('link', { name: '3' }));
        expect(gameDayLink).toBeInTheDocument();
        expect(gameDayLink).toHaveAttribute('href', '/footy/game/101');
        expect(gameDayLink.querySelector('div')).toHaveStyle({ '--indicator-color': 'var(--mantine-color-red-filled)' });
    });

    it('does not render game day with link when game day does not exist', async () => {
        render(<Wrapper><GameCalendar date={new Date('2004-02-03')} /></Wrapper>);
        // Wait for the first game day to render before checking
        await waitFor(() => screen.getByRole('link', { name: '27' }));
        const gameDayLink = await waitFor(() => screen.queryByRole('link', { name: '28' }));
        expect(gameDayLink).not.toBeInTheDocument();
    });
});
