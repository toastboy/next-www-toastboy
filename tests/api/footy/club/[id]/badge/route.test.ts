import { createMockApp, mockBlobClient, pngResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

jest.mock('services/Club');

import { GET, generateStaticParams } from 'api/footy/club/[id]/badge/route';
import clubService from 'services/Club';
import { Readable } from 'stream';
import request from 'supertest';

suppressConsoleError();
const testRoute = '/api/footy/club/1/badge';
const mockApp = createMockApp(GET, { path: testRoute, params: { id: '1' } }, pngResponseHandler);

describe('API tests using HTTP', () => {
    it('should return null if there are no clubs', async () => {
        (clubService.getAll as jest.Mock).mockResolvedValue(null);

        const result = await generateStaticParams();
        expect(result).toEqual(null);
    });

    it('should return club ids as params', async () => {
        const clubs = [{ id: '1' }, { id: '2' }];
        (clubService.getAll as jest.Mock).mockResolvedValue(clubs);

        const result = await generateStaticParams();
        expect(result).toEqual([
            { params: { id: '1' } },
            { params: { id: '2' } },
        ]);
    });

    it('should return PNG response for a valid club', async () => {
        const mockBuffer = Buffer.from('test');
        const mockStream = new Readable();
        mockStream.push(mockBuffer);
        mockStream.push(null);

        (mockBlobClient.exists as jest.Mock).mockResolvedValue(true);
        (mockBlobClient.download as jest.Mock).mockResolvedValue({
            readableStreamBody: mockStream,
        });

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('image/png');
        expect(response.body).toEqual(mockBuffer);
    });

    it('should return 404 if the badge does not exist', async () => {
        (mockBlobClient.exists as jest.Mock).mockResolvedValue(false);

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if the badge download does not return anything', async () => {
        (mockBlobClient.exists as jest.Mock).mockResolvedValue(true);
        (mockBlobClient.download as jest.Mock).mockResolvedValue({});

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });

    it('should return 500 if the badge download fails', async () => {
        (mockBlobClient.exists as jest.Mock).mockResolvedValue(true);
        (mockBlobClient.download as jest.Mock).mockRejectedValue(new Error('Something went wrong'));

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});