# Configuration ImageKit pour les QR codes

## Vue d'ensemble

ImageKit est utilisé pour stocker et servir les images de QR codes générées. Cela permet :
- Un stockage optimisé et performant
- Des transformations d'images à la volée
- Une meilleure performance globale

## Configuration

### 1. Créer un compte ImageKit

1. Allez sur [ImageKit.io](https://imagekit.io)
2. Créez un compte gratuit
3. Créez un nouveau Media Library

### 2. Obtenir les credentials

Dans le dashboard ImageKit, allez dans **Developer Options** et récupérez :
- **Public Key** : Clé publique pour l'authentification
- **Private Key** : Clé privée (à garder secrète)
- **URL Endpoint** : URL de votre endpoint ImageKit (ex: `https://ik.imagekit.io/your_imagekit_id`)

### 3. Configurer les variables d'environnement

Ajoutez dans votre fichier `.env` :

```env
# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=votre_public_key
IMAGEKIT_PRIVATE_KEY=votre_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

**Important** :
- Ne committez JAMAIS ces valeurs dans Git
- Utilisez des variables d'environnement sécurisées en production

### 4. Structure des dossiers ImageKit

Les QR codes sont stockés dans le dossier `/qrcodes` sur ImageKit avec les tags :
- `qrcode`
- `eventmaster`
- Type de QR code (`event`, `guest`, `custom`)

## Fonctionnalités

### Upload automatique
- Lors de la génération d'un QR code, l'image est automatiquement uploadée sur ImageKit
- En cas d'erreur ImageKit, le système utilise un fallback base64

### Prévisualisation
- Les QR codes sont affichés depuis ImageKit pour une meilleure performance
- Transformation automatique pour l'affichage (qualité optimisée)

### Téléchargement
- Téléchargement haute qualité (1024x1024px, qualité 100%)
- Support des redirections ImageKit et téléchargement direct

### Suppression
- Lors de la suppression d'un QR code, l'image est également supprimée d'ImageKit

## Utilisation

### Génération d'un QR code
1. Créez un QR code via le formulaire
2. L'image est automatiquement uploadée sur ImageKit
3. L'URL ImageKit est stockée dans la base de données

### Prévisualisation
1. Cliquez sur "Prévisualiser" dans le menu d'actions
2. Le QR code s'affiche en grand avec toutes les informations
3. Vous pouvez télécharger directement depuis la prévisualisation

### Téléchargement
1. Cliquez sur "Télécharger" dans le menu d'actions
2. Le QR code est téléchargé en haute qualité (PNG)

## Fallback

Si ImageKit n'est pas configuré ou en cas d'erreur :
- Le système utilise les images base64 stockées dans la base de données
- Toutes les fonctionnalités restent disponibles

## Notes de sécurité

- Les clés privées doivent rester secrètes
- Utilisez des variables d'environnement en production
- Configurez les permissions ImageKit pour limiter l'accès


