import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    // 1. Protect Dashboard and Profile routes
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
        if (!token) {
            // Note: We allow "Guest" dashboard in current implementation, 
            // but typical middleware would redirect. 
            // In this app, we specifically allowed Optional Login.
            // If the user wants strict middleware, we add it here.
            // For now, let's keep it informative but not blocking to honor guest mode.
            return NextResponse.next();
        }
    }

    // 2. Redirect logged-in users away from auth pages
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
        if (token) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/register", "/admin/:path*"],
};
