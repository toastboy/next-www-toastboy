import { createMockApp, jsonResponseHandler, suppressConsoleError } from '@tests/lib/api/common';
import request from 'supertest';

import { GET } from '@/app/api/footy/turnout/byyear/route';
import outcomeService from '@/services/Outcome';

suppressConsoleError();
const mockRoute = '/api/footy/turnout/byyear';
const mockApp = createMockApp(GET, { path: mockRoute, params: Promise.resolve({}) }, jsonResponseHandler);

jest.mock('services/Outcome');

describe('API tests using HTTP', () => {
    it('should return JSON response for a valid gameDay', async () => {
        const mockData = [
            {
                "year": 2002,
                "gameDays": 44,
                "gamesScheduled": 37,
                "gamesInitiated": 37,
                "gamesPlayed": 27,
                "gamesCancelled": 10,
                "responses": 290,
                "yesses": 290,
                "players": 290,
                "responsesPerGameInitiated": 7.8,
                "yessesPerGameInitiated": 7.8,
                "playersPerGamePlayed": 10.7,
            },
            {
                "year": 2003,
                "gameDays": 52,
                "gamesScheduled": 45,
                "gamesInitiated": 45,
                "gamesPlayed": 45,
                "gamesCancelled": 0,
                "responses": 627,
                "yesses": 464,
                "players": 459,
                "responsesPerGameInitiated": 13.9,
                "yessesPerGameInitiated": 10.3,
                "playersPerGamePlayed": 10.2,
            },
            {
                "year": 2004,
                "gameDays": 52,
                "gamesScheduled": 48,
                "gamesInitiated": 48,
                "gamesPlayed": 48,
                "gamesCancelled": 0,
                "responses": 625,
                "yesses": 524,
                "players": 517,
                "responsesPerGameInitiated": 13,
                "yessesPerGameInitiated": 10.9,
                "playersPerGamePlayed": 10.8,
            },
        ];
        (outcomeService.getTurnoutByYear as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(mockRoute);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockData);
    });

    it('should return 404 if there is no data', async () => {
        (outcomeService.getTurnoutByYear as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (outcomeService.getTurnoutByYear as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
