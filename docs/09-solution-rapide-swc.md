# Solution rapide - Problème SWC/Turbopack

## Problème
Next.js essaie d'utiliser Turbopack avec WASM mais `turbo.createProject` n'est pas supporté.

## Solution immédiate

### Option 1 : Démarrer sans Turbopack

Au lieu de `npm run dev`, utilisez :

```bash
npm run dev -- --no-turbo
```

Ou modifiez temporairement `package.json` :

```json
{
  "scripts": {
    "dev": "next dev --no-turbo"
  }
}
```

### Option 2 : Réinstaller proprement

```powershell
# 1. Arrêter le serveur (Ctrl+C)

# 2. Supprimer les modules corrompus
Remove-Item -Path "node_modules\@next" -Recurse -Force

# 3. Nettoyer le cache
npm cache clean --force

# 4. Réinstaller
npm install

# 5. Redémarrer
npm run dev
```

### Option 3 : Utiliser la version standard (sans Turbopack)

La configuration `next.config.mjs` a été mise à jour pour désactiver Turbopack.

Redémarrez simplement le serveur :

```bash
npm run dev
```

## Vérification

Si le serveur démarre sans erreurs SWC, c'est résolu ! ✅

## Note

Turbopack est encore en expérimentation. Si vous rencontrez des problèmes, utilisez le bundler standard de Next.js (Webpack) qui est plus stable.




