# Erreur JWT Secret - NextAuth

## Erreur
```
JWTSessionError: no matching decryption secret
```

## Causes possibles

1. **Cookies/sessions existantes** créées avec un autre `NEXTAUTH_SECRET`
2. **Secret non chargé** correctement par Next.js
3. **Format du secret** incorrect

## Solutions

### Solution 1 : Nettoyer les cookies (Recommandé)

1. Ouvrez les DevTools (F12)
2. Onglet "Application" > "Cookies"
3. Supprimez tous les cookies pour `localhost:3000`
4. Rechargez la page

### Solution 2 : Vérifier le format du secret

Le secret doit être :
- Au moins 32 caractères
- Sans guillemets dans le `.env`
- Format correct : `NEXTAUTH_SECRET=votre-secret-ici`

### Solution 3 : Régénérer le secret

Générez un nouveau secret :

```bash
# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Ou en ligne
# https://generate-secret.vercel.app/32
```

Puis mettez à jour le `.env` et redémarrez le serveur.

### Solution 4 : Forcer le rechargement

1. Arrêtez le serveur (Ctrl+C)
2. Supprimez le dossier `.next` : `Remove-Item -Recurse -Force .next`
3. Redémarrez : `npm run dev`

## Vérification

Après avoir appliqué une solution, vérifiez que :
- Le serveur démarre sans erreur JWT
- Vous pouvez vous connecter sans erreur
- Les sessions sont créées correctement




