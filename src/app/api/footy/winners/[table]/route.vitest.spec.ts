import request from 'supertest';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { GET } from '@/app/api/footy/winners/[table]/route';
import { getUserRole } from '@/lib/auth.server';
import playerRecordService from '@/services/PlayerRecord';
import { createMockApp, jsonResponseHandler, toWire } from '@/tests/lib/api/common';
import { defaultPlayerRecordList } from '@/tests/mocks/data/playerRecord';
vi.mock('lib/auth.server');
vi.mock('services/PlayerRecord');

const testURI = '/api/footy/winners/points';
const mockApp = createMockApp(GET, { path: testURI, params: Promise.resolve({ table: "points" }) }, jsonResponseHandler);


describe('API tests using HTTP', () => {
    it('should return JSON response for a valid gameDay', async () => {
        (getUserRole as Mock).mockResolvedValue('none');
        (playerRecordService.getWinners as Mock).mockResolvedValue(defaultPlayerRecordList);

        const response = await request(mockApp).get(testURI);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual(toWire(defaultPlayerRecordList));
    });

    it('should return 404 if there is no data', async () => {
        (playerRecordService.getWinners as Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        const errorMessage = 'Test Error';
        (playerRecordService.getWinners as Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testURI);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
