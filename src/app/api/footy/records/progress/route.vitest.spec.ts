import request from 'supertest';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { GET } from '@/app/api/footy/records/progress/route';
import { getUserRole } from '@/lib/authServer';
import playerRecordService from '@/services/PlayerRecord';
import { createMockApp, jsonResponseHandler, toWire } from '@/tests/lib/api/common';
import { defaultProgress } from '@/tests/mocks/data/progress';
vi.mock('lib/authServer');
vi.mock('services/PlayerRecord');

const testURI = '/api/footy/records/progress';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({}) }, jsonResponseHandler);


describe('API tests using HTTP', () => {
    it('should return JSON response', async () => {
        (playerRecordService.getProgress as Mock).mockResolvedValue(defaultProgress);
        (getUserRole as Mock).mockResolvedValue('admin');

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(toWire(defaultProgress));
    });

    it('should return 401 when unauthenticated', async () => {
        (playerRecordService.getProgress as Mock).mockResolvedValue(defaultProgress);
        (getUserRole as Mock).mockResolvedValue('none');

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(401);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual({ message: 'Unauthorized' });
    });

    it('should return 403 when non-admin', async () => {
        (playerRecordService.getProgress as Mock).mockResolvedValue(defaultProgress);
        (getUserRole as Mock).mockResolvedValue('user');

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(403);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual({ message: 'Forbidden' });
    });

    it('should return 404 if there is no progress', async () => {
        (playerRecordService.getProgress as Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (playerRecordService.getProgress as Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
