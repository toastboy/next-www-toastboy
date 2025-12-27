import request from 'supertest';

import { GET } from '@/app/api/footy/tableyear/route';
import playerRecordService from '@/services/PlayerRecord';
import { createMockApp, jsonResponseHandler, toWire } from '@/tests/lib/api/common';
import { defaultGameYearsAllTime } from '@/tests/mocks/data/gameYears';
const mockRoute = '/api/footy/tableyear';
const mockApp = createMockApp(GET, { path: mockRoute, params: Promise.resolve({}) }, jsonResponseHandler);

jest.mock('services/PlayerRecord');

describe('API tests using HTTP', () => {
    it('should return JSON response', async () => {
        (playerRecordService.getAllYears as jest.Mock).mockResolvedValue(defaultGameYearsAllTime);

        const response = await request(mockApp).get(mockRoute);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(toWire(defaultGameYearsAllTime));
    });

    it('should return 404 if there are no tableyear', async () => {
        (playerRecordService.getAllYears as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (playerRecordService.getAllYears as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
