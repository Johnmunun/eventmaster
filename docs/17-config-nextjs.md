# Configuration Next.js - Erreurs courantes

## Erreur : Unrecognized key(s) in object: 'turbo'

### Problème
```
⚠ Invalid next.config.mjs options detected:
⚠     Unrecognized key(s) in object: 'turbo' at "experimental"
```

### Cause
La clé `turbo` dans `experimental` n'est pas une option valide dans Next.js 16. Cette configuration était utilisée pour désactiver Turbopack, mais ce n'est pas la bonne méthode.

### Solution

Supprimez la section `experimental.turbo` de votre `next.config.mjs` :

**Avant (incorrect)** :
```javascript
const nextConfig = {
  experimental: {
    turbo: undefined, // ❌ Non reconnu
  },
}
```

**Après (correct)** :
```javascript
const nextConfig = {
  // Pas besoin de section experimental pour désactiver Turbopack
}
```

### Désactiver Turbopack

Si vous voulez désactiver Turbopack, utilisez plutôt la ligne de commande :

**Avec Turbopack** (par défaut) :
```bash
npm run dev --turbo
```

**Sans Turbopack** (Webpack standard) :
```bash
npm run dev
```

Ou modifiez votre `package.json` :

```json
{
  "scripts": {
    "dev": "next dev"  // Sans --turbo
  }
}
```

## Autres erreurs de configuration courantes

### Erreur : Invalid `images` configuration

Si vous avez des problèmes avec les images :

```javascript
const nextConfig = {
  images: {
    unoptimized: true, // Pour le développement statique
  },
}
```

### Erreur : TypeScript build errors

Pour ignorer les erreurs TypeScript en développement :

```javascript
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ⚠️ À utiliser avec précaution
  },
}
```

**Note** : Il est préférable de corriger les erreurs TypeScript plutôt que de les ignorer.

## Vérification

Après modification, redémarrez le serveur :

```bash
npm run dev
```

L'avertissement devrait disparaître.



