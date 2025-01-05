import { generateStaticParams, GET } from 'api/footy/club/[id]/route';
import clubService from 'services/Club';
import request from 'supertest';
import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

suppressConsoleError();
const mockApp = createMockApp(GET, { path: '/api/footy/club/1', params: Promise.resolve({ id: '1' }) }, jsonResponseHandler);

jest.mock('services/Club');

describe('API tests using HTTP', () => {
    it('should return null if there are no clubs', async () => {
        (clubService.getAll as jest.Mock).mockResolvedValue(null);

        const result = await generateStaticParams();
        expect(result).toEqual(null);
    });

    it('should return club ids as params', async () => {
        const mockData = [{ id: '1' }, { id: '2' }];
        (clubService.getAll as jest.Mock).mockResolvedValue(mockData);

        const result = await generateStaticParams();
        expect(result).toEqual(mockData);
    });

    it('should return JSON response for a valid club', async () => {
        const mockData = { id: 1, name: 'Test Club' };
        (clubService.get as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get('/api/footy/club/1');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockData);
        expect(clubService.get).toHaveBeenCalledWith(1);
    });

    it('should return 404 if the club does not exist', async () => {
        (clubService.get as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get('/api/footy/club/1');

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        (clubService.get as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get('/api/footy/club/1');

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});