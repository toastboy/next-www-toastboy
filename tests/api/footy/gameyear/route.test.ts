import { GET } from 'api/footy/gameyear/route';
import gamedayService from 'services/GameDay';
import request from 'supertest';
import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

suppressConsoleError();
const mockRoute = '/api/footy/gameyear';
const mockApp = createMockApp(GET, { path: mockRoute, params: {} }, jsonResponseHandler);

jest.mock('services/GameDay');

describe('API tests using HTTP', () => {
    it('should return JSON response for a valid gameyear', async () => {
        const mockData = [2000, 2001, 2002];
        (gamedayService.getAllYears as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockData);
    });

    it('should return 404 if the gameyear does not exist', async () => {
        (gamedayService.getAllYears as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        (gamedayService.getAllYears as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});