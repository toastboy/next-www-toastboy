/**
 * Decodes a URI-encoded string, falling back to the original value unchanged
 * if it contains malformed percent-encoding (which makes decodeURIComponent
 * throw a URIError) rather than letting that crash the caller.
 */
export function safeDecodeURIComponent(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

/**
 * Returns the normalized public base URL for the application.
 *
 * Checks SITE_URL first (server-only, read at runtime — not baked in at build
 * time), then NEXT_PUBLIC_SITE_URL (inlined at build time for both client and
 * server bundles), then BETTER_AUTH_URL, then the current browser origin, and
 * finally falls back to http://localhost:3000.
 */
export function getPublicBaseUrl(): string {
    const runtimeUrl = process.env.SITE_URL?.trim();
    if (runtimeUrl) {
        return runtimeUrl.replace(/\/+$/, '');
    }

    const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (envUrl) {
        return envUrl.replace(/\/+$/, '');
    }

    const serverUrl = process.env.BETTER_AUTH_URL?.trim();
    if (serverUrl) {
        return serverUrl.replace(/\/+$/, '');
    }

    if (typeof window !== 'undefined' && window.location?.origin) {
        return window.location.origin;
    }

    return 'http://localhost:3000';
}
