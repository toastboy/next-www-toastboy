import fs from 'fs';
import path from 'path';
import type { ZodType } from 'zod';

const cache = new Map<string, unknown>();

/**
 * Synchronously loads a JSON fixture from disk, parses it, validates it against the given
 * Zod schema, and returns the validated value typed as T.
 *
 * The fixture is read from a path resolved relative to the fixtures module (one directory up from this file).
 * Validated results are cached by absolute path so subsequent calls for the same path return the cached value.
 *
 * @typeParam T - Expected shape of the parsed JSON, inferred from `schema`.
 *
 * @param relativePath - Path to the JSON file relative to the fixtures directory (e.g. "data/example.json").
 * @param schema - Zod schema the parsed JSON must satisfy.
 *
 * @returns The parsed JSON value, validated and typed as T. Note that the returned value is the cached
 *          object reference, not a deep clone — mutating the returned object will mutate the cached value.
 *
 * @throws If the file cannot be read (fs.readFileSync errors), the file contents are not valid JSON
 *         (JSON.parse errors), or the parsed value does not satisfy `schema` (ZodError).
 *
 * @example
 * const user = loadJsonFixture('users/fixture-user.json', UserSchema);
 */
export function loadJsonFixture<T>(
    relativePath: string,
    schema: ZodType<T>,
): T {
    const fullPath = path.join(__dirname, '..', relativePath);

    if (!cache.has(fullPath)) {
        const raw = fs.readFileSync(fullPath, 'utf8');
        cache.set(fullPath, schema.parse(JSON.parse(raw)));
    }

    return cache.get(fullPath) as T;
}

/**
 * Loads a binary fixture file (e.g. PNG image) from the specified relative path
 * and returns it as a Buffer. Uses an internal cache to avoid repeated file
 * system reads for the same file.
 *
 * @param relativePath - The path to the file relative to the parent directory
 * of the current module
 * @returns A Buffer containing the file data
 *
 * @example
 * ```typescript
 * const imageBuffer = loadBinaryFixture('fixtures/test-image.png');
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
