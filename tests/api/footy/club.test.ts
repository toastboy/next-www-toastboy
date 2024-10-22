import request from 'supertest';
import { createServer } from 'http';
import { GET, generateStaticParams } from 'app/api/footy/club/[id]/badge/route';
import AzureCache from 'lib/azure';
import clubService from 'services/Club';

jest.mock('lib/utils');
jest.mock('services/Club');

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
                } else if (response.body) {
                    // Convert the ReadableStream to a buffer
                    const buffer = await readableStreamToBuffer(response.body as ReadableStream<Uint8Array>);
                    res.setHeader('Content-Type', 'image/png');
                    res.end(buffer);
                } else {
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                }
            })
            .catch((err) => {
                res.statusCode = 500;
                res.end(`Error: ${err.message}`);
            });
    }
});

describe('API tests using HTTP', () => {
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
        const mockStream = new ReadableStream({
            start(controller) {
                controller.enqueue(new Uint8Array(mockBuffer));
                controller.close();
            },
        });
        const mockBlobClient = {
            exists: jest.fn().mockResolvedValue(true),
            download: jest.fn().mockResolvedValue({ readableStreamBody: mockStream }),
        };
        const mockContainerClient = {
            getBlobClient: jest.fn().mockReturnValue(mockBlobClient),
        };
        const mockAzureCache = {
            getContainerClient: jest.fn().mockResolvedValue(mockContainerClient),
        };

        (AzureCache.getInstance as jest.Mock).mockReturnValue(mockAzureCache);

        const response = await request(mockApp).get('/api/footy/club/1/badge');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('image/png');
        expect(response.body).toEqual(mockBuffer);
    });

    it('should return 404 if the badge does not exist', async () => {
        const mockBlobClient = {
            exists: jest.fn().mockResolvedValue(false),
        };
        const mockContainerClient = {
            getBlobClient: jest.fn().mockReturnValue(mockBlobClient),
        };
        const mockAzureCache = {
            getContainerClient: jest.fn().mockResolvedValue(mockContainerClient),
        };

        (AzureCache.getInstance as jest.Mock).mockReturnValue(mockAzureCache);

        const response = await request(mockApp).get('/api/footy/club/1/badge');

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is a server error', async () => {
        const mockBlobClient = {
            exists: jest.fn().mockRejectedValue(new Error('Something went wrong')),
        };
        const mockContainerClient = {
            getBlobClient: jest.fn().mockReturnValue(mockBlobClient),
        };
        const mockAzureCache = {
            getContainerClient: jest.fn().mockResolvedValue(mockContainerClient),
        };

        (AzureCache.getInstance as jest.Mock).mockReturnValue(mockAzureCache);

        const response = await request(mockApp).get('/api/footy/club/1/badge');

        expect(response.status).toBe(500);
        expect(response.text).toBe('Error: Something went wrong');
    });
});
