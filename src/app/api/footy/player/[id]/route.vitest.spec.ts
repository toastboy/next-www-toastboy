import request from 'supertest';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { GET } from '@/app/api/footy/player/[id]/route';
import { getUserRole } from '@/lib/auth.server';
import playerService from '@/services/Player';
import { createMockApp, jsonResponseHandler, toWire } from '@/tests/lib/api/common';
import { defaultPlayer } from '@/tests/mocks/data/player';
vi.mock('services/Player');
vi.mock('lib/auth.server');

const testURI = '/api/footy/player/1';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ id: "1" }) }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    it('should return a mostly full JSON response for a valid player with a user logged in', async () => {
        (getUserRole as Mock).mockResolvedValue('user');

        const response = await request(mockApp).get(testURI);

        expect(getUserRole).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        const wirePlayer = toWire(defaultPlayer);
        if (!wirePlayer) throw new Error("toWire(defaultPlayer) returned null/undefined");
        expect(response.body).toEqual({
            ...wirePlayer,
            born: undefined,
            comment: undefined,
        });
    });

    it('should return a filtered JSON response for a valid player with no user logged in', async () => {
        (getUserRole as Mock).mockResolvedValue('none');

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        const wirePlayer = toWire(defaultPlayer);
        if (!wirePlayer) throw new Error("toWire(defaultPlayer) returned null/undefined");
        expect(response.body).toEqual({
            ...wirePlayer,
            born: undefined,
            comment: undefined,
        });
    });

    it('should return a filtered JSON response with no name values for a valid, anonymous player with no user logged in', async () => {
        (getUserRole as Mock).mockResolvedValue('none');
        (playerService.getById as Mock).mockResolvedValue({
            ...defaultPlayer,
            anonymous: true,
            born: undefined,
            comment: undefined,
        });

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        const wirePlayer = toWire(defaultPlayer);
        if (!wirePlayer) throw new Error("toWire(defaultPlayer) returned null/undefined");
        expect(response.body).toEqual({
            ...wirePlayer,
            anonymous: true,
            born: undefined,
            comment: undefined,
        });
    });

    it('should return 404 if the player does not exist', async () => {
        (playerService.getById as Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (playerService.getById as Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error: Something went wrong.');
    });
});
