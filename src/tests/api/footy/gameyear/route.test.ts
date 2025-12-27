import request from 'supertest';

import { GET } from '@/app/api/footy/gameyear/route';
import gamedayService from '@/services/GameDay';
import { createMockApp, jsonResponseHandler } from '@/tests/lib/api/common';
import { defaultGameYears } from '@/tests/mocks';
const mockRoute = '/api/footy/gameyear';
const mockApp = createMockApp(GET, { path: mockRoute, params: Promise.resolve({}) }, jsonResponseHandler);

jest.mock('services/GameDay');

describe('API tests using HTTP', () => {
    it('should return JSON response for a valid gameyear', async () => {
        (gamedayService.getAllYears as jest.Mock).mockResolvedValue(defaultGameYears);

        const response = await request(mockApp).get(mockRoute);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(defaultGameYears);
    });

    it('should return 404 if the gameyear does not exist', async () => {
        (gamedayService.getAllYears as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (gamedayService.getAllYears as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
