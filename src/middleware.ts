import { NextResponse, type NextRequest } from "next/server";

// This is a middleware function. It runs before the request is handled by the
// application. It's here as a no-op for now. I may want to use it as an auth
// backstop, for example: see
// https://nextjs.org/blog/security-nextjs-server-components-actions

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware(request: NextRequest) {
    // console.log("Middleware running for:", request.nextUrl.pathname);
    // console.log("Headers:", request.headers);
    // console.log("Cookies:", request.headers.get("cookie"));

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api/auth|_next/static|_next/image|.*\\.png|.*\\.ico|.*\\.jpg$|monitoring).*)'],
};
