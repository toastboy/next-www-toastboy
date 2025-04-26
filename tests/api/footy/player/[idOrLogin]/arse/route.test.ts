jest.mock('services/Arse');
jest.mock('services/Player');
jest.mock('lib/authServer');

import { GET } from 'api/footy/player/[idOrLogin]/arse/route';
import { getUserRole } from 'lib/authServer';
import arseService from 'services/Arse';
import playerService from 'services/Player';
import request from 'supertest';
import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';
import { setupPlayerMocks } from 'tests/lib/api/player';

suppressConsoleError();
const testURI = '/api/footy/player/1/arse';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ idOrLogin: "1" }) }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    setupPlayerMocks();

    it('should return JSON response for a valid player', async () => {
        const mockData = {
            inGoal: 1,
            running: 2,
            shooting: 3,
            passing: 4,
            ballSkill: 5,
            attacking: 6,
            defending: 7,
        };
        (arseService.getByPlayer as jest.Mock).mockResolvedValue(mockData);
        (getUserRole as jest.Mock).mockResolvedValue('admin');

        const response = await request(mockApp).get(testURI);

        expect(getUserRole).toHaveBeenCalled();
        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockData);
    });

    it('should refuse to return any arse when there is no admin logged in', async () => {
        const mockData = {
            inGoal: 1,
            running: 2,
            shooting: 3,
            passing: 4,
            ballSkill: 5,
            attacking: 6,
            defending: 7,
        };
        (arseService.getByPlayer as jest.Mock).mockResolvedValue(mockData);
        (getUserRole as jest.Mock).mockResolvedValue('user');

        const response = await request(mockApp).get(testURI);

        expect(getUserRole).toHaveBeenCalled();
        expect(response.status).toBe(403);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual({ message: 'Forbidden' });
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
        const errorMessage = 'Test Error';
        (arseService.getByPlayer as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
