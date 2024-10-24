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
        readableStream.on('data', (data) => {
            chunks.push(Buffer.from(data));
        });
        readableStream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on('error', reject);
    });
}

/**
 * Returns a string representation of the given year.
 *
 * @param year - The year to be converted to a string. If the year is 0, it returns "All-time".
 * @returns A string representing the year. If the year is 0, it returns "All-time"; otherwise, it returns the year as a string.
 */
export function getYearName(year: number): string {
    return year == 0 ? "All-time" : year.toString();
}
