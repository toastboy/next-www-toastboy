import request from 'supertest';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { GET } from '@/app/api/footy/turnout/[gameDayId]/route';
import outcomeService from '@/services/Outcome';
import { createMockApp, jsonResponseHandler, toWire } from '@/tests/lib/api/common';
import { defaultOutcome } from '@/tests/mocks/data/outcome';
vi.mock('services/Outcome');

const testURI = '/api/footy/turnout/1000/';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ gameDayId: "1000" }) }, jsonResponseHandler);


describe('API tests using HTTP', () => {
    it('should return JSON response for a valid gameDay', async () => {
        (outcomeService.getTurnout as Mock).mockResolvedValue(defaultOutcome);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(toWire(defaultOutcome));
    });

    it('should return valid JSON even if there is no valid gameDayId param', async () => {
        const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({}) }, jsonResponseHandler);
        (outcomeService.getTurnout as Mock).mockResolvedValue(defaultOutcome);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(toWire(defaultOutcome));
    });

    it('should return 404 if the gameDay does not exist', async () => {
        (outcomeService.getTurnout as Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (outcomeService.getTurnout as Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
