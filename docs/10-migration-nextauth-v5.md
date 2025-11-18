# Migration NextAuth v5 - Middleware

## Changements dans NextAuth v5

NextAuth v5 a complètement changé l'API du middleware. L'ancienne API `withAuth` de `next-auth/middleware` n'existe plus.

## Nouvelle API

### Avant (NextAuth v4)
```typescript
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // ...
  }
)
```

### Après (NextAuth v5)
```typescript
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await auth()
  // ...
}
```

## Différences principales

1. **Pas de `withAuth`** : Utilisez directement `auth()` depuis votre configuration
2. **Fonction async** : Le middleware doit être async
3. **Type `NextRequest`** : Utilisez `NextRequest` au lieu de `Request`
4. **Session directe** : `auth()` retourne directement la session

## Exemple complet

```typescript
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await auth()
  const pathname = request.nextUrl.pathname

  // Routes publiques
  if (pathname.startsWith("/api/auth") || pathname === "/") {
    return NextResponse.next()
  }

  // Routes protégées
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Vérifications de rôle
  if (pathname.startsWith("/admin")) {
    const role = (session.user as any)?.role
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"]
}
```

## Migration

Le fichier `middleware.ts` a été mis à jour pour NextAuth v5. Plus besoin de migration supplémentaire ! ✅

## Références

- [Documentation NextAuth v5](https://authjs.dev/getting-started/migrating-to-v5)
- [Guide de migration](https://authjs.dev/getting-started/migrating-to-v5)




