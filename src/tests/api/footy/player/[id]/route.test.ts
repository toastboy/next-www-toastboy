import { createMockApp, jsonResponseHandler, suppressConsoleError, toWire } from '@/tests/lib/api/common';
import { mockPlayer, setupPlayerMocks } from '@/tests/lib/api/player';

jest.mock('services/Player');
jest.mock('lib/authServer');

import request from 'supertest';

import { GET } from '@/app/api/footy/player/[id]/route';
import { getUserRole } from '@/lib/authServer';
import playerService from '@/services/Player';

suppressConsoleError();
const testURI = '/api/footy/player/1';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ id: "1" }) }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    setupPlayerMocks();

    it('should return a mostly full JSON response for a valid player with a user logged in', async () => {
        (getUserRole as jest.Mock).mockResolvedValue('user');

        const response = await request(mockApp).get(testURI);

        expect(getUserRole).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        const wirePlayer = toWire(mockPlayer);
        if (!wirePlayer) throw new Error("toWire(mockPlayer) returned null/undefined");
        expect(response.body).toEqual({
            ...wirePlayer,
            born: undefined,
            comment: undefined,
        });
    });

    it('should return a filtered JSON response for a valid player with no user logged in', async () => {
        (getUserRole as jest.Mock).mockResolvedValue('none');

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        const wirePlayer = toWire(mockPlayer);
        if (!wirePlayer) throw new Error("toWire(mockPlayer) returned null/undefined");
        expect(response.body).toEqual({
            ...wirePlayer,
            email: undefined,
            born: undefined,
            comment: undefined,
        });
    });

    it('should return a filtered JSON response with no name values for a valid, anonymous player with no user logged in', async () => {
        (getUserRole as jest.Mock).mockResolvedValue('none');
        (playerService.getById as jest.Mock).mockResolvedValue({
            ...mockPlayer,
            anonymous: true,
            email: undefined,
            born: undefined,
            comment: undefined,
        });

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        const wirePlayer = toWire(mockPlayer);
        if (!wirePlayer) throw new Error("toWire(mockPlayer) returned null/undefined");
        expect(response.body).toEqual({
            ...wirePlayer,
            anonymous: true,
            email: undefined,
            born: undefined,
            comment: undefined,
        });
    });

    it('should return 404 if the player does not exist', async () => {
        (playerService.getById as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (playerService.getById as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
