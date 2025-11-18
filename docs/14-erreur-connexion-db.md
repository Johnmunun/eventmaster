# Erreur de connexion à la base de données

## Erreur
```
PrismaClientInitializationError: Can't reach database server
```

## Causes possibles

1. **Variable DATABASE_URL non chargée** par Next.js
2. **Connection string incorrecte** ou tronquée
3. **Serveur Neon inaccessible** (réseau, firewall)
4. **Cache Next.js** corrompu

## Solutions

### Solution 1 : Vérifier le fichier .env

Assurez-vous que le fichier `.env` est à la racine du projet et contient :

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

**Important** :
- Pas de guillemets autour de la valeur
- Pas d'espaces autour du `=`
- Pas de saut de ligne dans la connection string

### Solution 2 : Redémarrer le serveur

Next.js charge les variables d'environnement au démarrage. Après modification du `.env` :

1. Arrêtez le serveur (Ctrl+C)
2. Supprimez le cache : `Remove-Item -Recurse -Force .next`
3. Redémarrez : `npm run dev`

### Solution 3 : Vérifier la connection string

Testez la connection directement avec Prisma :

```bash
$env:DATABASE_URL = "votre-connection-string"
npx prisma db pull
```

Si ça fonctionne, le problème vient du chargement des variables par Next.js.

### Solution 4 : Vérifier l'accès au serveur Neon

1. Vérifiez que votre base de données Neon est active
2. Vérifiez que l'IP n'est pas bloquée par un firewall
3. Testez la connection depuis un autre outil (pgAdmin, DBeaver)

### Solution 5 : Utiliser dotenv explicitement

Si Next.js ne charge pas le `.env`, installez `dotenv` :

```bash
npm install dotenv
```

Puis dans vos routes API, chargez-le explicitement :

```typescript
import dotenv from 'dotenv'
dotenv.config()
```

## Vérification

Après avoir appliqué une solution, testez :

1. L'inscription fonctionne
2. La connexion fonctionne
3. Les données sont sauvegardées dans la base

## Note

Les warnings sur les source maps sont non-critiques et n'affectent pas le fonctionnement de l'application.




