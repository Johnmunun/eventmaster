import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  const session = await auth()
  const pathname = request.nextUrl.pathname

  // Routes publiques
  const publicPaths = ["/", "/login", "/signup", "/api/auth"]
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path)
  )

  // Si c'est une route publique, autoriser l'accès
  if (isPublicPath) {
    // Rediriger les utilisateurs connectés qui essaient d'accéder aux pages d'auth
    if (session && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.next()
  }

  // Routes protégées - vérifier l'authentification
  if (!session) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Vérifier les routes admin
  if (pathname.startsWith("/admin")) {
    const userRole = (session.user as any)?.role
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
}

