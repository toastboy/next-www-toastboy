import { GET } from 'api/footy/winners/[table]/[year]/route';
import playerRecordService from 'services/PlayerRecord';
import request from 'supertest';
import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

suppressConsoleError();
const mockRoute = '/api/footy/winners/points/2011';
const mockApp = createMockApp(GET, { path: mockRoute, params: Promise.resolve({ table: "points", year: "2011" }) }, jsonResponseHandler);

jest.mock('services/PlayerRecord');

describe('API tests using HTTP', () => {
    const mockData = [
        {
            "year": 2011,
            "responses": 45,
            "P": 35,
            "W": 21,
            "D": 3,
            "L": 11,
            "points": 66,
            "averages": 1.885714285714286,
            "stalwart": 80,
            "pub": 1,
            "rankPoints": 1,
            "rankAverages": 4,
            "rankAveragesUnqualified": null,
            "rankStalwart": 3,
            "rankSpeedy": 10,
            "rankSpeedy_unqualified": null,
            "rankPub": 8,
            "speedy": 22977,
            "playerId": 62,
            "gameDayId": 511,
        },
    ];

    it('should return JSON response for a valid gameDay', async () => {
        (playerRecordService.getWinners as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockData);
    });

    it('should return JSON response in the absence of a valid year', async () => {
        const mockApp = createMockApp(GET, { path: mockRoute, params: Promise.resolve({ table: "points" }) }, jsonResponseHandler);

        (playerRecordService.getWinners as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(mockRoute);

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
        (playerRecordService.getWinners as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});