import { GET } from 'api/footy/records/route';
import playerRecordService from 'services/PlayerRecord';
import request from 'supertest';
import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

suppressConsoleError();
const mockRoute = '/api/footy/records';
const mockApp = createMockApp(GET, { path: mockRoute, params: Promise.resolve({}) }, jsonResponseHandler);

jest.mock('services/PlayerRecord');

describe('API tests using HTTP', () => {
    it('should return JSON response', async () => {
        const mockData = [
            {
                year: 0,
                responses: 1,
                P: 1,
                W: 1,
                D: 0,
                L: 0,
                points: 3,
                averages: 3,
                stalwart: 100,
                pub: null,
                rankPoints: 1,
                rankAverages: null,
                rankAveragesUnqualified: 1,
                rankStalwart: 1,
                rankSpeedy: null,
                rankSpeedy_unqualified: null,
                rankPub: null,
                speedy: null,
                playerId: 1,
                gameDayId: 1,
            },
            {
                year: 0,
                responses: 2,
                P: 2,
                W: 1,
                D: 1,
                L: 0,
                points: 4,
                averages: 2,
                stalwart: 100,
                pub: null,
                rankPoints: 1,
                rankAverages: null,
                rankAveragesUnqualified: 2,
                rankStalwart: 1,
                rankSpeedy: null,
                rankSpeedy_unqualified: null,
                rankPub: null,
                speedy: null,
                playerId: 1,
                gameDayId: 2,
            },
        ];
        (playerRecordService.getAll as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockData);
    });

    it('should return 404 if there are no records', async () => {
        (playerRecordService.getAll as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        (playerRecordService.getAll as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});