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

/** Default redirect target when a caller-supplied one is missing or unsafe. */
export const DEFAULT_REDIRECT_PATH = '/footy/profile';

/**
 * Characters allowed in a safe internal redirect target: the RFC 3986 "pchar"
 * set plus the path/query/fragment delimiters `/ ? # [ ]` and the percent
 * sign. Anything outside this set (backslashes, control characters,
 * whitespace, quotes) makes the value unsafe.
 *
 * Note: inside a character class an unescaped `[` is a literal in JavaScript
 * regex (and `eslint`'s `no-useless-escape` rejects escaping it); `]` is
 * written as `\]` so it is a literal rather than closing the class.
 */
const SAFE_REDIRECT_PATH = /^\/[\w\-.~!$&'()*+,;=:@/?#%[\]]*$/;

/**
 * Returns `true` when `value` is a redirect target safe to hand to client-side
 * navigation or a social-auth callback URL: a path rooted at a single `/` that
 * cannot leave the current origin.
 *
 * Rejects absolute URLs (`https://evil.example`), protocol-relative URLs
 * (`//evil.example`), scheme-relative values (`javascript:...`), backslash
 * variants some browsers normalise to `/` (`/\evil.example`, `\\evil.example`),
 * and any value carrying control characters or whitespace that could smuggle
 * past a naive check (`/foo bar`, a decoded CR/LF).
 */
export function isSafeRedirectPath(
    value: string | null | undefined,
): value is string {
    if (typeof value !== 'string' || value.length === 0) {
        return false;
    }
    if (!value.startsWith('/') || value.startsWith('//')) {
        return false;
    }
    return SAFE_REDIRECT_PATH.test(value);
}

/**
 * Normalises a caller-supplied redirect target to a safe internal path.
 *
 * Returns `value` when it is a safe internal path (see
 * {@link isSafeRedirectPath}), otherwise `fallback` when that is itself safe,
 * otherwise {@link DEFAULT_REDIRECT_PATH}. Centralised so every auth flow
 * sanitises redirects the same way and none can be pointed at an external
 * origin.
 */
export function sanitizeRedirectPath(
    value: string | null | undefined,
    fallback: string = DEFAULT_REDIRECT_PATH,
): string {
    if (isSafeRedirectPath(value)) {
        return value;
    }
    if (isSafeRedirectPath(fallback)) {
        return fallback;
    }
    return DEFAULT_REDIRECT_PATH;
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

/**
 * Returns the origins Better Auth should trust for CORS/CSRF checks, in
 * addition to baseURL (which Better Auth trusts implicitly).
 *
 * Reads TRUSTED_ORIGINS (comma-separated, server-only, read at runtime — not
 * baked in at build time), so the allow-list can change per deployment (e.g.
 * widened while a new domain shadows the old one) without rebuilding the
 * image. Defaults to localhost:3000 only, for local testing, when unset —
 * real deployments are expected to set TRUSTED_ORIGINS explicitly.
 */
export function getTrustedOrigins(): string[] {
    const configured = process.env.TRUSTED_ORIGINS?.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

    return configured && configured.length > 0
        ? configured
        : ['http://localhost:3000'];
}
