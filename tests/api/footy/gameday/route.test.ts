import { GET } from 'api/footy/gameday/route';
import gamedayService from 'services/GameDay';
import request from 'supertest';
import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

suppressConsoleError();
const mockURI = '/api/footy/gameday';
const mockApp = createMockApp(GET, { path: mockURI, params: { id: '1' } }, jsonResponseHandler);

jest.mock('services/GameDay');

describe('API tests using HTTP', () => {
    it('should return JSON response for a valid gameday', async () => {
        const mockData = [{ id: '1', name: 'Test gameday 1' }, { id: '2', name: 'Test gameday 2' }];
        (gamedayService.getAll as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(mockURI);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockData);
    });

    it('should return 404 if the gameday does not exist', async () => {
        (gamedayService.getAll as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(mockURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        (gamedayService.getAll as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get(mockURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});