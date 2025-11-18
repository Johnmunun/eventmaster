# Commandes à exécuter dans le terminal

## 1. Installation des dépendances

```bash
npm install @prisma/client @auth/prisma-adapter bcryptjs next-auth@beta
npm install -D prisma @types/bcryptjs
```

## 2. Génération du client Prisma

```bash
npx prisma generate
```

## 3. Création de la base de données (migrations)

```bash
npx prisma migrate dev --name init
```

## 4. (Optionnel) Visualisation de la base de données

```bash
npx prisma studio
```

## 5. Démarrer le serveur de développement

```bash
npm run dev
```

## Ordre d'exécution recommandé

1. ✅ Installer les dépendances
2. ✅ Créer le fichier `.env` avec vos variables d'environnement
3. ✅ Générer le client Prisma
4. ✅ Créer les migrations
5. ✅ Démarrer le serveur

## Vérification

Après avoir exécuté toutes les commandes :

1. Ouvrez `http://localhost:3000`
2. Allez sur `/signup` pour créer un compte
3. Allez sur `/login` pour vous connecter
4. Accédez à `/dashboard` (devrait être protégé)

## En cas d'erreur

### Erreur Prisma
```bash
# Réinitialiser Prisma
npx prisma generate
npx prisma migrate reset
npx prisma migrate dev
```

### Erreur NextAuth
- Vérifiez que `NEXTAUTH_SECRET` est défini dans `.env`
- Vérifiez que `NEXTAUTH_URL` correspond à votre URL

### Erreur de connexion à la base de données
- Vérifiez votre `DATABASE_URL` dans `.env`
- Testez la connexion : `npx prisma db pull`




