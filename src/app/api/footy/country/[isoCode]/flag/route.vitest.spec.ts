import { Readable } from 'stream';
import request from 'supertest';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

vi.mock('@/lib/azure');
vi.mock('services/Country');

import { GET } from '@/app/api/footy/country/[isoCode]/flag/route';
import azureCache from '@/lib/azure';
import { createMockApp, pngResponseHandler } from '@/tests/lib/api/common';
import { loadBinaryFixture } from '@/tests/shared/fixtures';

const testRoute = '/api/footy/country/NO/flag';
const mockApp = createMockApp(GET, { path: testRoute, params: Promise.resolve({ isoCode: 'NO' }) }, pngResponseHandler);
const containerClient = azureCache.getContainerClient('countries');
const blobClient = containerClient.getBlobClient('NO.png') as unknown as {
    exists: Mock;
    download: Mock;
};

describe('API tests using HTTP', () => {
    it('should return PNG response for a valid country', async () => {
        const mockBuffer = loadBinaryFixture('mocks/data/football.png');

        vi.spyOn(blobClient, 'exists').mockResolvedValue(true);
        vi.spyOn(blobClient, 'download').mockResolvedValue({
            readableStreamBody: Readable.from([mockBuffer]),
        });

        const response = await request(mockApp).get(testRoute);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('image/png');
        expect(response.body).toEqual(mockBuffer);
    });

    it('should return 404 if the flag does not exist', async () => {
        vi.spyOn(blobClient, 'exists').mockResolvedValue(false);

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(404);
    });

    it('should return 500 if the flag download does not return anything', async () => {
        vi.spyOn(blobClient, 'exists').mockResolvedValue(true);
        vi.spyOn(blobClient, 'download').mockResolvedValue({});

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error: Something went wrong.');
    });

    it('should return 500 if the flag download fails', async () => {
        const errorMessage = 'Something went wrong';
        vi.spyOn(blobClient, 'exists').mockResolvedValue(true);
        vi.spyOn(blobClient, 'download').mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error: Something went wrong.');
    });
});
