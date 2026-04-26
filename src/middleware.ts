import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Middleware function for Next.js that intercepts incoming requests,
 * adds the current pathname to the request headers as 'x-pathname',
 * and forwards the modified request to the next handler.
 *
 * @param request - The incoming Next.js request object.
 * @returns A NextResponse object with the updated request headers.
 */
export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', request.nextUrl.pathname);

    return NextResponse.next({
        request: { headers: requestHeaders },
    });
}

/**
 * Middleware configuration object for Next.js.
 *
 * @remarks
 * The `matcher` property defines a pattern for matching incoming request paths.
 * This configuration excludes requests to static assets (`_next/static`, `_next/image`),
 * the favicon (`favicon.ico`), and monitoring endpoints (`monitoring`) from being processed
 * by the middleware. All other paths will be matched and handled by the middleware.
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher}
 */
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon\\.ico|monitoring).*)'],
};
