# Intégration du système de cadres QR Code

Ce document explique comment intégrer le système de cadres (frames) pour les QR codes dans votre application.

## Structure créée

```
public/frames/              # Dossier pour les images de cadres
lib/qr-frames.ts            # Configuration des 30 cadres
components/qr-frames/
  ├── qr-with-frame.tsx     # Composant pour afficher QR + cadre
  ├── frame-selector.tsx    # Sélecteur de cadre avec scroll horizontal
  └── qr-frame-integration-example.tsx  # Exemple d'intégration
lib/qr-download.ts          # Fonctions de téléchargement PNG
```

## Installation des dépendances

Les dépendances suivantes ont été installées :
- `qrcode.react` - Génération de QR codes React
- `html2canvas` - Conversion HTML en image pour téléchargement

## Liste des 30 cadres configurés

### Shopping & Bags (4)
- `bag-1.png` - Sac à main
- `bag-2.png` - Sac shopping
- `bag-3.png` - Sac à dos
- `bag-4.png` - Valise

### Gifts (3)
- `gift-1.png` - Cadeau simple
- `gift-2.png` - Cadeau élégant
- `gift-3.png` - Cadeau coloré

### Communication (4)
- `envelope-1.png` - Enveloppe fermée
- `envelope-2.png` - Enveloppe ouverte
- `bubble-1.png` - Bulle de dialogue
- `phone-1.png` - Smartphone

### Transport (3)
- `scooter-1.png` - Scooter
- `scooter-2.png` - Scooter moderne
- `car-1.png` - Voiture

### Documents (6)
- `document-1.png` - Document
- `document-2.png` - Dossier
- `tag-1.png` - Étiquette
- `tag-2.png` - Étiquette moderne
- `badge-1.png` - Badge
- `sticker-1.png` - Autocollant

### Decoration (5)
- `banner-1.png` - Bannière
- `flag-1.png` - Drapeau
- `sign-1.png` - Panneau
- `bookmark-1.png` - Signet
- `ribbon-1.png` - Ruban

### Other (5)
- `hand-1.png` - Main
- `circle-1.png` - Cercle
- `rounded-1.png` - Rectangle arrondi
- `hexagon-1.png` - Hexagone
- `star-1.png` - Étoile

## Ajouter les images de cadres

1. **Téléchargez ou créez** les 30 images de cadres
2. **Placez-les** dans `/public/frames/`
3. **Format requis** :
   - PNG avec transparence (recommandé)
   - SVG (également supporté)
   - Résolution minimale : 512x512 pixels
   - Zone transparente ou blanche au centre pour le QR code

## Utilisation dans votre composant

### Exemple basique

```tsx
import { QRWithFrameSimple } from "@/components/qr-frames/qr-with-frame"
import { FrameSelector } from "@/components/qr-frames/frame-selector"
import { FrameConfig } from "@/lib/qr-frames"
import { useState } from "react"

function MyQRComponent() {
  const [selectedFrame, setSelectedFrame] = useState<FrameConfig | null>(null)
  const [frameColor, setFrameColor] = useState("#000000")

  return (
    <div>
      {/* Sélecteur de cadre */}
      <FrameSelector
        selectedFrame={selectedFrame}
        onFrameSelect={setSelectedFrame}
        frameColor={frameColor}
        onColorChange={setFrameColor}
      />

      {/* Affichage du QR code avec cadre */}
      <QRWithFrameSimple
        frame={selectedFrame}
        value="https://example.com"
        frameColor={frameColor}
        size={512}
        qrColor="#000000"
        qrBackgroundColor="#FFFFFF"
      />
    </div>
  )
}
```

### Intégration complète avec téléchargement

Voir `components/qr-frames/qr-frame-integration-example.tsx` pour un exemple complet avec :
- Sélection de cadre
- Changement de couleur
- Personnalisation du QR code
- Téléchargement en PNG

## Propriétés du composant QRWithFrameSimple

```tsx
interface QRWithFrameProps {
  frame: FrameConfig | null        // Le cadre sélectionné (null = pas de cadre)
  value: string                     // Les données du QR code
  frameColor?: string              // Couleur du cadre (#HEX)
  size?: number                    // Taille en pixels (défaut: 512)
  qrColor?: string                 // Couleur du QR code (défaut: "#000000")
  qrBackgroundColor?: string       // Fond du QR code (défaut: "#FFFFFF")
  errorCorrectionLevel?: "L" | "M" | "Q" | "H"  // Niveau de correction (défaut: "H")
}
```

## Téléchargement en PNG

```tsx
import { downloadQRCodeFromContainer } from "@/lib/qr-download"
import { useRef } from "react"

function MyComponent() {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (containerRef.current) {
      await downloadQRCodeFromContainer(containerRef.current, "qrcode")
    }
  }

  return (
    <div ref={containerRef}>
      <QRWithFrameSimple frame={selectedFrame} value="..." />
      <button onClick={handleDownload}>Télécharger</button>
    </div>
  )
}
```

## Personnalisation des cadres

### Ajouter un nouveau cadre

1. **Ajouter l'image** dans `/public/frames/`
2. **Ajouter la configuration** dans `lib/qr-frames.ts` :

```tsx
{
  id: 'my-frame-1',
  name: 'Mon Cadre',
  filename: 'my-frame-1.png',
  description: 'Description du cadre',
  category: 'other',
  qrPosition: { x: 50, y: 50, width: 60, height: 60 },
  defaultColor: '#3B82F6',
  supportsColorChange: true,
}
```

### Position du QR code

La propriété `qrPosition` définit où placer le QR code dans le cadre :
- `x`, `y` : Position du centre en pourcentage (0-100)
- `width`, `height` : Taille en pourcentage (0-100)

Exemple : `{ x: 50, y: 50, width: 60, height: 60 }` centre le QR code à 50% et lui donne 60% de la taille du cadre.

## Notes importantes

1. **Images manquantes** : Si une image de cadre n'existe pas, le composant affichera un message d'erreur dans la console mais continuera de fonctionner.

2. **Changement de couleur** : Seuls les cadres avec `supportsColorChange: true` peuvent changer de couleur. Les cadres colorés (photos) ne supportent pas cette fonctionnalité.

3. **Performance** : Les images sont chargées à la demande. Pour de meilleures performances, préchargez les cadres fréquemment utilisés.

4. **Taille** : La taille recommandée est 512x512 pixels minimum. Des tailles plus grandes (1024x1024) donneront de meilleurs résultats pour le téléchargement.

## Prochaines étapes

1. Ajoutez les 30 images de cadres dans `/public/frames/`
2. Testez le composant avec différents cadres
3. Intégrez dans votre étape d'apparence QR code existante
4. Personnalisez les couleurs et positions selon vos besoins

