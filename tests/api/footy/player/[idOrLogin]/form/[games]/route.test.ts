import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';
import { setupPlayerMocks } from 'tests/lib/api/player';

jest.mock('services/Player');

import { GET } from 'api/footy/player/[idOrLogin]/form/[games]/route';
import playerService from 'services/Player';
import request from 'supertest';

suppressConsoleError();
const testURI = '/api/footy/player/1/form/3';
const mockApp = createMockApp(GET, { path: testURI, params: { idOrLogin: "1", games: "3" } }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    setupPlayerMocks();

    it('should return JSON response for a valid player', async () => {
        const mockData = [
            {
                response: 'Yes',
                responseInterval: 89724,
                points: 0,
                team: 'B',
                comment: "How do",
                pub: null,
                paid: null,
                goalie: false,
                gameDayId: 125,
                playerId: 1,
            },
            {
                response: 'Yes',
                responseInterval: 366022,
                points: 3,
                team: 'A',
                comment: "",
                pub: null,
                paid: null,
                goalie: false,
                gameDayId: 118,
                playerId: 1,
            },
            {
                response: 'Yes',
                responseInterval: 111346,
                points: 0,
                team: 'B',
                comment: "",
                pub: null,
                paid: null,
                goalie: false,
                gameDayId: 117,
                playerId: 1,
            },
        ];
        (playerService.getForm as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockData);
    });

    it('should return 404 if the player does not exist', async () => {
        (playerService.getByIdOrLogin as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 404 if the arse record does not exist', async () => {
        (playerService.getForm as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        (playerService.getForm as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});
