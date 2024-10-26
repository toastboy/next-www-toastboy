jest.mock('services/Club');

import { GET, generateStaticParams } from 'app/api/footy/club/[id]/route';
import { createServer } from 'http';
import clubService from 'services/Club';
import request from 'supertest';

const mockApp = createServer((req, res) => {
    if (req.url?.includes('/api/footy/club/1')) {
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
                    res.setHeader('Content-Type', 'application/json');
                    res.end(await response.text());
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

    it('should return JSON response for a valid club', async () => {
        (clubService.get as jest.Mock).mockResolvedValue({ id: 1, name: 'Test Club' });

        const response = await request(mockApp).get('/api/footy/club/1');

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/json');
        expect(response.body).toEqual({ id: 1, name: 'Test Club' });
    });

    it('should return 404 if the club does not exist', async () => {
        (clubService.get as jest.Mock).mockResolvedValue(null);

        const response = await request(mockApp).get('/api/footy/club/1');

        expect(response.status).toBe(404);
        expect(response.text).toBe('Not Found');
    });

    it('should return 500 if there is an error', async () => {
        (clubService.get as jest.Mock).mockRejectedValue(new Error('Test Error'));

        const response = await request(mockApp).get('/api/footy/club/1');

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});
