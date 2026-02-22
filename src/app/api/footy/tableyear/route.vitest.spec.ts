import request from 'supertest';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { GET } from '@/app/api/footy/tableyear/route';
import playerRecordService from '@/services/PlayerRecord';
import { createMockApp, jsonResponseHandler, toWire } from '@/tests/lib/api/common';
import { defaultGameYearsAllTime } from '@/tests/mocks/data/gameYears';
vi.mock('services/PlayerRecord');

const testURI = '/api/footy/tableyear';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({}) }, jsonResponseHandler);


describe('API tests using HTTP', () => {
    it('should return JSON response', async () => {
        (playerRecordService.getAllYears as Mock).mockResolvedValue(defaultGameYearsAllTime);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(toWire(defaultGameYearsAllTime));
        expect(playerRecordService.getAllYears).toHaveBeenCalledWith(false);
    });

    it('should return 404 if there are no tableyear', async () => {
        (playerRecordService.getAllYears as Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (playerRecordService.getAllYears as Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
