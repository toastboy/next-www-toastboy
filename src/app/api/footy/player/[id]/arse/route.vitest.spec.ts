
import request from 'supertest';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { GET } from '@/app/api/footy/player/[id]/arse/route';
import { getUserRole } from '@/lib/auth.server';
import arseService from '@/services/Arse';
import { createMockApp, jsonResponseHandler, toWire } from '@/tests/lib/api/common';
import { defaultArse } from '@/tests/mocks/data/arse';
vi.mock('services/Arse');
vi.mock('lib/auth.server');

const testURI = '/api/footy/player/1/arse';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ id: "1" }) }, jsonResponseHandler);

describe('API tests using HTTP', () => {
    it('should return JSON response for a valid player', async () => {
        (arseService.getByPlayer as Mock).mockResolvedValue(defaultArse);
        (getUserRole as Mock).mockResolvedValue('admin');

        const response = await request(mockApp).get(testURI);

        expect(getUserRole).toHaveBeenCalled();
        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(toWire(defaultArse));
    });

    it('should refuse to return any arse when there is no admin logged in', async () => {
        (arseService.getByPlayer as Mock).mockResolvedValue(defaultArse);
        (getUserRole as Mock).mockResolvedValue('user');

        const response = await request(mockApp).get(testURI);

        expect(getUserRole).toHaveBeenCalled();
        expect(response.status).toBe(403);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual({ message: 'Forbidden' });
    });

    it('should return 404 if the arse record does not exist', async () => {
        (arseService.getByPlayer as Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (arseService.getByPlayer as Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
