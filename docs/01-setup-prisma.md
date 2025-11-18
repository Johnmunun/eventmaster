# Configuration Prisma avec Neon

## 1. Installation des dépendances

```bash
npm install @prisma/client @auth/prisma-adapter bcryptjs
npm install -D prisma @types/bcryptjs
```

## 2. Configuration de la base de données Neon

1. Créez un compte sur [Neon](https://neon.tech)
2. Créez un nouveau projet
3. Copiez la connection string (format: `postgresql://user:password@host/database?sslmode=require`)

## 3. Génération du client Prisma

```bash
npx prisma generate
```

## 4. Création des migrations

```bash
npx prisma migrate dev --name init
```

## 5. (Optionnel) Visualisation de la base de données

```bash
npx prisma studio
```

## Variables d'environnement requises

Ajoutez dans votre fichier `.env` :

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```




