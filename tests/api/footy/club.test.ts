const mockBlobClient = {
    exists: jest.fn(),
    download: jest.fn(),
};

const mockContainerClient = {
    getBlobClient: jest.fn().mockReturnValue(mockBlobClient),
};

const mockBlobServiceClient = {
    getContainerClient: jest.fn().mockReturnValue(mockContainerClient),
};

jest.mock('@azure/storage-blob', () => ({
    BlobServiceClient: jest.fn(() => mockBlobServiceClient),
}));

const mockAzureCache = {
    getContainerClient: jest.fn().mockResolvedValue(mockContainerClient),
};

jest.mock('lib/azure', () => ({
    __esModule: true,
    default: mockAzureCache,
}));

jest.mock('services/Club');

import { GET, generateStaticParams } from 'app/api/footy/club/[id]/badge/route';
import { createServer } from 'http';
import clubService from 'services/Club';
import { Readable } from 'stream';
import request from 'supertest';

// Helper function to convert ReadableStream to Buffer
async function readableStreamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
    const reader = stream.getReader();
    const chunks = [];
    let done = false;
    while (!done) {
        const { value, done: streamDone } = await reader.read();
        if (value) {
            chunks.push(value);
        }
        done = streamDone;
    }
    return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
}

const mockApp = createServer((req, res) => {
    if (req.url?.includes('/api/footy/club/1/badge')) {
        const requestObject = new Request(`http://localhost${req.url}`, {
            method: req.method,
            headers: req.headers as HeadersInit,
        });

        GET(requestObject, { params: { id: '1' } })
            .then(async (response) => {
                if (response.status === 404) {
                    res.statusCode = 404;
                    res.end('Not Found');
                } else if (response.status === 500) {
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                } else if (response.body) {
                    const buffer = await readableStreamToBuffer(response.body as ReadableStream<Uint8Array>);
                    res.setHeader('Content-Type', 'image/png');
                    res.end(buffer);
                } else {
                    res.statusCode = 500;
                    res.end('Missing Response Body');
                }
            })
            .catch((err) => {
                res.statusCode = 500;
                res.end(`Error: ${err.message}`);
            });
    }
});

describe('API tests using HTTP', () => {
    // I want console.error to be a noop for the entire test suite.

    let consoleErrorMock: jest.SpyInstance;

    beforeEach(() => {
        consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleErrorMock.mockRestore();
    });

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

    it('should return PNG response for a valid badge', async () => {
        const mockBuffer = Buffer.from('test');
        const mockStream = new Readable();
        mockStream.push(mockBuffer);
        mockStream.push(null);

        (mockBlobClient.exists as jest.Mock).mockResolvedValue(true);
        (mockBlobClient.download as jest.Mock).mockResolvedValue({
            readableStreamBody: mockStream,
        });

        const response = await request(mockApp).get('/api/footy/club/1/badge');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('image/png');
        expect(response.body).toEqual(mockBuffer);
    });

    it('should return 404 if the badge does not exist', async () => {
        (mockBlobClient.exists as jest.Mock).mockResolvedValue(false);

        const response = await request(mockApp).get('/api/footy/club/1/badge');

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if the badge download does not return anything', async () => {
        // Mock the download hook returning a null readableStreamBody
        (mockBlobClient.exists as jest.Mock).mockResolvedValue(true);
        (mockBlobClient.download as jest.Mock).mockResolvedValue({});

        const response = await request(mockApp).get('/api/footy/club/1/badge');

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });

    it('should return 500 if the badge download fails', async () => {
        // Mock an error in the download function
        (mockBlobClient.exists as jest.Mock).mockResolvedValue(true);
        (mockBlobClient.download as jest.Mock).mockRejectedValue(new Error('Something went wrong'));

        const response = await request(mockApp).get('/api/footy/club/1/badge');

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});
