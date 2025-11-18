# Configuration NextAuth.js v5

## 1. Installation

```bash
npm install next-auth@beta
```

## 2. Création du fichier de configuration

Le fichier `lib/auth.ts` doit être créé (voir le fichier source).

## 3. Configuration des routes API

Créer le fichier `app/api/auth/[...nextauth]/route.ts` (voir le fichier source).

## 4. Variables d'environnement

Ajoutez dans votre fichier `.env` :

```env
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-tres-long-et-aleatoire"

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID="votre-google-client-id"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"
```

### Génération du secret NextAuth

```bash
openssl rand -base64 32
```

Ou utilisez un générateur en ligne : https://generate-secret.vercel.app/32

## 5. Configuration Google OAuth (optionnel)

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet
3. Activez l'API Google+
4. Créez des identifiants OAuth 2.0
5. Ajoutez les URLs de redirection :
   - `http://localhost:3000/api/auth/callback/google` (développement)
   - `https://votre-domaine.com/api/auth/callback/google` (production)

## 6. Utilisation dans les composants

```typescript
import { useSession } from "next-auth/react"

export function MyComponent() {
  const { data: session, status } = useSession()
  
  if (status === "loading") return <p>Chargement...</p>
  if (status === "unauthenticated") return <p>Non connecté</p>
  
  return <p>Connecté en tant que {session?.user?.email}</p>
}
```




