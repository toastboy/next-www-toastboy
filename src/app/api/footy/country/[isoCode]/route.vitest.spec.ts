import request from 'supertest';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { GET } from '@/app/api/footy/country/[isoCode]/route';
import countryService from '@/services/Country';
import { createMockApp, jsonResponseHandler } from '@/tests/lib/api/common';
import { defaultCountry } from '@/tests/mocks/data/country';
vi.mock('services/Country');

const mockApp = createMockApp(GET, { path: '/api/footy/country/NO', params: Promise.resolve({ isoCode: 'NO' }) }, jsonResponseHandler);


describe('API tests using HTTP', () => {
    it('should return JSON response for a valid country', async () => {
        (countryService.get as Mock).mockResolvedValue(defaultCountry);

        const response = await request(mockApp).get('/api/footy/country/NO');

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(defaultCountry);
    });

    it('should return 404 if the country does not exist', async () => {
        (countryService.get as Mock).mockResolvedValue(null);

        const response = await request(mockApp).get('/api/footy/country/NO');

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (countryService.get as Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get('/api/footy/country/NO');

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error: Something went wrong.');
    });
});
