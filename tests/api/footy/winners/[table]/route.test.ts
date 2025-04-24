import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

jest.mock('lib/authServer');

import { GET } from 'api/footy/winners/[table]/route';
import { getUserRole } from 'lib/authServer';
import playerRecordService from 'services/PlayerRecord';
import request from 'supertest';

suppressConsoleError();
const mockRoute = '/api/footy/winners/points';
const mockApp = createMockApp(GET, { path: mockRoute, params: Promise.resolve({ table: "points" }) }, jsonResponseHandler);

jest.mock('services/PlayerRecord');

describe('API tests using HTTP', () => {
    const mockData = [
        {
            "year": 2023,
            "responses": 48,
            "P": 39,
            "W": 19,
            "D": 1,
            "L": 19,
            "points": 58,
            "averages": 1.487179487179487,
            "stalwart": 98,
            "pub": 1,
            "rankPoints": 1,
            "rankAverages": 8,
            "rankAveragesUnqualified": null,
            "rankStalwart": 1,
            "rankSpeedy": 3,
            "rankSpeedyUnqualified": null,
            "rankPub": 1,
            "speedy": 28607,
            "playerId": 12,
            "gameDayId": 1137,
        },
        {
            "year": 2022,
            "responses": 11,
            "P": 9,
            "W": 4,
            "D": 2,
            "L": 3,
            "points": 14,
            "averages": 1.555555555555556,
            "stalwart": 100,
            "pub": null,
            "rankPoints": 1,
            "rankAverages": null,
            "rankAveragesUnqualified": 9,
            "rankStalwart": 1,
            "rankSpeedy": 4,
            "rankSpeedyUnqualified": null,
            "rankPub": null,
            "speedy": 30189,
            "playerId": 191,
            "gameDayId": 1085,
        },
        {
            "year": 2021,
            "responses": 10,
            "P": 6,
            "W": 6,
            "D": 0,
            "L": 0,
            "points": 18,
            "averages": 3,
            "stalwart": 75,
            "pub": null,
            "rankPoints": 1,
            "rankAverages": null,
            "rankAveragesUnqualified": 1,
            "rankStalwart": 5,
            "rankSpeedy": 5,
            "rankSpeedyUnqualified": null,
            "rankPub": null,
            "speedy": 47148,
            "playerId": 30,
            "gameDayId": 1028,
        },
    ];

    it('should return JSON response for a valid gameDay', async () => {
        (getUserRole as jest.Mock).mockResolvedValue('none');
        (playerRecordService.getWinners as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(mockRoute); // TODO: Some are mockRoute, some are testURI

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockData);
    });

    it('should return 404 if there is no data', async () => {
        (playerRecordService.getWinners as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (playerRecordService.getWinners as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
