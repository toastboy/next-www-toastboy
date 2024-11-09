import { GET } from 'api/footy/team/[gameDay]/[team]/route';
import outcomeService from 'services/Outcome';
import request from 'supertest';
import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

suppressConsoleError();
const mockRoute = '/api/footy/team/1000/A';
const mockApp = createMockApp(GET, { path: mockRoute, params: { gameDay: "1000", team: "A" } }, jsonResponseHandler);

jest.mock('services/Outcome');

describe('API tests using HTTP', () => {
    it('should return JSON response for a valid team', async () => {
        (outcomeService.getByGameDay as jest.Mock).mockResolvedValue({ isoCode: 'NO', name: 'Test team' });

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual({ isoCode: 'NO', name: 'Test team' });
    });

    it('should return 404 if the team does not exist', async () => {
        (outcomeService.getByGameDay as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        (outcomeService.getByGameDay as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get(mockRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});