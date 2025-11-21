/**
 * Configuration des cadres (frames) pour les QR codes
 * Liste de 30 motifs avec leurs métadonnées
 */

export interface FrameConfig {
  id: string
  name: string
  filename: string // Nom du fichier dans /public/frames/
  description: string
  category: 'shopping' | 'gift' | 'communication' | 'transport' | 'document' | 'decoration' | 'other'
  qrPosition?: {
    x: number // Position X en pourcentage (0-100)
    y: number // Position Y en pourcentage (0-100)
    width: number // Largeur en pourcentage (0-100)
    height: number // Hauteur en pourcentage (0-100)
  }
  defaultColor?: string // Couleur par défaut si le cadre supporte la coloration
  supportsColorChange?: boolean // Si le cadre peut changer de couleur
}

export const QR_FRAMES: FrameConfig[] = [
  // Shopping & Bags
  {
    id: 'bag-1',
    name: 'Sac à main',
    filename: 'bag-1.png',
    description: 'Sac à main élégant avec QR code',
    category: 'shopping',
    qrPosition: { x: 50, y: 50, width: 60, height: 60 },
    defaultColor: '#3B82F6',
    supportsColorChange: true,
  },
  {
    id: 'bag-2',
    name: 'Sac shopping',
    filename: 'bag-2.png',
    description: 'Sac de shopping avec poignée',
    category: 'shopping',
    qrPosition: { x: 50, y: 50, width: 65, height: 65 },
    defaultColor: '#8B5CF6',
    supportsColorChange: true,
  },
  {
    id: 'bag-3',
    name: 'Sac à dos',
    filename: 'bag-3.png',
    description: 'Sac à dos moderne',
    category: 'shopping',
    qrPosition: { x: 50, y: 45, width: 55, height: 55 },
    defaultColor: '#10B981',
    supportsColorChange: true,
  },
  {
    id: 'bag-4',
    name: 'Valise',
    filename: 'bag-4.png',
    description: 'Valise de voyage',
    category: 'shopping',
    qrPosition: { x: 50, y: 50, width: 50, height: 50 },
    defaultColor: '#6366F1',
    supportsColorChange: true,
  },

  // Gifts
  {
    id: 'gift-1',
    name: 'Cadeau simple',
    filename: 'gift-1.png',
    description: 'Boîte cadeau avec ruban',
    category: 'gift',
    qrPosition: { x: 50, y: 50, width: 70, height: 70 },
    defaultColor: '#EF4444',
    supportsColorChange: true,
  },
  {
    id: 'gift-2',
    name: 'Cadeau élégant',
    filename: 'gift-2.png',
    description: 'Cadeau avec grand ruban',
    category: 'gift',
    qrPosition: { x: 50, y: 45, width: 65, height: 65 },
    defaultColor: '#F59E0B',
    supportsColorChange: true,
  },
  {
    id: 'gift-3',
    name: 'Cadeau coloré',
    filename: 'gift-3.png',
    description: 'Boîte cadeau multicolore',
    category: 'gift',
    qrPosition: { x: 50, y: 50, width: 68, height: 68 },
    defaultColor: '#EC4899',
    supportsColorChange: true,
  },

  // Communication
  {
    id: 'envelope-1',
    name: 'Enveloppe fermée',
    filename: 'envelope-1.png',
    description: 'Enveloppe classique',
    category: 'communication',
    qrPosition: { x: 50, y: 50, width: 60, height: 60 },
    defaultColor: '#6B7280',
    supportsColorChange: true,
  },
  {
    id: 'envelope-2',
    name: 'Enveloppe ouverte',
    filename: 'envelope-2.png',
    description: 'Enveloppe avec lettre sortante',
    category: 'communication',
    qrPosition: { x: 50, y: 40, width: 55, height: 55 },
    defaultColor: '#3B82F6',
    supportsColorChange: true,
  },
  {
    id: 'bubble-1',
    name: 'Bulle de dialogue',
    filename: 'bubble-1.png',
    description: 'Bulle de conversation',
    category: 'communication',
    qrPosition: { x: 50, y: 50, width: 75, height: 75 },
    defaultColor: '#10B981',
    supportsColorChange: true,
  },
  {
    id: 'phone-1',
    name: 'Smartphone',
    filename: 'phone-1.png',
    description: 'Téléphone tenu en main',
    category: 'communication',
    qrPosition: { x: 50, y: 50, width: 50, height: 50 },
    defaultColor: '#000000',
    supportsColorChange: false,
  },

  // Transport
  {
    id: 'scooter-1',
    name: 'Scooter',
    filename: 'scooter-1.png',
    description: 'Scooter électrique',
    category: 'transport',
    qrPosition: { x: 50, y: 50, width: 45, height: 45 },
    defaultColor: '#F59E0B',
    supportsColorChange: true,
  },
  {
    id: 'scooter-2',
    name: 'Scooter moderne',
    filename: 'scooter-2.png',
    description: 'Scooter design moderne',
    category: 'transport',
    qrPosition: { x: 50, y: 50, width: 50, height: 50 },
    defaultColor: '#EF4444',
    supportsColorChange: true,
  },
  {
    id: 'car-1',
    name: 'Voiture',
    filename: 'car-1.png',
    description: 'Voiture avec QR code',
    category: 'transport',
    qrPosition: { x: 50, y: 50, width: 40, height: 40 },
    defaultColor: '#3B82F6',
    supportsColorChange: true,
  },

  // Documents
  {
    id: 'document-1',
    name: 'Document',
    filename: 'document-1.png',
    description: 'Document avec QR code',
    category: 'document',
    qrPosition: { x: 50, y: 50, width: 55, height: 55 },
    defaultColor: '#FFFFFF',
    supportsColorChange: false,
  },
  {
    id: 'document-2',
    name: 'Dossier',
    filename: 'document-2.png',
    description: 'Dossier de documents',
    category: 'document',
    qrPosition: { x: 50, y: 50, width: 50, height: 50 },
    defaultColor: '#6B7280',
    supportsColorChange: true,
  },
  {
    id: 'tag-1',
    name: 'Étiquette',
    filename: 'tag-1.png',
    description: 'Étiquette de prix',
    category: 'document',
    qrPosition: { x: 50, y: 50, width: 70, height: 70 },
    defaultColor: '#F59E0B',
    supportsColorChange: true,
  },
  {
    id: 'tag-2',
    name: 'Étiquette moderne',
    filename: 'tag-2.png',
    description: 'Étiquette design moderne',
    category: 'document',
    qrPosition: { x: 50, y: 50, width: 65, height: 65 },
    defaultColor: '#8B5CF6',
    supportsColorChange: true,
  },
  {
    id: 'badge-1',
    name: 'Badge',
    filename: 'badge-1.png',
    description: 'Badge circulaire',
    category: 'document',
    qrPosition: { x: 50, y: 50, width: 60, height: 60 },
    defaultColor: '#3B82F6',
    supportsColorChange: true,
  },
  {
    id: 'sticker-1',
    name: 'Autocollant',
    filename: 'sticker-1.png',
    description: 'Note autocollante',
    category: 'document',
    qrPosition: { x: 50, y: 50, width: 75, height: 75 },
    defaultColor: '#FCD34D',
    supportsColorChange: true,
  },

  // Decoration
  {
    id: 'banner-1',
    name: 'Bannière',
    filename: 'banner-1.png',
    description: 'Bannière pliée',
    category: 'decoration',
    qrPosition: { x: 50, y: 50, width: 60, height: 60 },
    defaultColor: '#EF4444',
    supportsColorChange: true,
  },
  {
    id: 'flag-1',
    name: 'Drapeau',
    filename: 'flag-1.png',
    description: 'Drapeau avec QR code',
    category: 'decoration',
    qrPosition: { x: 50, y: 50, width: 55, height: 55 },
    defaultColor: '#3B82F6',
    supportsColorChange: true,
  },
  {
    id: 'sign-1',
    name: 'Panneau',
    filename: 'sign-1.png',
    description: 'Panneau indicateur',
    category: 'decoration',
    qrPosition: { x: 50, y: 50, width: 65, height: 65 },
    defaultColor: '#10B981',
    supportsColorChange: true,
  },
  {
    id: 'bookmark-1',
    name: 'Signet',
    filename: 'bookmark-1.png',
    description: 'Signet de livre',
    category: 'decoration',
    qrPosition: { x: 50, y: 50, width: 60, height: 60 },
    defaultColor: '#8B5CF6',
    supportsColorChange: true,
  },
  {
    id: 'ribbon-1',
    name: 'Ruban',
    filename: 'ribbon-1.png',
    description: 'Ruban décoratif',
    category: 'decoration',
    qrPosition: { x: 50, y: 50, width: 70, height: 70 },
    defaultColor: '#EC4899',
    supportsColorChange: true,
  },

  // Other
  {
    id: 'hand-1',
    name: 'Main',
    filename: 'hand-1.png',
    description: 'Main tenant un QR code',
    category: 'other',
    qrPosition: { x: 50, y: 50, width: 50, height: 50 },
    defaultColor: '#F59E0B',
    supportsColorChange: false,
  },
  {
    id: 'circle-1',
    name: 'Cercle',
    filename: 'circle-1.png',
    description: 'Cadre circulaire simple',
    category: 'other',
    qrPosition: { x: 50, y: 50, width: 80, height: 80 },
    defaultColor: '#3B82F6',
    supportsColorChange: true,
  },
  {
    id: 'rounded-1',
    name: 'Rectangle arrondi',
    filename: 'rounded-1.png',
    description: 'Cadre rectangulaire arrondi',
    category: 'other',
    qrPosition: { x: 50, y: 50, width: 75, height: 75 },
    defaultColor: '#10B981',
    supportsColorChange: true,
  },
  {
    id: 'hexagon-1',
    name: 'Hexagone',
    filename: 'hexagon-1.png',
    description: 'Cadre hexagonal',
    category: 'other',
    qrPosition: { x: 50, y: 50, width: 70, height: 70 },
    defaultColor: '#8B5CF6',
    supportsColorChange: true,
  },
  {
    id: 'star-1',
    name: 'Étoile',
    filename: 'star-1.png',
    description: 'Cadre en forme d\'étoile',
    category: 'other',
    qrPosition: { x: 50, y: 50, width: 65, height: 65 },
    defaultColor: '#FCD34D',
    supportsColorChange: true,
  },
]

/**
 * Obtenir un cadre par son ID
 */
export function getFrameById(id: string): FrameConfig | undefined {
  return QR_FRAMES.find(frame => frame.id === id)
}

/**
 * Obtenir les cadres par catégorie
 */
export function getFramesByCategory(category: FrameConfig['category']): FrameConfig[] {
  return QR_FRAMES.filter(frame => frame.category === category)
}

/**
 * Obtenir toutes les catégories
 */
export function getCategories(): FrameConfig['category'][] {
  return Array.from(new Set(QR_FRAMES.map(frame => frame.category)))
}

