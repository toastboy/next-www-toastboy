import { ServerResponse } from 'http';
import { NextRequest, NextResponse } from 'next/server';
import { vi } from 'vitest';

export const mockBlobClient = {
    exists: vi.fn(),
    download: vi.fn(),
};

const mockContainerClient = {
    getBlobClient: vi.fn().mockReturnValue(mockBlobClient),
};

const mockBlobServiceClient = {
    getContainerClient: vi.fn().mockReturnValue(mockContainerClient),
};

vi.mock('@azure/storage-blob', () => ({
    BlobServiceClient: vi.fn(() => mockBlobServiceClient),
}));

const mockAzureCache = {
    getContainerClient: vi.fn().mockReturnValue(mockContainerClient),
};

vi.mock('lib/azure', () => ({
    __esModule: true,
    default: mockAzureCache,
}));


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
    getFunction: (request: NextRequest, { params }: { params: Promise<Record<string, string>> }) => Promise<NextResponse>,
    routeParams: { path: string; params: Promise<Record<string, string>> },
    responseHandler: (response: NextResponse, res: ServerResponse) => Promise<void>,
) {
    return {
        __handle: async (url: string, method = 'GET') => {
            if (!url.includes(routeParams.path)) {
                return {
                    status: 404,
                    headers: { 'content-type': 'text/plain' },
                    body: null,
                    text: 'Not Found',
                };
            }

            const requestObject = new NextRequest(`http://localhost${url}`, {
                method,
                headers: {},
            });

            const headers = new Map<string, string>();
            let statusCode = 200;
            let endPayload: string | Buffer | undefined;

            const res = {
                setHeader: (key: string, value: string) => {
                    headers.set(key.toLowerCase(), value);
                },
                end: (payload?: string | Buffer) => {
                    endPayload = payload;
                },
                set statusCode(code: number) {
                    statusCode = code;
                },
                get statusCode() {
                    return statusCode;
                },
            } as unknown as ServerResponse;

            try {
                const response = await getFunction(requestObject, { params: routeParams.params });
                await responseHandler(response, res);
            } catch (err) {
                statusCode = 500;
                endPayload = `Error: ${err instanceof Error ? err.message : String(err)}`;
                headers.set('content-type', 'text/plain');
            }

            const normalizedHeaders: Record<string, string> = {};
            for (const [key, value] of headers.entries()) {
                normalizedHeaders[key] = value;
            }

            const contentType = normalizedHeaders['content-type'] || '';
            const text = typeof endPayload === 'string' ? endPayload : '';
            let body: unknown = endPayload;

            if (typeof endPayload === 'string' && contentType.includes('application/json')) {
                body = JSON.parse(endPayload);
            }

            return {
                status: statusCode,
                headers: normalizedHeaders,
                body,
                text,
            };
        },
    };
}

/**
 * Handles the conversion of a `NextResponse` object to a Node.js `ServerResponse`.
 *
 * This function sets the status code and headers of the `ServerResponse` based on the
 * `NextResponse` object. If the `NextResponse` contains a body, it reads the body as text
 * and sends it as the response. Otherwise, it ends the response without a body.
 *
 * @param response - The `NextResponse` object containing the response data.
 * @param res - The Node.js `ServerResponse` object to be populated and sent.
 *
 * @returns A promise that resolves when the response has been fully handled.
 */
export async function jsonResponseHandler(response: NextResponse, res: ServerResponse) {
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
        res.setHeader(key, value);
    });

    if (response.body) {
        const body = await response.text();
        res.end(body);
    } else {
        res.end();
    }
}

/**
 * Handles a PNG response by transferring headers and body from a `NextResponse` to a `ServerResponse`.
 * If the response contains a body, it converts the readable stream to a buffer and sets the appropriate
 * `Content-Type` header before sending the PNG data. If no body is present, it ends the response without content.
 *
 * @param response - The `NextResponse` object containing the response data to handle.
 * @param res - The `ServerResponse` object to which the response data will be written.
 * @returns A promise that resolves when the response handling is complete.
 */
export async function pngResponseHandler(response: NextResponse, res: ServerResponse) {
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
        res.setHeader(key, value);
    });

    if (response.body) {
        const buffer = await readableStreamToBuffer(response.body as ReadableStream<Uint8Array>);
        res.setHeader('Content-Type', 'image/png');
        res.end(buffer);
    } else {
        res.end();
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

/**
 * Small utility to convert values to a format suitable for wire transfer (e.g.,
 * JSON) - especially for testing API responses and the mock data.
 */
export function toWire(v: unknown): unknown {
    return JSON.parse(JSON.stringify(v));
}
