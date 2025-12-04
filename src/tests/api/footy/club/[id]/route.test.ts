import clubService from 'services/Club';
import request from 'supertest';
import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

import { GET } from '@/app/api/footy/club/[id]/route';
import { defaultClub } from '@/tests/mocks/data/club';

suppressConsoleError();
const mockApp = createMockApp(GET, { path: '/api/footy/club/1', params: Promise.resolve({ id: '1' }) }, jsonResponseHandler);

jest.mock('services/Club');

describe('API tests using HTTP', () => {
    it('should return JSON response for a valid club', async () => {
        (clubService.get as jest.Mock).mockResolvedValue(defaultClub);

        const response = await request(mockApp).get('/api/footy/club/1');

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(defaultClub);
        expect(clubService.get).toHaveBeenCalledWith(1);
    });

    it('should return 404 if the club does not exist', async () => {
        (clubService.get as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get('/api/footy/club/1');

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (clubService.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get('/api/footy/club/1');

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
