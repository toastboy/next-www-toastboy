import fs from 'fs';
import path from 'path';

const cache = new Map<string, unknown>();

/**
 * Synchronously loads a JSON fixture from disk, parses it, and returns the parsed value typed as T.
 *
 * The fixture is read from a path resolved relative to the fixtures module (one directory up from this file).
 * Parsed results are cached by absolute path so subsequent calls for the same path return the cached value.
 *
 * @typeParam T - Expected shape of the parsed JSON. The function does not validate the shape at runtime;
 *                the type parameter is only for compile-time typing.
 *
 * @param relativePath - Path to the JSON file relative to the fixtures directory (e.g. "data/example.json").
 *
 * @returns The parsed JSON value cast to T. Note that the returned value is the cached object reference,
 *          not a deep clone — mutating the returned object will mutate the cached value.
 *
 * @throws If the file cannot be read (fs.readFileSync errors) or the file contents are not valid JSON (JSON.parse errors).
 *
 * @example
 * const user = loadJsonFixture<{ id: string; name: string }>('users/fixture-user.json');
 */
export function loadJsonFixture<T = unknown>(relativePath: string): T {
    const fullPath = path.join(__dirname, '..', relativePath);

    if (!cache.has(fullPath)) {
        const raw = fs.readFileSync(fullPath, 'utf8');
        cache.set(fullPath, JSON.parse(raw));
    }

    // TODO: validate T at runtime using zod

    return cache.get(fullPath) as T;
}

/**
 * Loads a PNG fixture file from the specified relative path and returns it as a Buffer.
 * Uses an internal cache to avoid repeated file system reads for the same file.
 *
 * @param relativePath - The path to the PNG file relative to the parent directory of the current module
 * @returns A Buffer containing the PNG file data
 *
 * @example
 * ```typescript
 * const imageBuffer = loadPNGFixture('fixtures/test-image.png');
 * ```
 */
export function loadBinaryFixture(relativePath: string): Buffer {
    const fullPath = path.join(__dirname, '..', relativePath);

    if (!cache.has(fullPath)) {
        const raw = fs.readFileSync(fullPath);
        const mockBuffer = Buffer.from(raw);
        cache.set(fullPath, mockBuffer);
    }

    return cache.get(fullPath) as Buffer;
}
