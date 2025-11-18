# Solution définitive - Erreur connexion base de données

## Problème récurrent
```
Can't reach database server at ep-calm-bread-a4eavvjl-pooler.us-east-1.aws.neon.tech:5432
```

## Causes possibles

1. **Next.js ne charge pas le `.env`** au démarrage
2. **Le fichier `.env` est mal formaté** (espaces, guillemets, saut de ligne)
3. **Le serveur n'a pas été redémarré** après modification du `.env`
4. **Le cache Next.js** contient une ancienne version

## Solution complète (étape par étape)

### Étape 1 : Vérifier le fichier .env

Le fichier `.env` doit être à la racine du projet et contenir :

```env
DATABASE_URL=postgresql://neondb_owner:npg_bF6HwQJBRX0U@ep-calm-bread-a4eavvjl-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=Pq+UeRPs2sq7W9nsKr1PGr3Ppvu4c7GGEnk5Ijq+Eeo=
```

**Vérifications importantes** :
- ✅ Pas de guillemets autour de la valeur
- ✅ Pas d'espaces autour du `=`
- ✅ Pas de saut de ligne dans la connection string
- ✅ Le fichier se termine par une ligne vide

### Étape 2 : Arrêter complètement le serveur

1. Appuyez sur `Ctrl+C` dans le terminal où Next.js tourne
2. Attendez que le processus soit complètement arrêté

### Étape 3 : Supprimer le cache

```powershell
Remove-Item -Recurse -Force .next
```

### Étape 4 : Vérifier que la connection fonctionne

Testez directement avec Prisma :

```powershell
$env:DATABASE_URL = "postgresql://neondb_owner:npg_bF6HwQJBRX0U@ep-calm-bread-a4eavvjl-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
npx prisma db pull
```

Si ça fonctionne, la connection string est correcte.

### Étape 5 : Redémarrer le serveur

```bash
npm run dev
```

### Étape 6 : Vérifier dans la console

Au démarrage, vous devriez voir :
```
✅ DATABASE_URL loaded: Yes
```

Si vous voyez `No`, le problème vient du chargement du `.env`.

## Solution alternative : Utiliser dotenv explicitement

Si Next.js ne charge toujours pas le `.env`, installez et utilisez dotenv :

```bash
npm install dotenv
```

Puis dans `lib/db.ts`, ajoutez en haut :

```typescript
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })
```

## Vérification finale

1. Le serveur démarre sans erreur
2. La console affiche `✅ DATABASE_URL loaded: Yes`
3. L'inscription fonctionne
4. Les données sont sauvegardées dans la base

## Si le problème persiste

1. Vérifiez que votre base de données Neon est active
2. Vérifiez que l'IP n'est pas bloquée
3. Testez la connection depuis un autre outil (pgAdmin, DBeaver)
4. Vérifiez les logs Neon pour voir les tentatives de connexion



