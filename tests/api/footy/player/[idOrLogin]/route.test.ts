import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';
import { mockPlayer, setupPlayerMocks } from 'tests/lib/api/player';

jest.mock('services/Player');

import { GET } from 'api/footy/player/[idOrLogin]/route';
import playerService from 'services/Player';
import request from 'supertest';

suppressConsoleError();
const testURI = '/api/footy/player/1';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ idOrLogin: "1" }) }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    setupPlayerMocks();

    it('should return JSON response for a valid player', async () => {
        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockPlayer);
    });

    it('should return 404 if the player does not exist', async () => {
        (playerService.getByIdOrLogin as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 404 if the arse record does not exist', async () => {
        (playerService.getByIdOrLogin as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        (playerService.getByIdOrLogin as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});
