import request from 'supertest';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { GET } from '@/app/api/footy/gameday/[id]/route';
import gameDayService from '@/services/GameDay';
import { createMockApp, jsonResponseHandler, toWire } from '@/tests/lib/api/common';
import { defaultGameDay } from '@/tests/mocks/data/gameDay';
vi.mock('services/GameDay');

const testURI = '/api/footy/gameday/1';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ id: "1000" }) }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    it('should return JSON response for a valid gameday', async () => {
        (gameDayService.get as Mock).mockResolvedValue(defaultGameDay);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(toWire(defaultGameDay));
    });

    it('should return 404 if the gameday does not exist', async () => {
        (gameDayService.get as Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (gameDayService.get as Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error: Something went wrong.');
    });
});
