import request from 'supertest';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { GET } from '@/app/api/footy/turnout/route';
import outcomeService from '@/services/Outcome';
import { createMockApp, jsonResponseHandler, toWire } from '@/tests/lib/api/common';
import { defaultOutcomeList } from '@/tests/mocks/data/outcome';
vi.mock('services/Outcome');

const testURI = '/api/footy/turnout';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({}) }, jsonResponseHandler);


describe('API tests using HTTP', () => {
    it('should return JSON response for a valid gameDay', async () => {
        (outcomeService.getTurnout as Mock).mockResolvedValue(defaultOutcomeList);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(toWire(defaultOutcomeList));
    });

    it('should return 404 if there is no data', async () => {
        (outcomeService.getTurnout as Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        (outcomeService.getTurnout as Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error: Something went wrong.');
    });
});
