# Middleware de protection des routes

## Fichier: `middleware.ts`

Le middleware protège automatiquement toutes les routes `/dashboard/*` et `/admin/*`.

## Routes publiques

- `/` (page d'accueil)
- `/login`
- `/signup`
- `/api/auth/*` (routes NextAuth)

## Routes protégées

- `/dashboard/*` - Nécessite une session active
- `/admin/*` - Nécessite une session active + rôle ADMIN

## Redirections

- Utilisateur non connecté → `/login`
- Utilisateur connecté accédant à `/login` ou `/signup` → `/dashboard`
- Utilisateur non-admin accédant à `/admin/*` → `/dashboard`

## Test du middleware

1. Essayez d'accéder à `/dashboard` sans être connecté → redirection vers `/login`
2. Connectez-vous → accès autorisé au dashboard
3. Essayez d'accéder à `/admin` sans être admin → redirection vers `/dashboard`




