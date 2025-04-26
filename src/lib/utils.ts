import { TableName } from './types';

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

/**
 * A mapping of rank types to their corresponding rank identifiers.
 *
 * The `rankMap` object provides a way to translate between different rank
 * types and their associated identifiers used within the application.
 *
 * @property {string} points - The rank identifier for points.
 * @property {string} averages - The rank identifier for averages.
 * @property {string} stalwart - The rank identifier for stalwart.
 * @property {string} speedy - The rank identifier for speedy.
 * @property {string} pub - The rank identifier for pub.
 */
export const rankMap: Record<TableName, string> = {
    points: "rankPoints",
    averages: "rankAverages",
    stalwart: "rankStalwart",
    speedy: "rankSpeedy",
    pub: "rankPub",
};

/**
 * Parses a boolean value from a string.
 *
 * @param value - The string to parse as a boolean.
 * @returns `true` if the string is "true", `false` if the string is "false", and `undefined` otherwise.
 */
export const parseBoolean = (value: string | null) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
};
