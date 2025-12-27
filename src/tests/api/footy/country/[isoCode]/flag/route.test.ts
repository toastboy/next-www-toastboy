import { createMockApp, mockBlobClient, pngResponseHandler } from '@/tests/lib/api/common';

jest.mock('services/Country');

import { Readable } from 'stream';
import request from 'supertest';

import { GET } from '@/app/api/footy/country/[isoCode]/flag/route';
import { loadBinaryFixture } from '@/tests/shared/fixtures';
const testRoute = '/api/footy/country/NO/flag';
const mockApp = createMockApp(GET, { path: testRoute, params: Promise.resolve({ isoCode: 'NO' }) }, pngResponseHandler);

describe('API tests using HTTP', () => {
    it('should return PNG response for a valid country', async () => {
        const mockBuffer = loadBinaryFixture('mocks/data/football.png');

        (mockBlobClient.exists).mockResolvedValue(true);
        (mockBlobClient.download).mockResolvedValue({
            readableStreamBody: Readable.from([mockBuffer]),
        });

        const response = await request(mockApp).get(testRoute);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('image/png');
        expect(response.body).toEqual(mockBuffer);
    });

    it('should return 404 if the flag does not exist', async () => {
        (mockBlobClient.exists).mockResolvedValue(false);

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(404);
    });

    it('should return 500 if the flag download does not return anything', async () => {
        (mockBlobClient.exists).mockResolvedValue(true);
        (mockBlobClient.download).mockResolvedValue({});

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error: Image body download failed.');
    });

    it('should return 500 if the flag download fails', async () => {
        const errorMessage = 'Something went wrong';
        (mockBlobClient.exists).mockResolvedValue(true);
        (mockBlobClient.download).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
