# Ajout du système de crédits - Migration Prisma

## Changements effectués

### 1. Schéma Prisma
Ajout du champ `credits` au modèle `User` :
```prisma
credits Int @default(0)
```

### 2. Route d'inscription
Les nouveaux utilisateurs reçoivent automatiquement **10 crédits** de bonus.

### 3. Popup de bonus
Un popup animé s'affiche après l'inscription pour annoncer le bonus.

## Migration nécessaire

Pour appliquer les changements à la base de données, exécutez :

```bash
npx dotenv -e .env -- npx prisma migrate dev --name add_credits_field
```

Ou si vous préférez créer la migration manuellement :

```bash
npx dotenv -e .env -- npx prisma migrate dev --create-only --name add_credits_field
```

Puis modifiez le fichier de migration créé dans `prisma/migrations/` pour ajouter :

```sql
ALTER TABLE "users" ADD COLUMN "credits" INTEGER NOT NULL DEFAULT 0;
```

## Vérification

Après la migration, vérifiez que le champ existe :

```bash
npx dotenv -e .env -- npx prisma studio
```

Ouvrez la table `users` et vérifiez que la colonne `credits` existe avec la valeur par défaut 0.

## Fonctionnalités

- ✅ Nouveaux utilisateurs reçoivent 10 crédits
- ✅ Popup animé de bienvenue
- ✅ Toast de confirmation
- ✅ Champ credits dans la base de données



