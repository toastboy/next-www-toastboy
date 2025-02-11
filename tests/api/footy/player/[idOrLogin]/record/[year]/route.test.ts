import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';
import { setupPlayerMocks } from 'tests/lib/api/player';

jest.mock('services/Player');
jest.mock('services/PlayerRecord');

import { GET } from 'api/footy/player/[idOrLogin]/record/[year]/route';
import playerService from 'services/Player';
import playerRecordService from 'services/PlayerRecord';
import request from 'supertest';

suppressConsoleError();
const testURI = '/api/footy/player/1/record/0';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ idOrLogin: "1", year: "0" }) }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    setupPlayerMocks();

    it('should return JSON response for a valid player', async () => {
        const mockData = {
            year: 0,
            responses: 72,
            P: 34,
            W: 11,
            D: 1,
            L: 22,
            points: 34,
            averages: 1,
            stalwart: 4,
            pub: null,
            rankPoints: 66,
            rankAverages: 86,
            rankAveragesUnqualified: null,
            rankStalwart: 48,
            rankSpeedy: 92,
            rankSpeedy_unqualified: null,
            rankPub: null,
            speedy: 50229,
            playerId: 1,
            gameDayId: 1182,
            name: "Derek Turnipson",
        };
        (playerRecordService.getForYearByPlayer as jest.Mock).mockResolvedValue(mockData);

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
        (playerRecordService.getForYearByPlayer as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        (playerRecordService.getForYearByPlayer as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});
