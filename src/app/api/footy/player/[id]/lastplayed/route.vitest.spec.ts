import request from 'supertest';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { GET } from '@/app/api/footy/player/[id]/lastplayed/route';
import { getUserRole } from '@/lib/auth.server';
import playerService from '@/services/Player';
import { createMockApp, jsonResponseHandler } from '@/tests/lib/api/common';
import { defaultOutcome } from '@/tests/mocks/data/outcome';
vi.mock('services/Player');
vi.mock('lib/auth.server');

const testURI = '/api/footy/player/1/lastplayed';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ id: "1" }) }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    it('should return JSON response for a valid player', async () => {
        (getUserRole as Mock).mockResolvedValue('none');
        (playerService.getLastPlayed as Mock).mockResolvedValue(defaultOutcome);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual({
            ...defaultOutcome,
            comment: undefined,
        });
    });

    it('should return JSON response for a valid player including comment for an admin', async () => {
        (getUserRole as Mock).mockResolvedValue('admin');
        (playerService.getLastPlayed as Mock).mockResolvedValue(defaultOutcome);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(defaultOutcome);
    });

    it('should return 404 if the player does not exist', async () => {
        (playerService.getById as Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 404 if the arse record does not exist', async () => {
        (playerService.getLastPlayed as Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (playerService.getLastPlayed as Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
