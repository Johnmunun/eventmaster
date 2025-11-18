# Solution rapide - Erreur JWT Secret

## Problème
```
JWTSessionError: no matching decryption secret
```

## Solution immédiate

### Étape 1 : Nettoyer les cookies

1. Ouvrez votre navigateur
2. Appuyez sur `F12` pour ouvrir les DevTools
3. Allez dans l'onglet **Application** (ou **Stockage**)
4. Cliquez sur **Cookies** > `http://localhost:3000`
5. Supprimez tous les cookies (surtout ceux commençant par `next-auth`)
6. Rechargez la page

### Étape 2 : Vérifier le .env

Assurez-vous que votre `.env` contient :

```env
NEXTAUTH_SECRET=Pq+UeRPs2sq7W9nsKr1PGr3Ppvu4c7GGEnk5Ijq+Eeo=
NEXTAUTH_URL=http://localhost:3000
```

**Important** : Pas de guillemets autour de la valeur !

### Étape 3 : Redémarrer le serveur

```bash
# Arrêter (Ctrl+C)
# Puis redémarrer
npm run dev
```

## Si le problème persiste

1. **Supprimer le cache Next.js** :
   ```bash
   Remove-Item -Recurse -Force .next
   npm run dev
   ```

2. **Vérifier que le secret est bien chargé** :
   - Le secret doit être d'au moins 32 caractères
   - Pas d'espaces avant/après le `=`

3. **Régénérer un nouveau secret** si nécessaire

## Note

Cette erreur survient généralement quand :
- Des cookies de session existent avec un ancien secret
- Le secret a changé depuis la dernière connexion
- Le serveur n'a pas été redémarré après modification du `.env`




