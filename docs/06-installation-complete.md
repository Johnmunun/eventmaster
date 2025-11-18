# Guide d'installation complet - EventMaster Backend

## Étapes d'installation

### 1. Installation des dépendances

```bash
npm install @prisma/client @auth/prisma-adapter bcryptjs next-auth@beta
npm install -D prisma @types/bcryptjs
```

### 2. Configuration de la base de données

1. Créez un compte sur [Neon](https://neon.tech)
2. Créez un nouveau projet PostgreSQL
3. Copiez la connection string

### 3. Configuration des variables d'environnement

Créez un fichier `.env` à la racine avec :

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-genere"
GOOGLE_CLIENT_ID="optionnel"
GOOGLE_CLIENT_SECRET="optionnel"
```

### 4. Génération du client Prisma

```bash
npx prisma generate
```

### 5. Création de la base de données

```bash
npx prisma migrate dev --name init
```

### 6. Vérification

```bash
# Démarrer le serveur de développement
npm run dev

# Ouvrir Prisma Studio (optionnel)
npx prisma studio
```

## Structure des fichiers créés

```
EventMaster/
├── prisma/
│   └── schema.prisma          # Schéma de base de données
├── lib/
│   ├── auth.ts                # Configuration NextAuth
│   └── db.ts                  # Client Prisma
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.ts   # Route NextAuth
│   │       ├── register/
│   │       │   └── route.ts   # Route inscription
│   │       └── login/
│   │           └── route.ts    # Route connexion
│   └── (auth)/
│       ├── login/
│       │   └── page.tsx        # Page de connexion
│       └── signup/
│           └── page.tsx        # Page d'inscription
├── middleware.ts              # Protection des routes
└── .env                       # Variables d'environnement (à créer)
```

## Test de l'installation

1. **Test de connexion à la base de données:**
   ```bash
   npx prisma db pull
   ```

2. **Test de l'inscription:**
   - Allez sur `/signup`
   - Créez un compte
   - Vérifiez dans Prisma Studio que l'utilisateur est créé

3. **Test de la connexion:**
   - Allez sur `/login`
   - Connectez-vous avec vos identifiants
   - Vous devriez être redirigé vers `/dashboard`

4. **Test de la protection des routes:**
   - Déconnectez-vous
   - Essayez d'accéder à `/dashboard`
   - Vous devriez être redirigé vers `/login`

## Dépannage

### Erreur: "PrismaClient is not configured"
- Vérifiez que `npx prisma generate` a été exécuté
- Vérifiez que `DATABASE_URL` est correct dans `.env`

### Erreur: "Invalid credentials"
- Vérifiez que les migrations ont été appliquées: `npx prisma migrate dev`
- Vérifiez la connection string Neon

### Erreur: "NEXTAUTH_SECRET is missing"
- Générez un secret avec `openssl rand -base64 32`
- Ajoutez-le dans `.env`

## Prochaines étapes

1. ✅ Authentification email/password
2. ✅ Authentification Google OAuth
3. ⏳ Validation email
4. ⏳ Réinitialisation de mot de passe
5. ⏳ Rate limiting
6. ⏳ 2FA (optionnel)




