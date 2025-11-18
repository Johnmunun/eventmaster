# Fichier .env.example

## Contenu du fichier

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
# Base de données Neon
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-tres-long-et-aleatoire-32-caracteres-minimum"

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID="votre-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"

# Environnement
NODE_ENV="development"
```

## Instructions

1. Copiez ce contenu dans un fichier `.env` à la racine du projet
2. Remplacez les valeurs par vos propres credentials
3. **NE COMMITTEZ JAMAIS** le fichier `.env` (il est déjà dans `.gitignore`)
4. Pour la production, configurez ces variables dans votre plateforme de déploiement (Vercel, etc.)

## Génération du secret NextAuth

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Ou utilisez : https://generate-secret.vercel.app/32




