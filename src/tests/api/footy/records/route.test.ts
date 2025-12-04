import request from 'supertest';

import { GET } from '@/app/api/footy/records/route';
import playerRecordService from '@/services/PlayerRecord';
import { createMockApp, jsonResponseHandler, suppressConsoleError } from '@/tests/lib/api/common';

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
                played: 1,
                won: 1,
                drawn: 0,
                lost: 0,
                points: 3,
                averages: 3,
                stalwart: 100,
                pub: null,
                rankPoints: 1,
                rankAverages: null,
                rankAveragesUnqualified: 1,
                rankStalwart: 1,
                rankSpeedy: null,
                rankSpeedyUnqualified: null,
                rankPub: null,
                speedy: null,
                playerId: 1,
                gameDayId: 1,
            },
            {
                year: 0,
                responses: 2,
                played: 2,
                won: 1,
                drawn: 1,
                lost: 0,
                points: 4,
                averages: 2,
                stalwart: 100,
                pub: null,
                rankPoints: 1,
                rankAverages: null,
                rankAveragesUnqualified: 2,
                rankStalwart: 1,
                rankSpeedy: null,
                rankSpeedyUnqualified: null,
                rankPub: null,
                speedy: null,
                playerId: 1,
                gameDayId: 2,
            },
        ];
        (playerRecordService.getAll as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(mockRoute);

        if (response.status !== 200) console.log('Error response:', response.error);
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
        const errorMessage = 'Test Error';
        (playerRecordService.getAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
