import request from 'supertest';

import { GET } from '@/app/api/footy/records/route';
import playerRecordService from '@/services/PlayerRecord';
import { createMockApp, jsonResponseHandler, toWire } from '@/tests/lib/api/common';
import { defaultPlayerRecordList } from '@/tests/mocks';
const testURI = '/api/footy/records';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({}) }, jsonResponseHandler);

jest.mock('services/PlayerRecord');

describe('API tests using HTTP', () => {
    it('should return JSON response', async () => {
        (playerRecordService.getAll as jest.Mock).mockResolvedValue(defaultPlayerRecordList);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(toWire(defaultPlayerRecordList));
    });

    it('should return 404 if there are no records', async () => {
        (playerRecordService.getAll as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (playerRecordService.getAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
