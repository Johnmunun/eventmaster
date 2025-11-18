# Solution rapide - Erreur connexion base de données

## Problème
```
Can't reach database server at ep-calm-bread-a4eavvjl-pooler.us-east-1.aws.neon.tech:5432
```

## Solution immédiate

### Étape 1 : Vérifier le fichier .env

Le fichier `.env` doit être à la racine du projet et contenir :

```env
DATABASE_URL=postgresql://neondb_owner:npg_bF6HwQJBRX0U@ep-calm-bread-a4eavvjl-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Vérifiez** :
- Pas de guillemets
- Pas d'espaces autour du `=`
- Pas de saut de ligne dans la connection string

### Étape 2 : Redémarrer complètement le serveur

Next.js charge les variables d'environnement **uniquement au démarrage**. 

1. **Arrêtez le serveur** (Ctrl+C dans le terminal)
2. **Supprimez le cache Next.js** :
   ```bash
   Remove-Item -Recurse -Force .next
   ```
3. **Redémarrez le serveur** :
   ```bash
   npm run dev
   ```

### Étape 3 : Vérifier que ça fonctionne

Après le redémarrage, testez l'inscription. Si l'erreur persiste, vérifiez dans la console du serveur que `DATABASE_URL` est bien chargé.

## Si le problème persiste

### Option A : Vérifier le chargement des variables

Ajoutez temporairement dans `lib/db.ts` :

```typescript
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Défini' : 'NON DÉFINI')
```

Si ça affiche "NON DÉFINI", Next.js ne charge pas le `.env`.

### Option B : Utiliser dotenv explicitement

Installez dotenv :
```bash
npm install dotenv
```

Puis dans `lib/db.ts`, ajoutez en haut :
```typescript
import dotenv from 'dotenv'
dotenv.config()
```

## Note importante

Les **warnings sur les source maps** sont non-critiques et peuvent être ignorés. Ils n'affectent pas le fonctionnement de l'application.




