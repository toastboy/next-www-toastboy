import request from 'supertest';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { GET } from '@/app/api/footy/player/[id]/countries/route';
import countrySupporterService from '@/services/CountrySupporter';
import playerService from '@/services/Player';
import { createMockApp, jsonResponseHandler } from '@/tests/lib/api/common';
import { defaultCountrySupporter } from '@/tests/mocks/data/countrySupporter';
vi.mock('services/CountrySupporter');
vi.mock('services/Player');

const testURI = '/api/footy/player/1/countries';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ id: "1" }) }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    it('should return JSON response for a valid player', async () => {
        (countrySupporterService.getByPlayer as Mock).mockResolvedValue(defaultCountrySupporter);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(defaultCountrySupporter);
    });

    it('should return 404 if the player does not exist', async () => {
        (playerService.getById as Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 404 if the arse record does not exist', async () => {
        (countrySupporterService.getByPlayer as Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (countrySupporterService.getByPlayer as Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
