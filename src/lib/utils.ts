/**
 * Return the full, absolute URL for a given API route.
 *
 * @param apiRoute A string representing the API route
 *
 * @returns A string containing the absolute URL for the route, whether we're
 * working server or client side.
 */

export function createAbsoluteApiUrl(apiRoute: string): string {
    if (typeof window !== "undefined") {
        const baseUrl = `${window.location.protocol}//${window.location.hostname}`;
        const port = window.location.port ? `:${window.location.port}` : '';

        return `${baseUrl}${port}/api/${apiRoute}`;
    } else {
        return `/api/${apiRoute}`;
    }
}

/**
 * Helper function to convert a stream to a buffer.
 *
 * @param readableStream A node.js readable stream object
 *
 * @returns A promise for a buffer containing the stream contents.
 */

//
export async function streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        readableStream.on('data', (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on('error', reject);
    });
}
