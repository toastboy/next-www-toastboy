import { createMockApp, jsonResponseHandler, suppressConsoleError, toWire } from '@/tests/lib/api/common';
import { setupPlayerMocks } from '@/tests/lib/api/player';

jest.mock('services/Player');
jest.mock('services/PlayerRecord');

import request from 'supertest';

import { GET } from '@/app/api/footy/player/[idOrLogin]/record/[year]/route';
import playerService from '@/services/Player';
import playerRecordService from '@/services/PlayerRecord';
import { defaultPlayerRecord } from '@/tests/mocks';

suppressConsoleError();
const testURI = '/api/footy/player/1/record/0';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ idOrLogin: "1", year: "0" }) }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    setupPlayerMocks();

    it('should return JSON response for a valid player', async () => {
        (playerRecordService.getForYearByPlayer as jest.Mock).mockResolvedValue(defaultPlayerRecord);
        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(toWire(defaultPlayerRecord));
    });

    it('should return 404 if the player does not exist', async () => {
        (playerService.getByIdOrLogin as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 404 if the arse record does not exist', async () => {
        (playerRecordService.getForYearByPlayer as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (playerRecordService.getForYearByPlayer as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
