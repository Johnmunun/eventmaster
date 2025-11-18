# Dépannage - Problèmes SWC avec Next.js

## Problème rencontré

```
⚠ Attempted to load @next/swc-win32-x64-msvc, but an error occurred: 
   next-swc.win32-x64-msvc.node is not a valid Win32 application.

Error: `turbo.createProject` is not supported by the wasm bindings.
```

## Solutions

### Solution 1 : Réinstaller les dépendances SWC (Recommandé)

```bash
# Supprimer les modules SWC corrompus
Remove-Item -Path "node_modules\@next\swc-*" -Recurse -Force

# Réinstaller les dépendances
npm install
```

### Solution 2 : Nettoyer complètement et réinstaller

```bash
# Supprimer node_modules et lockfiles
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue

# Nettoyer le cache npm
npm cache clean --force

# Réinstaller
npm install
```

### Solution 3 : Désactiver Turbopack temporairement

Si vous utilisez Turbopack, essayez sans :

```bash
# Au lieu de : npm run dev --turbo
npm run dev
```

Ou modifiez `package.json` :

```json
{
  "scripts": {
    "dev": "next dev"
  }
}
```

### Solution 4 : Utiliser pnpm (si disponible)

```bash
# Supprimer node_modules
Remove-Item -Path "node_modules" -Recurse -Force

# Installer avec pnpm
pnpm install
pnpm dev
```

### Solution 5 : Vérifier l'architecture système

Assurez-vous que vous installez la bonne version pour votre système :

```bash
# Vérifier l'architecture
node -p "process.arch"
node -p "process.platform"

# Forcer la réinstallation pour votre plateforme
npm install @next/swc-win32-x64-msvc --force
```

### Solution 6 : Désactiver SWC et utiliser Babel (Dernier recours)

Créez un fichier `.babelrc` à la racine :

```json
{
  "presets": ["next/babel"]
}
```

Et modifiez `next.config.mjs` :

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  // ... autres configs
}

export default nextConfig
```

## Vérification

Après avoir appliqué une solution, vérifiez :

```bash
# Vérifier que les modules SWC sont installés
dir node_modules\@next\swc-*

# Tester le serveur
npm run dev
```

## Causes possibles

1. **Corruption des fichiers** : Installation interrompue ou espace disque insuffisant
2. **Architecture incompatible** : Version SWC incorrecte pour votre système
3. **Cache npm corrompu** : Cache npm contenant des fichiers invalides
4. **Conflit de versions** : Versions incompatibles entre Next.js et SWC

## Prévention

1. Toujours laisser `npm install` se terminer complètement
2. Vérifier l'espace disque disponible avant l'installation
3. Utiliser `npm ci` en production pour des installations propres
4. Garder Node.js à jour (version LTS recommandée)

## Support

Si le problème persiste après avoir essayé toutes les solutions :

1. Vérifiez votre version de Node.js : `node --version` (recommandé : 18.x ou 20.x LTS)
2. Vérifiez votre version de npm : `npm --version`
3. Consultez les issues GitHub de Next.js pour des problèmes similaires




