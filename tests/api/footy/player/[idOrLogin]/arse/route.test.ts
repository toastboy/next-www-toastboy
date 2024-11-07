import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';
import { setupPlayerMocks, testGenerateStaticParams } from 'tests/lib/api/player';

jest.mock('services/Arse');
jest.mock('services/Player');

import { GET } from 'api/footy/player/[idOrLogin]/arse/route';
import arseService from 'services/Arse';
import playerService from 'services/Player';
import request from 'supertest';

suppressConsoleError();
const testURI = '/api/footy/player/1/arse';
const mockApp = createMockApp(GET, { path: testURI, params: { idOrLogin: "1" } }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    setupPlayerMocks();
    testGenerateStaticParams('api/footy/player/[idOrLogin]/arse/route');

    it('should return JSON response for a valid player', async () => {
        const mockData = {
            in_goal: 1,
            running: 2,
            shooting: 3,
            passing: 4,
            ball_skill: 5,
            attacking: 6,
            defending: 7,
        };
        (arseService.getByPlayer as jest.Mock).mockResolvedValue(mockData);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockData);
    });

    it('should return 404 if the player does not exist', async () => {
        (playerService.getByIdOrLogin as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 404 if the arse record does not exist', async () => {
        (arseService.getByPlayer as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        (arseService.getByPlayer as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});
