import { GET } from 'api/footy/turnout/route';
import outcomeService from 'services/Outcome';
import request from 'supertest';
import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

suppressConsoleError();
const mockRoute = '/api/footy/turnout';
const mockApp = createMockApp(GET, { path: mockRoute, params: Promise.resolve({}) }, jsonResponseHandler);

jest.mock('services/Outcome');

describe('API tests using HTTP', () => {
    it('should return JSON response for a valid gameDay', async () => {
        const mockData = [
            {
                "id": 1,
                "year": 2002,
                "date": "2002-03-05T18:00:00.000Z",
                "game": true,
                "mailSent": "2003-02-24T13:05:00.000Z",
                "comment": null,
                "bibs": null,
                "pickerGamesHistory": null,
                "yes": 11,
                "no": 0,
                "dunno": 0,
                "excused": 0,
                "flaked": 0,
                "injured": 0,
                "responses": 11,
                "players": 11,
                "cancelled": false,
            },
            {
                "id": 2,
                "year": 2002,
                "date": "2002-03-12T18:00:00.000Z",
                "game": true,
                "mailSent": "2003-02-24T13:05:00.000Z",
                "comment": "Actual teams not recorded",
                "bibs": null,
                "pickerGamesHistory": null,
                "yes": 11,
                "no": 0,
                "dunno": 0,
                "excused": 0,
                "flaked": 0,
                "injured": 0,
                "responses": 11,
                "players": 11,
                "cancelled": false,
            },
            {
                "id": 3,
                "year": 2002,
                "date": "2002-03-19T18:00:00.000Z",
                "game": true,
                "mailSent": "2003-02-24T13:05:00.000Z",
                "comment": null,
                "bibs": null,
                "pickerGamesHistory": null,
                "yes": 12,
                "no": 0,
                "dunno": 0,
                "excused": 0,
                "flaked": 0,
                "injured": 0,
                "responses": 12,
                "players": 12,
                "cancelled": false,
            },
        ];
        (outcomeService.getTurnout as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(mockRoute);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockData);
    });

    it('should return 404 if there is no data', async () => {
        (outcomeService.getTurnout as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        (outcomeService.getTurnout as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error: Test Error');
    });
});
