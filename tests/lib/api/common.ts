import { createServer, ServerResponse } from 'http';

export const mockBlobClient = {
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

/**
 * Suppresses console error messages during tests by mocking `console.error`.
 *
 * This function sets up a Jest spy on `console.error` before each test and restores
 * the original implementation after each test. This is useful for preventing
 * console error messages from cluttering test output.
 *
 * @example
 * ```typescript
 * describe('some test suite', () => {
 *     suppressConsoleError();
 *
 *     it('should not log errors to the console', () => {
 *         // Your test code here
 *     });
 * });
 * ```
 */
export function suppressConsoleError() {
    let consoleErrorMock: jest.SpyInstance;

    beforeEach(() => {
        consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleErrorMock.mockRestore();
    });
}

/**
 * Creates a mock server application for testing purposes.
 *
 * @param getFunction - A function that processes the incoming request and returns a Promise of a Response object.
 * @param routeParams - An object containing the path and parameters for the route to be mocked.
 * @param responseHandler - A function that handles the Response object and sends the appropriate response to the client.
 *
 * @returns A mock server instance.
 */
export function createMockApp(
    getFunction: (request: Request, { params }: { params: Promise<Record<string, string>> }) => Promise<Response>,
    routeParams: { path: string; params: Promise<Record<string, string>> },
    responseHandler: (response: Response, res: ServerResponse) => Promise<void>,
) {
    return createServer((req, res) => {
        if (req.url?.includes(routeParams.path)) {
            const requestObject = new Request(`http://localhost${req.url}`, {
                method: req.method,
                headers: req.headers as HeadersInit,
            });

            getFunction(requestObject, { params: routeParams.params })
                .then(async (response) => {
                    await responseHandler(response, res);
                })
                .catch((err) => {
                    res.statusCode = 500;
                    res.end(`Error: ${err.message}`);
                });
        }
    });
}

/**
 * Handles the JSON response from a fetch request and sends the appropriate response to the client.
 *
 * @param response - The response object from a fetch request.
 * @param res - The server response object to send the response to the client.
 *
 * @remarks
 * - If the response status is 404, it sends a 'Not Found' message with a 404 status code.
 * - If the response status is 500, it sends an 'Internal Server Error' message with a 500 status code.
 * - If the response has a body, it sets the 'Content-Type' header to 'application/json' and sends the response body.
 * - If the response does not have a body, it sends a 'Missing Response Body' message with a 500 status code.
 */
export async function jsonResponseHandler(response: Response, res: ServerResponse) {
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
}

/**
 * Handles the response from a PNG request and sends the appropriate response to the client.
 *
 * @param response - The response object from the PNG request.
 * @param res - The server response object to send the result to the client.
 *
 * @remarks
 * - If the response status is 404, it sends a 'Not Found' message with a 404 status code.
 * - If the response status is 500, it sends an 'Internal Server Error' message with a 500 status code.
 * - If the response body is present, it converts the readable stream to a buffer, sets the 'Content-Type' header to 'image/png', and sends the buffer.
 * - If the response body is missing, it sends a 'Missing Response Body' message with a 500 status code.
 */
export async function pngResponseHandler(response: Response, res: ServerResponse) {
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
}

/**
 * Converts a ReadableStream of Uint8Array chunks into a single Buffer.
 *
 * @param stream - The ReadableStream of Uint8Array chunks to be converted.
 * @returns A Promise that resolves to a Buffer containing the concatenated data from the stream.
 */
export async function readableStreamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
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
