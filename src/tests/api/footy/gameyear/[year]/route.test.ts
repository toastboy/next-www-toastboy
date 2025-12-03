import { createMockApp, jsonResponseHandler, suppressConsoleError } from '@tests/lib/api/common';

jest.mock('services/GameDay');

import request from 'supertest';

import { GET } from '@/app/api/footy/gameyear/[year]/route';
import gameDayService from '@/services/GameDay';

suppressConsoleError();
const testURI = '/api/footy/gameyear/2010';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ year: "2010" }) }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    it('should return JSON response for year zero', async () => {
        const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ year: "0" }) }, jsonResponseHandler);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toBe(true);
    });

    it('should return JSON response for a valid gameyear', async () => {
        (gameDayService.getYear as jest.Mock).mockResolvedValue(2010);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toBe(true);
    });

    it('should return 404 if the gameyear does not exist', async () => {
        (gameDayService.getYear as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (gameDayService.getYear as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
