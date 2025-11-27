import { createMockApp, mockBlobClient, pngResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

jest.mock('services/Club');

import { GET } from 'api/footy/club/[id]/badge/route';
import { Readable } from 'stream';
import request from 'supertest';

suppressConsoleError();
const testRoute = '/api/footy/club/1/badge';
const mockApp = createMockApp(GET, { path: testRoute, params: Promise.resolve({ id: '1' }) }, pngResponseHandler);

describe('API tests using HTTP', () => {
    it('should return PNG response for a valid club', async () => {
        const mockBuffer = Buffer.from('test');
        const mockStream = new Readable();
        mockStream.push(mockBuffer);
        mockStream.push(null);

        (mockBlobClient.exists).mockResolvedValue(true);
        (mockBlobClient.download).mockResolvedValue({
            readableStreamBody: mockStream,
        });

        const response = await request(mockApp).get(testRoute);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('image/png');
        expect(response.body).toEqual(mockBuffer);
    });

    it('should return 404 if the badge does not exist', async () => {
        (mockBlobClient.exists).mockResolvedValue(false);

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(404);
    });

    it('should return 500 if the badge download does not return anything', async () => {
        (mockBlobClient.exists).mockResolvedValue(true);
        (mockBlobClient.download).mockResolvedValue({});

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error: Image body download failed.');
    });

    it('should return 500 if the badge download fails', async () => {
        const errorMessage = 'Something went wrong';
        (mockBlobClient.exists).mockResolvedValue(true);
        (mockBlobClient.download).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
