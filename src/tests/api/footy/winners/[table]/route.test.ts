import { createMockApp, jsonResponseHandler, suppressConsoleError, toWire } from '@/tests/lib/api/common';

jest.mock('lib/authServer');

import request from 'supertest';

import { GET } from '@/app/api/footy/winners/[table]/route';
import { getUserRole } from '@/lib/authServer';
import playerRecordService from '@/services/PlayerRecord';
import { defaultPlayerRecordList } from '@/tests/mocks';

suppressConsoleError();
const mockRoute = '/api/footy/winners/points';
const mockApp = createMockApp(GET, { path: mockRoute, params: Promise.resolve({ table: "points" }) }, jsonResponseHandler);

jest.mock('services/PlayerRecord');

describe('API tests using HTTP', () => {
    it('should return JSON response for a valid gameDay', async () => {
        (getUserRole as jest.Mock).mockResolvedValue('none');
        (playerRecordService.getWinners as jest.Mock).mockResolvedValue(defaultPlayerRecordList);

        const response = await request(mockApp).get(mockRoute); // TODO: Some are mockRoute, some are testURI

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(toWire(defaultPlayerRecordList));
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
