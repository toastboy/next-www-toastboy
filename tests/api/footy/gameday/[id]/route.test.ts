import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

jest.mock('services/GameDay');

import { GET, generateStaticParams } from 'api/footy/gameday/[id]/route';
import gameDayService from 'services/GameDay';
import request from 'supertest';

suppressConsoleError();
const testURI = '/api/footy/gameday/1';
const mockApp = createMockApp(GET, { path: testURI, params: { id: "1000" } }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    it('should return null if there are no gamedays', async () => {
        (gameDayService.getAll as jest.Mock).mockResolvedValue(null);

        const result = await generateStaticParams();
        expect(result).toEqual(null);
    });

    it('should return gameday ids as params', async () => {
        const mockData = [
            {
                "id": 1,
                "year": 2002,
                "date": "2002-03-05T18:00:00.000Z",
                "game": true,
                "mailSent": "2003-02-24T13:05:00.000Z",
                "comment": null,
                "bibs": null,
                "picker_games_history": null
            },
            {
                "id": 2,
                "year": 2002,
                "date": "2002-03-12T18:00:00.000Z",
                "game": true,
                "mailSent": "2003-02-24T13:05:00.000Z",
                "comment": "Actual teams not recorded",
                "bibs": null,
                "picker_games_history": null
            },
            {
                "id": 3,
                "year": 2002,
                "date": "2002-03-19T18:00:00.000Z",
                "game": true,
                "mailSent": "2003-02-24T13:05:00.000Z",
                "comment": null,
                "bibs": null,
                "picker_games_history": null
            },
        ];
        (gameDayService.getAll as jest.Mock).mockResolvedValue(mockData);

        const result = await generateStaticParams();
        expect(result).toEqual([
            { params: { id: 1 } },
            { params: { id: 2 } },
            { params: { id: 3 } },
        ]);
    });

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