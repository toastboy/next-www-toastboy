/**
 * Utility to determine the runtime environment. If true, we're running on the
 * server and if false, we're on a client.
 */
export const isServer = typeof window === 'undefined';

/**
 * Helper function to convert a stream to a buffer.
 *
 * @param readableStream A node.js readable stream object
 *
 * @returns A promise for a buffer containing the stream contents.
 */
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

/**
 * Returns the name of the year. If the year is 0, it returns "All-time".
 * Otherwise, it returns the year as a string.
 * @param year - The year to get the name for.
 * @returns The name of the year.
 */
export function getYearName(year: number): string {
    return year == 0 ? "All-time" : year.toString();
}
