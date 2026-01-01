/**
 * Returns the normalized public base URL for the application.
 *
 * Prefers NEXT_PUBLIC_SITE_URL (with any trailing slashes removed), falls back
 * to BETTER_AUTH_URL, then the current browser origin if running in the
 * client, and falls back to http://localhost:3000.
 */
export function getPublicBaseUrl(): string {
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
