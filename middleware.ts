import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const { pathname } = request.nextUrl

  // Protected paths
  const isDashboardPath = pathname.startsWith("/dashboard")
  // Public auth-related paths
  const isAuthPath = pathname.startsWith("/login") || pathname.startsWith("/signup")
  // Root path
  const isRootPath = pathname === "/"

  if (isRootPath) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } else {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  if (isDashboardPath && !token) {
    // Redirect to login if trying to access dashboard while unauthorized
    const loginUrl = new URL("/login", request.url)
    // Optional: save search params as redirect path
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthPath && token) {
    // Redirect to dashboard if logged-in user tries to open login/signup pages
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Config to specify exactly which paths the middleware should trigger for
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon.png, brand logo, etc.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png|.*\\.png$).*)",
  ],
}
