/**
 * Normalises an email address by trimming whitespace and converting to lower case.
 *
 * Returns an empty string when the input is not provided. Does not validate
 * that the result is a syntactically valid email address.
 *
 * @param email - The email address to normalise.
 * @returns The normalised email address, or an empty string when not provided.
 */
export function normalizeEmail(email: string | null | undefined): string {
    return (email ?? '').trim().toLowerCase();
}
