import { createMockApp, mockBlobClient, pngResponseHandler, suppressConsoleError } from 'tests/lib/api/common';

jest.mock('services/Country');

import { GET, generateStaticParams } from 'api/footy/country/[isoCode]/flag/route';
import countryService from 'services/Country';
import { Readable } from 'stream';
import request from 'supertest';

suppressConsoleError();
const testRoute = '/api/footy/country/NO/flag';
const mockApp = createMockApp(GET, { path: testRoute, params: Promise.resolve({ isoCode: 'NO' }) }, pngResponseHandler);

describe('API tests using HTTP', () => {
    it('should return null if there are no countries', async () => {
        (countryService.getAll as jest.Mock).mockResolvedValue(null);

        const result = await generateStaticParams();
        expect(result).toEqual(null);
    });

    it('should return country isoCodes as params', async () => {
        const mockData = [{ isoCode: 'NO' }, { isoCode: 'AY' }];
        (countryService.getAll as jest.Mock).mockResolvedValue(mockData);

        const result = await generateStaticParams();
        expect(result).toEqual(mockData);
    });

    it('should return PNG response for a valid country', async () => {
        const mockBuffer = Buffer.from('test');
        const mockStream = new Readable();
        mockStream.push(mockBuffer);
        mockStream.push(null);

        (mockBlobClient.exists as jest.Mock).mockResolvedValue(true);
        (mockBlobClient.download as jest.Mock).mockResolvedValue({
            readableStreamBody: mockStream,
        });

        const response = await request(mockApp).get(testRoute);

        if (response.status !== 200) console.log('Error response:', response.error);
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('image/png');
        expect(response.body).toEqual(mockBuffer);
    });

    it('should return 404 if the flag does not exist', async () => {
        (mockBlobClient.exists as jest.Mock).mockResolvedValue(false);

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(404);
    });

    it('should return 500 if the flag download does not return anything', async () => {
        (mockBlobClient.exists as jest.Mock).mockResolvedValue(true);
        (mockBlobClient.download as jest.Mock).mockResolvedValue({});

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error: Image body download failed.');
    });

    it('should return 500 if the flag download fails', async () => {
        const errorMessage = 'Something went wrong';
        (mockBlobClient.exists as jest.Mock).mockResolvedValue(true);
        (mockBlobClient.download as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const response = await request(mockApp).get(testRoute);

        expect(response.status).toBe(500);
        expect(response.text).toBe(`Error: ${errorMessage}`);
    });
});
