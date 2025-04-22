import { createMockApp, jsonResponseHandler, suppressConsoleError } from 'tests/lib/api/common';
import { mockPlayer, setupPlayerMocks } from 'tests/lib/api/player';

jest.mock('services/Player');

import { GET } from 'api/footy/player/[idOrLogin]/route';
import { getUserRole } from 'lib/api';
import playerService from 'services/Player';
import request from 'supertest';

jest.mock('lib/api', () => ({
    ...jest.requireActual('lib/api'),
    getUserRole: jest.fn(),
}));

suppressConsoleError();
const testURI = '/api/footy/player/1';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ idOrLogin: "1" }) }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    setupPlayerMocks();

    it('should return a full JSON response for a valid player with a user logged in', async () => {
        (getUserRole as jest.Mock).mockResolvedValue('user');

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(mockPlayer);
    });

    it('should return a filtered JSON response for a valid player with no user logged in', async () => {
        (getUserRole as jest.Mock).mockResolvedValue('none');

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(
            { ...mockPlayer, login: undefined, email: undefined, born: undefined, comment: undefined },
        );
    });

    it('should return a filtered JSON response with no name values for a valid, anonymous player with no user logged in', async () => {
        (getUserRole as jest.Mock).mockResolvedValue('none');
        (playerService.getByIdOrLogin as jest.Mock).mockResolvedValue({
            ...mockPlayer,
            anonymous: true,
        });

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(
            { ...mockPlayer, anonymous: true, login: undefined, email: undefined, born: undefined, firstName: undefined, lastName: undefined, comment: undefined },
        );
    });

    it('should return 404 if the player does not exist', async () => {
        (playerService.getByIdOrLogin as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (playerService.getByIdOrLogin as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
