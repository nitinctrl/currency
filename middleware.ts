import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Allow all requests to pass through
  // Authentication will be handled at the page/component level
  return NextResponse.next({
    request,
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
