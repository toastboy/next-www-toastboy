import { GET } from 'api/footy/turnout/[gameDayId]/route';
import outcomeService from 'services/Outcome';
import request from 'supertest';
import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

suppressConsoleError();
const mockRoute = '/api/footy/turnout/1000/';
const mockApp = createMockApp(GET, { path: mockRoute, params: Promise.resolve({ gameDayId: "1000" }) }, jsonResponseHandler);

jest.mock('services/Outcome');

describe('API tests using HTTP', () => {
    const mockData = [
        {
            "id": 1000,
            "year": 2021,
            "date": "2021-04-27T17:00:00.000Z",
            "game": false,
            "mailSent": null,
            "comment": "Remain indoors",
            "bibs": null,
            "pickerGamesHistory": 10,
            "yes": 0,
            "no": 0,
            "dunno": 0,
            "excused": 0,
            "flaked": 0,
            "injured": 0,
            "responses": 0,
            "players": 0,
            "cancelled": false,
        },
    ];

    it('should return JSON response for a valid gameDay', async () => {
        (outcomeService.getTurnout as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockData);
    });

    it('should return valid JSON even if there is no valid gameDayId param', async () => {
        const mockApp = createMockApp(GET, { path: mockRoute, params: Promise.resolve({}) }, jsonResponseHandler);
        (outcomeService.getTurnout as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockData);
    });

    it('should return 404 if the gameDay does not exist', async () => {
        (outcomeService.getTurnout as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        (outcomeService.getTurnout as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});