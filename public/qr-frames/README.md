# Frames pour QR Codes

Ce dossier contient les images de cadres (frames) utilisés pour personnaliser l'apparence des QR codes.

## Structure des fichiers

Chaque cadre doit être un fichier PNG ou SVG avec :
- **Zone transparente ou blanche au centre** pour afficher le QR code
- **Résolution recommandée** : 512x512 pixels minimum
- **Format** : PNG (avec transparence) ou SVG

## Liste des cadres requis

### Shopping & Bags
- `bag-1.png` - Sac à main
- `bag-2.png` - Sac shopping
- `bag-3.png` - Sac à dos
- `bag-4.png` - Valise

### Gifts
- `gift-1.png` - Cadeau simple
- `gift-2.png` - Cadeau élégant
- `gift-3.png` - Cadeau coloré

### Communication
- `envelope-1.png` - Enveloppe fermée
- `envelope-2.png` - Enveloppe ouverte
- `bubble-1.png` - Bulle de dialogue
- `phone-1.png` - Smartphone

### Transport
- `scooter-1.png` - Scooter
- `scooter-2.png` - Scooter moderne
- `car-1.png` - Voiture

### Documents
- `document-1.png` - Document
- `document-2.png` - Dossier
- `tag-1.png` - Étiquette
- `tag-2.png` - Étiquette moderne
- `badge-1.png` - Badge
- `sticker-1.png` - Autocollant

### Decoration
- `banner-1.png` - Bannière
- `flag-1.png` - Drapeau
- `sign-1.png` - Panneau
- `bookmark-1.png` - Signet
- `ribbon-1.png` - Ruban

### Other
- `hand-1.png` - Main
- `circle-1.png` - Cercle
- `rounded-1.png` - Rectangle arrondi
- `hexagon-1.png` - Hexagone
- `star-1.png` - Étoile

## Instructions pour créer vos propres cadres

1. **Créer l'image** avec un logiciel de design (Figma, Photoshop, Illustrator, etc.)
2. **Zone QR code** : Laisser une zone transparente ou blanche au centre (environ 60-70% de la taille totale)
3. **Exporter en PNG** avec transparence ou en SVG
4. **Nommer le fichier** selon la convention : `[category]-[number].png`
5. **Ajouter la configuration** dans `lib/qr-frames.ts` si c'est un nouveau cadre

## Position du QR code

La position du QR code dans le cadre est définie dans `lib/qr-frames.ts` avec les propriétés :
- `x` : Position horizontale en pourcentage (0-100)
- `y` : Position verticale en pourcentage (0-100)
- `width` : Largeur en pourcentage (0-100)
- `height` : Hauteur en pourcentage (0-100)

Par défaut, le QR code est centré à 50% x 50% avec une taille de 60-70% du cadre.

## Support de changement de couleur

Si votre cadre supporte le changement de couleur (images en niveaux de gris), définissez :
- `supportsColorChange: true` dans la configuration
- `defaultColor: "#HEXCOLOR"` pour la couleur par défaut

Les cadres colorés (photos, illustrations colorées) doivent avoir `supportsColorChange: false`.

