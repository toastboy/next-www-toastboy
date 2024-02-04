/**
 * Return the full, absolute URL for a given API route.
 *
 * @param apiRoute A string representing the API route
 *
 * @returns A string containing the absolute URL for the route, whether we're
 * working server or client side.
 */

export function createAbsoluteApiUrl(apiRoute: string): string {
    if (typeof window !== "undefined") {
        const baseUrl = `${window.location.protocol}//${window.location.hostname}`;
        const port = window.location.port ? `:${window.location.port}` : '';

        return `${baseUrl}${port}/api/${apiRoute}`;
    } else {
        return `/api/${apiRoute}`;
    }
}
