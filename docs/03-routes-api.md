# Routes API pour l'authentification

## Structure des routes

### 1. Inscription (POST /api/auth/register)

**Fichier:** `app/api/auth/register/route.ts`

**Body:**
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "motdepasse123"
}
```

**Réponse succès (201):**
```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "user": {
    "id": "...",
    "email": "jean@example.com",
    "name": "Jean Dupont"
  }
}
```

**Réponse erreur (400/409):**
```json
{
  "success": false,
  "error": "Email déjà utilisé"
}
```

### 2. Connexion (POST /api/auth/login)

**Fichier:** `app/api/auth/login/route.ts`

**Body:**
```json
{
  "email": "jean@example.com",
  "password": "motdepasse123"
}
```

**Réponse succès (200):**
```json
{
  "success": true,
  "message": "Connexion réussie"
}
```

**Réponse erreur (401):**
```json
{
  "success": false,
  "error": "Email ou mot de passe incorrect"
}
```

### 3. Déconnexion (POST /api/auth/signout)

Utilise directement NextAuth : `signOut()` depuis le client.

## Sécurité

- ✅ Mots de passe hashés avec bcrypt (10 rounds)
- ✅ Validation des données avec Zod
- ✅ Protection CSRF via NextAuth
- ✅ Rate limiting recommandé (à implémenter)
- ✅ Validation email (à implémenter)




