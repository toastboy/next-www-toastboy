import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

jest.mock('services/GameDay');

import { GET } from 'api/footy/gameday/[id]/route';
import gameDayService from 'services/GameDay';
import request from 'supertest';

suppressConsoleError();
const testURI = '/api/footy/gameday/1';
const mockApp = createMockApp(GET, { path: testURI, params: { id: "1000" } }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    it('should return JSON response for a valid gameday', async () => {
        const mockData = {
            "id": 1000,
            "year": 2021,
            "date": "2021-04-27T17:00:00.000Z",
            "game": false,
            "mailSent": null,
            "comment": "Remain indoors",
            "bibs": null,
            "picker_games_history": 10,
        };
        (gameDayService.get as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockData);
    });

    it('should return 404 if the gameday does not exist', async () => {
        (gameDayService.get as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        (gameDayService.get as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});