/**
 * Converts a readable stream into a Buffer.
 *
 * @param readableStream - The readable stream to convert.
 * @returns A promise that resolves to a Buffer containing the data from the stream.
 *
 * @example
 * ```typescript
 * import { streamToBuffer } from './utils';
 * import { createReadStream } from 'fs';
 *
 * const readableStream = createReadStream('path/to/file');
 * const buffer = await streamToBuffer(readableStream);
 * console.log(buffer.toString());
 * ```
 */
export async function streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        readableStream.on('data', (data: Buffer | Uint8Array) => {
            chunks.push(Buffer.isBuffer(data) ? data : Buffer.from(data));
        });
        readableStream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on('error', reject);
    });
}
