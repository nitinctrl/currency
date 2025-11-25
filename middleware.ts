import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("user_session")

  const isPublicPath =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup") ||
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.startsWith("/public") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/pending-approval" ||
    request.nextUrl.pathname === "/plans"

  // If no session and trying to access protected route, redirect to login
  if (!sessionCookie && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
