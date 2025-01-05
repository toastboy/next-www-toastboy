import { generateStaticParams, GET } from 'api/footy/country/[isoCode]/route';
import countryService from 'services/Country';
import request from 'supertest';
import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

suppressConsoleError();
const mockApp = createMockApp(GET, { path: '/api/footy/country/NO', params: Promise.resolve({ isoCode: 'NO' }) }, jsonResponseHandler);

jest.mock('services/Country');

describe('API tests using HTTP', () => {
    it('should return null if there are no countries', async () => {
        (countryService.getAll as jest.Mock).mockResolvedValue(null);

        const result = await generateStaticParams();
        expect(result).toEqual(null);
    });

    it('should return country ids as params', async () => {
        const mockData = [{ isoCode: 'NO' }, { isoCode: 'AY' }];
        (countryService.getAll as jest.Mock).mockResolvedValue(mockData);

        const result = await generateStaticParams();
        expect(result).toEqual(mockData);
    });

    it('should return JSON response for a valid country', async () => {
        (countryService.get as jest.Mock).mockResolvedValue({ isoCode: 'NO', name: 'Test country' });

        const response = await request(mockApp).get('/api/footy/country/NO');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual({ isoCode: 'NO', name: 'Test country' });
    });

    it('should return 404 if the country does not exist', async () => {
        (countryService.get as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get('/api/footy/country/NO');

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        (countryService.get as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get('/api/footy/country/NO');

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});