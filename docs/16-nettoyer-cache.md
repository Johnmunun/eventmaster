# Comment nettoyer le cache Next.js

## Méthode 1 : Supprimer le dossier .next (Recommandé)

### PowerShell
```powershell
Remove-Item -Recurse -Force .next
```

### CMD (Invite de commandes)
```cmd
rmdir /s /q .next
```

### Bash/Linux/Mac
```bash
rm -rf .next
```

## Méthode 2 : Nettoyer tout (cache + node_modules)

Si vous voulez tout nettoyer et réinstaller :

### PowerShell
```powershell
# Supprimer .next
Remove-Item -Recurse -Force .next

# Supprimer node_modules (optionnel)
Remove-Item -Recurse -Force node_modules

# Nettoyer le cache npm
npm cache clean --force

# Réinstaller les dépendances
npm install
```

## Méthode 3 : Script de nettoyage complet

Créez un fichier `clean.ps1` à la racine :

```powershell
Write-Host "Nettoyage du cache Next.js..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Write-Host "✓ Cache Next.js supprimé" -ForegroundColor Green

Write-Host "Nettoyage du cache npm..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "✓ Cache npm nettoyé" -ForegroundColor Green

Write-Host "Nettoyage terminé !" -ForegroundColor Green
```

Puis exécutez :
```powershell
.\clean.ps1
```

## Quand nettoyer le cache ?

- ✅ Après modification du fichier `.env`
- ✅ Après modification de `next.config.mjs`
- ✅ Après mise à jour de dépendances
- ✅ En cas d'erreurs inexpliquées
- ✅ Après changement de configuration Prisma

## Après le nettoyage

Redémarrez toujours le serveur :

```bash
npm run dev
```

## Note

Le dossier `.next` est recréé automatiquement au prochain démarrage. C'est normal !



