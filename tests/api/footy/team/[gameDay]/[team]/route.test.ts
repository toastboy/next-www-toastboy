import { GET } from 'api/footy/team/[gameDay]/[team]/route';
import outcomeService from 'services/Outcome';
import request from 'supertest';
import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

suppressConsoleError();
const mockRoute = '/api/footy/team/1100/A';
const mockApp = createMockApp(GET, { path: mockRoute, params: Promise.resolve({ gameDay: "1100", team: "A" }) }, jsonResponseHandler);

jest.mock('services/Outcome');

describe('API tests using HTTP', () => {
    it('should return JSON response for a valid team', async () => {
        const mockData = [
            {
                "response": "Yes",
                "responseInterval": 25665,
                "points": 0,
                "team": "A",
                "comment": "",
                "pub": null,
                "paid": true,
                "goalie": false,
                "gameDayId": 1100,
                "playerId": 11,
            },
            {
                "response": "Yes",
                "responseInterval": 36593,
                "points": 0,
                "team": "A",
                "comment": "",
                "pub": null,
                "paid": true,
                "goalie": false,
                "gameDayId": 1100,
                "playerId": 30,
            },
            {
                "response": "Yes",
                "responseInterval": 116044,
                "points": 0,
                "team": "A",
                "comment": "",
                "pub": null,
                "paid": true,
                "goalie": false,
                "gameDayId": 1100,
                "playerId": 60,
            },
            {
                "response": "Yes",
                "responseInterval": 10062,
                "points": 0,
                "team": "A",
                "comment": "",
                "pub": null,
                "paid": true,
                "goalie": false,
                "gameDayId": 1100,
                "playerId": 134,
            },
            {
                "response": "Yes",
                "responseInterval": 111055,
                "points": 0,
                "team": "A",
                "comment": "",
                "pub": null,
                "paid": true,
                "goalie": false,
                "gameDayId": 1100,
                "playerId": 190,
            },
        ];
        (outcomeService.getByGameDay as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockData);
    });

    it('should return 404 if the team does not exist', async () => {
        (outcomeService.getByGameDay as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        (outcomeService.getByGameDay as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});