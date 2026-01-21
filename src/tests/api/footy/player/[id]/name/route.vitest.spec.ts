import request from 'supertest';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { GET } from '@/app/api/footy/player/[id]/name/route';
import playerService from '@/services/Player';
import { createMockApp, jsonResponseHandler } from '@/tests/lib/api/common';
import { setupPlayerMocks } from '@/tests/lib/api/player';
import { defaultPlayer } from '@/tests/mocks';
vi.mock('services/Player');

const testURI = '/api/footy/player/1/name';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ id: "1" }) }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    setupPlayerMocks();

    it('should return JSON response for a valid player', async () => {
        (playerService.getName as Mock).mockResolvedValue(defaultPlayer.name);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(defaultPlayer.name);
    });

    it('should return 404 if the player does not exist', async () => {
        (playerService.getById as Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 404 if the arse record does not exist', async () => {
        (playerService.getName as Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (playerService.getName as Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
