import { createMockApp, mockBlobClient, pngResponseHandler } from '@/tests/lib/api/common';
import { setupPlayerMocks } from '@/tests/lib/api/player';

jest.mock('services/Player');

import { Readable } from 'stream';
import request from 'supertest';

import { GET } from '@/app/api/footy/player/[id]/mugshot/route';
import playerService from '@/services/Player';
import { loadBinaryFixture } from '@/tests/shared/fixtures';
const testRoute = '/api/footy/player/1/mugshot';
const mockApp = createMockApp(GET, { path: testRoute, params: Promise.resolve({ id: "1" }) }, pngResponseHandler);

describe('API tests using HTTP', () => {
    setupPlayerMocks();

    it('should return PNG response for a valid club', async () => {
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

    it('should return a placeholder image if the mugshot does not exist', async () => {
        const mockBuffer = Buffer.from('placeholder');
        const mockStream = new Readable();
        mockStream.push(mockBuffer);
        mockStream.push(null);

        (mockBlobClient.exists).mockResolvedValue(false);
        (mockBlobClient.download).mockResolvedValue({
            readableStreamBody: mockStream,
        });

        const response = await request(mockApp).get(testRoute);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('image/png');
        expect(response.body).toEqual(mockBuffer);
    });

    it('should return 404 if the player does not exist', async () => {
        (playerService.getById as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(404);
    });

    it('should return 500 if the mugshot download does not return anything', async () => {
        (mockBlobClient.exists).mockResolvedValue(true);
        (mockBlobClient.download).mockResolvedValue({});

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error: Image body download failed.');
    });

    it('should return 500 if the mugshot download fails', async () => {
        const errorMessage = 'Something went wrong';
        (mockBlobClient.exists).mockResolvedValue(true);
        (mockBlobClient.download).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
