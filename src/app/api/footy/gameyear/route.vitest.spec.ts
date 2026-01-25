import request from 'supertest';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { GET } from '@/app/api/footy/gameyear/route';
import gamedayService from '@/services/GameDay';
import { createMockApp, jsonResponseHandler } from '@/tests/lib/api/common';
import { defaultGameYears } from '@/tests/mocks/data/gameYears';
vi.mock('services/GameDay');

const testURI = '/api/footy/gameyear';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({}) }, jsonResponseHandler);


describe('API tests using HTTP', () => {
    it('should return JSON response for a valid gameyear', async () => {
        (gamedayService.getAllYears as Mock).mockResolvedValue(defaultGameYears);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(defaultGameYears);
    });

    it('should return 404 if the gameyear does not exist', async () => {
        (gamedayService.getAllYears as Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (gamedayService.getAllYears as Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
