# Résoudre le drift Prisma - Migrations existantes

## Problème

La base de données contient déjà des migrations qui ne sont pas dans votre répertoire local :
- `20251113124436_init`
- `20251113132957_add_profile_fields`

Prisma détecte un "drift" entre le schéma local et la base de données.

## Solutions

### Option 1 : Baseline (Recommandé - Préserve les données)

Marquer les migrations existantes comme appliquées sans les recréer :

```bash
# 1. Créer le dossier migrations
mkdir prisma\migrations

# 2. Créer un dossier pour la migration baseline
mkdir prisma\migrations\0_baseline

# 3. Créer un fichier migration.sql vide
echo. > prisma\migrations\0_baseline\migration.sql

# 4. Marquer comme résolu
npx dotenv -e .env -- npx prisma migrate resolve --applied 0_baseline
```

### Option 2 : Reset (Perte de données)

Si vous n'avez pas de données importantes à préserver :

```bash
npx dotenv -e .env -- npx prisma migrate reset
```

Puis créer les nouvelles migrations :

```bash
npx dotenv -e .env -- npx prisma migrate dev --name init
```

### Option 3 : Créer les migrations manquantes

Si vous voulez synchroniser avec les migrations existantes :

```bash
# 1. Créer le dossier migrations
mkdir prisma\migrations

# 2. Créer les dossiers pour les migrations existantes
mkdir prisma\migrations\20251113124436_init
mkdir prisma\migrations\20251113132957_add_profile_fields

# 3. Marquer comme appliquées
npx dotenv -e .env -- npx prisma migrate resolve --applied 20251113124436_init
npx dotenv -e .env -- npx prisma migrate resolve --applied 20251113132957_add_profile_fields
```

## Recommandation

Si vous avez des données importantes dans la base de données, utilisez l'**Option 1 (Baseline)**.

Si c'est une base de données de développement vide, utilisez l'**Option 2 (Reset)**.




