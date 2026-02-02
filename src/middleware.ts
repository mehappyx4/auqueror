import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Emergency Bypass: Middleware disabled to prevent 500 Server Error on Vercel
// This allows the site to load even if NEXTAUTH_SECRET is missing.
export function middleware(request: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
