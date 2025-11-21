# Instructions pour appliquer la migration manuellement

## Problème
L'enum `QrCodeType` dans PostgreSQL ne contient pas les valeurs `EMAIL`, `SMS`, `LOCATION`, `PHONE`, `BITCOIN`, et `EVENTBRITE`.

## Solution : Exécuter le SQL manuellement dans Neon

### Étapes :

1. **Ouvrir le dashboard Neon** : https://console.neon.tech

2. **Sélectionner votre projet** (EventMaster)

3. **Aller dans l'éditeur SQL** (onglet "SQL Editor" ou "Query")

4. **Copier et coller ce SQL** :

```sql
-- Ajouter les valeurs manquantes à l'enum QrCodeType
ALTER TYPE "QrCodeType" ADD VALUE IF NOT EXISTS 'EMAIL';
ALTER TYPE "QrCodeType" ADD VALUE IF NOT EXISTS 'SMS';
ALTER TYPE "QrCodeType" ADD VALUE IF NOT EXISTS 'LOCATION';
ALTER TYPE "QrCodeType" ADD VALUE IF NOT EXISTS 'PHONE';
ALTER TYPE "QrCodeType" ADD VALUE IF NOT EXISTS 'BITCOIN';
ALTER TYPE "QrCodeType" ADD VALUE IF NOT EXISTS 'EVENTBRITE';
```

5. **Exécuter le SQL** (bouton "Run" ou F5)

6. **Vérifier** que toutes les commandes ont réussi (vous devriez voir "Success" pour chaque ligne)

### Alternative : Via psql (si vous avez accès)

Si vous avez `psql` installé et que vous avez la connexion directe (sans pooler) :

```bash
psql "votre-connection-string-directe" -f prisma/add_missing_qr_code_types.sql
```

### Après l'exécution

Une fois le SQL exécuté, redémarrez votre serveur Next.js et l'erreur devrait être résolue.

