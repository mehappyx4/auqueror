
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        // Custom logic can go here if needed, but withAuth handles basic auth check
        // We can inspect token here as well
        const token = req.nextauth.token
        const isAuth = !!token
        const isAdminPage = req.nextUrl.pathname.startsWith("/admin")

        if (isAdminPage) {
            if (!isAuth) {
                return NextResponse.redirect(new URL("/auth/admin-login", req.url))
            }
            if (token?.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/", req.url))
            }
        }
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        },
    }
)

export const config = { matcher: ["/admin/:path*"] }
