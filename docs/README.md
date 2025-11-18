# Documentation EventMaster - Backend

## 📚 Index de la documentation

1. [Setup Prisma avec Neon](./01-setup-prisma.md)
2. [Configuration NextAuth](./02-setup-nextauth.md)
3. [Routes API](./03-routes-api.md)
4. [Middleware de protection](./04-middleware.md)
5. [Variables d'environnement](./05-env-example.md)
6. [Guide d'installation complet](./06-installation-complete.md)

## 🚀 Démarrage rapide

### 1. Installation des dépendances

```bash
npm install @prisma/client @auth/prisma-adapter bcryptjs next-auth@beta
npm install -D prisma @types/bcryptjs
```

### 2. Configuration

1. Créez un compte Neon et récupérez votre connection string
2. Créez un fichier `.env` (voir [05-env-example.md](./05-env-example.md))
3. Générez le client Prisma : `npx prisma generate`
4. Créez la base de données : `npx prisma migrate dev --name init`

### 3. Fichiers à créer

Consultez les fichiers source dans le projet pour voir les implémentations complètes :
- `lib/auth.ts` - Configuration NextAuth
- `lib/db.ts` - Client Prisma
- `app/api/auth/[...nextauth]/route.ts` - Route NextAuth
- `app/api/auth/register/route.ts` - Route d'inscription
- `app/api/auth/login/route.ts` - Route de connexion
- `middleware.ts` - Protection des routes

## 🔒 Sécurité

- ✅ Mots de passe hashés avec bcrypt (10 rounds)
- ✅ Validation des données avec Zod
- ✅ Protection CSRF via NextAuth
- ✅ Sessions sécurisées
- ⏳ Rate limiting (à implémenter)
- ⏳ Validation email (à implémenter)

## 📝 Notes importantes

- Ne committez **JAMAIS** le fichier `.env`
- Utilisez des secrets forts pour `NEXTAUTH_SECRET`
- En production, configurez les variables d'environnement sur votre plateforme de déploiement
- Testez toujours en local avant de déployer

## 🆘 Support

En cas de problème, vérifiez :
1. Les variables d'environnement sont correctement configurées
2. La base de données est accessible
3. Les migrations ont été appliquées
4. Le client Prisma a été généré




