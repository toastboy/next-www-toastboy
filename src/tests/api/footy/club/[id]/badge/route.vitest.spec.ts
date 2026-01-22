import { Readable } from 'stream';
import request from 'supertest';
import { Mock, vi } from 'vitest';

vi.mock('@/lib/azure');
vi.mock('services/Club');

import { GET } from '@/app/api/footy/club/[id]/badge/route';
import azureCache from '@/lib/azure';
import { createMockApp, pngResponseHandler } from '@/tests/lib/api/common';
import { loadBinaryFixture } from '@/tests/shared/fixtures';

const testRoute = '/api/footy/club/1/badge';
const mockApp = createMockApp(GET, { path: testRoute, params: Promise.resolve({ id: '1' }) }, pngResponseHandler);
const containerClient = azureCache.getContainerClient('clubs');
const blobClient = containerClient.getBlobClient('1.png') as unknown as {
    exists: Mock;
    download: Mock;
};

describe('API tests using HTTP', () => {
    it('should return PNG response for a valid club', async () => {
        const mockBuffer = loadBinaryFixture('mocks/data/football.png');

        (blobClient.exists).mockResolvedValue(true);
        (blobClient.download).mockResolvedValue({
            readableStreamBody: Readable.from([mockBuffer]),
        });

        const response = await request(mockApp).get(testRoute);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('image/png');
        expect(response.body).toEqual(mockBuffer);
    });

    it('should return 404 if the badge does not exist', async () => {
        (blobClient.exists).mockResolvedValue(false);

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(404);
    });

    it('should return 500 if the badge download does not return anything', async () => {
        (blobClient.exists).mockResolvedValue(true);
        (blobClient.download).mockResolvedValue({});

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error: Image body download failed.');
    });

    it('should return 500 if the badge download fails', async () => {
        const errorMessage = 'Something went wrong';
        (blobClient.exists).mockResolvedValue(true);
        (blobClient.download).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
