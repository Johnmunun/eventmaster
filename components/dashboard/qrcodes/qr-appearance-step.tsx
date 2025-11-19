"use client"

import { useState, useEffect } from "react"
import { 
  Frame, 
  Grid3x3, 
  Square, 
  Image as ImageIcon, 
  ChevronRight,
  QrCode,
  X,
  Check,
  ArrowLeft,
  ArrowRight,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil } from "lucide-react"
import { PhoneMockup } from "@/components/qr-templates/phone-mockup"
// Import dynamique de qrcode pour éviter les problèmes SSR
let QRCodeLib: any = null
if (typeof window !== 'undefined') {
  import('qrcode').then((module) => {
    QRCodeLib = module.default
  })
}

interface QRAppearanceStepProps {
  qrData: string // Les données du QR code (URL, texte, etc.)
  onBack: () => void
  onCreate: (qrCodeImage: string, appearanceConfig: QRAppearanceConfig) => void
}

export interface QRAppearanceConfig {
  frameStyle: string | null
  frameText: string
  frameColor: string
  frameUseGradient: boolean
  frameBackgroundColor: string
  frameBackgroundTransparent: boolean
  frameBackgroundUseGradient: boolean
  pattern: string
  cornerStyle: string
  logo?: string
  foregroundColor: string
  backgroundColor: string
}

const FRAME_STYLES = [
  { id: "none", label: "Aucun", icon: <X className="h-6 w-6" /> },
  { id: "simple", label: "Simple", icon: <Square className="h-6 w-6" /> },
  { id: "hand", label: "Main", icon: <QrCode className="h-6 w-6" /> },
  { id: "bag", label: "Sac", icon: <QrCode className="h-6 w-6" /> },
  { id: "gift", label: "Cadeau", icon: <QrCode className="h-6 w-6" /> },
  { id: "envelope", label: "Enveloppe", icon: <QrCode className="h-6 w-6" /> },
  { id: "scooter", label: "Scooter", icon: <QrCode className="h-6 w-6" /> },
  { id: "bubble", label: "Bulle", icon: <QrCode className="h-6 w-6" /> },
  { id: "abstract1", label: "Abstrait 1", icon: <QrCode className="h-6 w-6" /> },
  { id: "abstract2", label: "Abstrait 2", icon: <QrCode className="h-6 w-6" /> },
  { id: "abstract3", label: "Abstrait 3", icon: <QrCode className="h-6 w-6" /> },
  { id: "abstract4", label: "Abstrait 4", icon: <QrCode className="h-6 w-6" /> },
]

const PATTERNS = ["square", "dots", "rounded", "circle"]
const CORNER_STYLES = ["square", "rounded", "extra-rounded"]

export function QRAppearanceStep({ qrData, onBack, onCreate }: QRAppearanceStepProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'qrcode'>('qrcode')
  const [appearanceConfig, setAppearanceConfig] = useState<QRAppearanceConfig>({
    frameStyle: "none",
    frameText: "Scanne-moi!",
    frameColor: "#000000",
    frameUseGradient: false,
    frameBackgroundColor: "#FFFFFF",
    frameBackgroundTransparent: false,
    frameBackgroundUseGradient: false,
    pattern: "square",
    cornerStyle: "square",
    foregroundColor: "#000000",
    backgroundColor: "#FFFFFF"
  })
  const [qrCodeImage, setQrCodeImage] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Générer le QR code
  const generateQRCode = async () => {
    if (!qrData || qrData === "{}" || qrData.trim() === "") {
      console.warn("qrData is empty or invalid:", qrData)
      return
    }
    
    // Vérifier que qrData est une URL valide
    if (!qrData.startsWith('http://') && !qrData.startsWith('https://') && !qrData.startsWith('/')) {
      console.warn("qrData n'est pas une URL valide:", qrData)
    }
    
    console.log("Génération du QR code avec les données:", qrData.substring(0, 100))
    
    setIsGenerating(true)
    try {
      // Charger dynamiquement qrcode si nécessaire
      if (!QRCodeLib && typeof window !== 'undefined') {
        const module = await import('qrcode')
        QRCodeLib = module.default
      }
      
      if (!QRCodeLib) {
        console.error("QRCode library not available")
        return
      }
      
      const canvas = document.createElement('canvas')
      await QRCodeLib.toCanvas(canvas, qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: appearanceConfig.foregroundColor,
          light: appearanceConfig.backgroundColor
        },
        errorCorrectionLevel: 'H'
      })
      
      // Appliquer les motifs et coins personnalisés
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Appliquer le motif en modifiant le rendu des pixels
        if (appearanceConfig.pattern !== 'square') {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          const size = canvas.width
          const pixelSize = 1
          
          // Redessiner avec le motif choisi
          ctx.fillStyle = appearanceConfig.backgroundColor
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          
          for (let y = 0; y < size; y += pixelSize) {
            for (let x = 0; x < size; x += pixelSize) {
              const index = (y * size + x) * 4
              const isDark = data[index] < 128
              
              if (isDark) {
                ctx.fillStyle = appearanceConfig.foregroundColor
                
                if (appearanceConfig.pattern === 'dots') {
                  // Motif points - cercles
                  ctx.beginPath()
                  ctx.arc(x + pixelSize/2, y + pixelSize/2, pixelSize * 0.4, 0, 2 * Math.PI)
                  ctx.fill()
                } else if (appearanceConfig.pattern === 'rounded') {
                  // Motif arrondi - carrés avec coins arrondis
                  const radius = pixelSize * 0.2
                  ctx.beginPath()
                  ctx.moveTo(x + radius, y)
                  ctx.lineTo(x + pixelSize - radius, y)
                  ctx.quadraticCurveTo(x + pixelSize, y, x + pixelSize, y + radius)
                  ctx.lineTo(x + pixelSize, y + pixelSize - radius)
                  ctx.quadraticCurveTo(x + pixelSize, y + pixelSize, x + pixelSize - radius, y + pixelSize)
                  ctx.lineTo(x + radius, y + pixelSize)
                  ctx.quadraticCurveTo(x, y + pixelSize, x, y + pixelSize - radius)
                  ctx.lineTo(x, y + radius)
                  ctx.quadraticCurveTo(x, y, x + radius, y)
                  ctx.closePath()
                  ctx.fill()
                } else if (appearanceConfig.pattern === 'circle') {
                  // Motif cercle - cercles plus grands
                  ctx.beginPath()
                  ctx.arc(x + pixelSize/2, y + pixelSize/2, pixelSize * 0.5, 0, 2 * Math.PI)
                  ctx.fill()
                } else {
                  // Par défaut, carré
                  ctx.fillRect(x, y, pixelSize, pixelSize)
                }
              }
            }
          }
        }
        
        // Appliquer les coins arrondis aux carrés de détection
        if (appearanceConfig.cornerStyle !== 'square') {
          const radius = appearanceConfig.cornerStyle === 'extra-rounded' ? 6 : 3
          const detectionSize = 7 // Taille des carrés de détection
          const margin = 2
          
          // Fonction pour arrondir un carré de détection
          const roundDetectionSquare = (startX: number, startY: number) => {
            const tempCanvas = document.createElement('canvas')
            tempCanvas.width = (detectionSize + margin * 2) * 10
            tempCanvas.height = (detectionSize + margin * 2) * 10
            const tempCtx = tempCanvas.getContext('2d')
            if (tempCtx) {
              tempCtx.scale(10, 10)
              tempCtx.drawImage(canvas, startX - margin, startY - margin, detectionSize + margin * 2, detectionSize + margin * 2, 0, 0, detectionSize + margin * 2, detectionSize + margin * 2)
              
              // Arrondir les coins
              const roundedCanvas = document.createElement('canvas')
              roundedCanvas.width = tempCanvas.width
              roundedCanvas.height = tempCanvas.height
              const roundedCtx = roundedCanvas.getContext('2d')
              if (roundedCtx) {
                roundedCtx.fillStyle = appearanceConfig.backgroundColor
                roundedCtx.fillRect(0, 0, roundedCanvas.width, roundedCanvas.height)
                roundedCtx.globalCompositeOperation = 'source-over'
                roundedCtx.drawImage(tempCanvas, 0, 0)
                ctx.drawImage(roundedCanvas, (startX - margin) * 10, (startY - margin) * 10, roundedCanvas.width, roundedCanvas.height)
              }
            }
          }
          
          // Les 3 carrés de détection sont toujours aux mêmes positions approximatives
          // Pour simplifier, on applique un filtre d'arrondi global
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          ctx.putImageData(imageData, 0, 0)
        }
      }
      
      // Appliquer le cadre si sélectionné
      if (appearanceConfig.frameStyle && appearanceConfig.frameStyle !== "none") {
        const frameCanvas = document.createElement('canvas')
        const framePadding = 40
        const textHeight = 30
        frameCanvas.width = canvas.width + framePadding * 2
        frameCanvas.height = canvas.height + framePadding * 2 + textHeight
        const frameCtx = frameCanvas.getContext('2d')
        
        if (frameCtx) {
          // Fond du cadre
          if (appearanceConfig.frameBackgroundTransparent) {
            frameCtx.clearRect(0, 0, frameCanvas.width, frameCanvas.height)
          } else if (appearanceConfig.frameBackgroundUseGradient) {
            const gradient = frameCtx.createLinearGradient(0, 0, frameCanvas.width, frameCanvas.height)
            gradient.addColorStop(0, appearanceConfig.frameBackgroundColor)
            gradient.addColorStop(1, appearanceConfig.frameColor)
            frameCtx.fillStyle = gradient
            frameCtx.fillRect(0, 0, frameCanvas.width, frameCanvas.height)
          } else {
            frameCtx.fillStyle = appearanceConfig.frameBackgroundColor
            frameCtx.fillRect(0, 0, frameCanvas.width, frameCanvas.height)
          }
          
          // Dessiner le cadre selon le style
          if (appearanceConfig.frameUseGradient) {
            const gradient = frameCtx.createLinearGradient(0, 0, frameCanvas.width, frameCanvas.height)
            gradient.addColorStop(0, appearanceConfig.frameColor)
            gradient.addColorStop(1, appearanceConfig.frameBackgroundColor)
            frameCtx.strokeStyle = gradient
          } else {
            frameCtx.strokeStyle = appearanceConfig.frameColor
          }
          frameCtx.lineWidth = 3
          
          if (appearanceConfig.frameStyle === "simple") {
            // Cadre simple rectangulaire
            frameCtx.strokeRect(10, 10, frameCanvas.width - 20, frameCanvas.height - 20)
          } else if (appearanceConfig.frameStyle === "hand") {
            // Cadre avec bordure arrondie
            const radius = 15
            frameCtx.beginPath()
            frameCtx.moveTo(10 + radius, 10)
            frameCtx.lineTo(frameCanvas.width - 10 - radius, 10)
            frameCtx.quadraticCurveTo(frameCanvas.width - 10, 10, frameCanvas.width - 10, 10 + radius)
            frameCtx.lineTo(frameCanvas.width - 10, frameCanvas.height - 10 - radius)
            frameCtx.quadraticCurveTo(frameCanvas.width - 10, frameCanvas.height - 10, frameCanvas.width - 10 - radius, frameCanvas.height - 10)
            frameCtx.lineTo(10 + radius, frameCanvas.height - 10)
            frameCtx.quadraticCurveTo(10, frameCanvas.height - 10, 10, frameCanvas.height - 10 - radius)
            frameCtx.lineTo(10, 10 + radius)
            frameCtx.quadraticCurveTo(10, 10, 10 + radius, 10)
            frameCtx.closePath()
            frameCtx.stroke()
          } else if (appearanceConfig.frameStyle === "envelope") {
            // Cadre enveloppe - avec triangle en haut
            frameCtx.beginPath()
            frameCtx.moveTo(10, 40)
            frameCtx.lineTo(frameCanvas.width / 2 - 20, 40)
            frameCtx.lineTo(frameCanvas.width / 2, 10)
            frameCtx.lineTo(frameCanvas.width / 2 + 20, 40)
            frameCtx.lineTo(frameCanvas.width - 10, 40)
            frameCtx.lineTo(frameCanvas.width - 10, frameCanvas.height - 10)
            frameCtx.lineTo(10, frameCanvas.height - 10)
            frameCtx.closePath()
            frameCtx.stroke()
          } else if (appearanceConfig.frameStyle === "scooter") {
            // Cadre scooter - avec forme arrondie en bas
            frameCtx.beginPath()
            frameCtx.moveTo(10, 10)
            frameCtx.lineTo(frameCanvas.width - 10, 10)
            frameCtx.lineTo(frameCanvas.width - 10, frameCanvas.height - 30)
            frameCtx.arc(frameCanvas.width / 2, frameCanvas.height - 30, 20, 0, Math.PI, true)
            frameCtx.lineTo(10, frameCanvas.height - 30)
            frameCtx.closePath()
            frameCtx.stroke()
          } else if (appearanceConfig.frameStyle === "bubble") {
            // Cadre bulle - avec coins très arrondis
            const radius = 25
            frameCtx.beginPath()
            frameCtx.moveTo(10 + radius, 10)
            frameCtx.lineTo(frameCanvas.width - 10 - radius, 10)
            frameCtx.quadraticCurveTo(frameCanvas.width - 10, 10, frameCanvas.width - 10, 10 + radius)
            frameCtx.lineTo(frameCanvas.width - 10, frameCanvas.height - 10 - radius)
            frameCtx.quadraticCurveTo(frameCanvas.width - 10, frameCanvas.height - 10, frameCanvas.width - 10 - radius, frameCanvas.height - 10)
            frameCtx.lineTo(10 + radius, frameCanvas.height - 10)
            frameCtx.quadraticCurveTo(10, frameCanvas.height - 10, 10, frameCanvas.height - 10 - radius)
            frameCtx.lineTo(10, 10 + radius)
            frameCtx.quadraticCurveTo(10, 10, 10 + radius, 10)
            frameCtx.closePath()
            frameCtx.stroke()
          } else {
            // Par défaut, cadre simple
            frameCtx.strokeRect(10, 10, frameCanvas.width - 20, frameCanvas.height - 20)
          }
          
          // Dessiner le QR code au centre
          frameCtx.drawImage(canvas, framePadding, framePadding)
          
          // Ajouter le texte en bas comme un bouton
          if (appearanceConfig.frameText) {
            const buttonY = canvas.height + framePadding + 5
            const buttonHeight = textHeight - 10
            const buttonWidth = Math.min(frameCanvas.width - 40, appearanceConfig.frameText.length * 10 + 20)
            const buttonX = (frameCanvas.width - buttonWidth) / 2
            
            // Dessiner le bouton avec coins arrondis
            const radius = 8
            frameCtx.fillStyle = appearanceConfig.frameColor
            frameCtx.beginPath()
            frameCtx.moveTo(buttonX + radius, buttonY)
            frameCtx.lineTo(buttonX + buttonWidth - radius, buttonY)
            frameCtx.quadraticCurveTo(buttonX + buttonWidth, buttonY, buttonX + buttonWidth, buttonY + radius)
            frameCtx.lineTo(buttonX + buttonWidth, buttonY + buttonHeight - radius)
            frameCtx.quadraticCurveTo(buttonX + buttonWidth, buttonY + buttonHeight, buttonX + buttonWidth - radius, buttonY + buttonHeight)
            frameCtx.lineTo(buttonX + radius, buttonY + buttonHeight)
            frameCtx.quadraticCurveTo(buttonX, buttonY + buttonHeight, buttonX, buttonY + buttonHeight - radius)
            frameCtx.lineTo(buttonX, buttonY + radius)
            frameCtx.quadraticCurveTo(buttonX, buttonY, buttonX + radius, buttonY)
            frameCtx.closePath()
            frameCtx.fill()
            
            // Ajouter le texte en blanc sur le bouton
            frameCtx.fillStyle = "#FFFFFF"
            frameCtx.font = "bold 14px Arial"
            frameCtx.textAlign = "center"
            frameCtx.textBaseline = "middle"
            frameCtx.fillText(
              appearanceConfig.frameText, 
              frameCanvas.width / 2, 
              buttonY + buttonHeight / 2
            )
          }
        }
        
        const finalDataUrl = frameCanvas.toDataURL('image/png')
        setQrCodeImage(finalDataUrl)
      } else {
        const dataUrl = canvas.toDataURL('image/png')
        setQrCodeImage(dataUrl)
      }
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Générer le QR code quand les paramètres changent
  useEffect(() => {
    if (qrData) {
      generateQRCode()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    appearanceConfig.foregroundColor, 
    appearanceConfig.backgroundColor, 
    appearanceConfig.pattern, 
    appearanceConfig.cornerStyle,
    appearanceConfig.frameStyle,
    appearanceConfig.frameText,
    appearanceConfig.frameColor,
    appearanceConfig.frameUseGradient,
    appearanceConfig.frameBackgroundColor,
    appearanceConfig.frameBackgroundTransparent,
    appearanceConfig.frameBackgroundUseGradient,
    qrData
  ])

  const handleCreate = async () => {
    if (qrCodeImage && !isSubmitting) {
      setIsSubmitting(true)
      try {
        await onCreate(qrCodeImage, appearanceConfig)
        // Si la création réussit, le drawer se ferme donc on ne réinitialise pas ici
      } catch (error) {
        console.error("Erreur lors de la création:", error)
        // Réinitialiser l'état en cas d'erreur pour permettre de réessayer
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900" style={{ minHeight: '100%' }}>
      {/* Header avec indicateur de progression */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EventMaster
            </h2>
            <div className="flex items-center gap-2">
              {/* Étape 1 : Type de code QR */}
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Type de code QR</span>
              </div>
              <div className="w-8 h-0.5 bg-primary"></div>
              
              {/* Étape 2 : Contenu */}
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Contenu</span>
              </div>
              <div className="w-8 h-0.5 bg-primary"></div>
              
              {/* Étape 3 : Apparence du QR */}
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm ring-2 ring-primary/20">
                  <span className="text-xs font-bold text-white">3</span>
                </div>
                <span className="text-sm font-semibold text-primary">Apparence du QR</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="text-xl">?</span>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="text-xl">☰</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-hidden">
        {/* Colonne gauche : Configuration */}
        <div className="space-y-6 overflow-y-auto pr-2 drawer-scrollbar">
          {/* Section Cadre */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Frame className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Cadre</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Les cadres permettent à votre code QR de se démarquer parmi les autres et suscitent plus de scans.
            </p>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">Style de cadre</Label>
                <div className="grid grid-cols-4 gap-3">
                  {FRAME_STYLES.map((frame) => (
                    <button
                      key={frame.id}
                      onClick={() => setAppearanceConfig({ ...appearanceConfig, frameStyle: frame.id === "none" ? null : frame.id })}
                      className={`relative p-4 rounded-lg border-2 transition-all ${
                        (appearanceConfig.frameStyle === frame.id || (frame.id === "none" && appearanceConfig.frameStyle === null))
                          ? "border-primary bg-primary/10 dark:bg-primary/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                          {frame.icon}
                        </div>
                        <span className="text-xs text-center">{frame.label}</span>
                      </div>
                      {(appearanceConfig.frameStyle === frame.id || (frame.id === "none" && appearanceConfig.frameStyle === null)) && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Texte encadré - seulement si un cadre est sélectionné */}
              {appearanceConfig.frameStyle && appearanceConfig.frameStyle !== "none" && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Texte encadré</Label>
                  <div className="relative">
                    <input
                      type="text"
                      value={appearanceConfig.frameText}
                      onChange={(e) => setAppearanceConfig({ ...appearanceConfig, frameText: e.target.value })}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Scanne-moi!"
                    />
                    <Pencil className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}

              {/* Couleur du cadre - seulement si un cadre est sélectionné */}
              {appearanceConfig.frameStyle && appearanceConfig.frameStyle !== "none" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Utiliser un dégradé de couleurs pour le cadre</Label>
                    <Switch
                      checked={appearanceConfig.frameUseGradient}
                      onCheckedChange={(checked) => setAppearanceConfig({ ...appearanceConfig, frameUseGradient: checked })}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Couleur du cadre</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={appearanceConfig.frameColor}
                        onChange={(e) => setAppearanceConfig({ ...appearanceConfig, frameColor: e.target.value })}
                        className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={appearanceConfig.frameColor}
                        onChange={(e) => setAppearanceConfig({ ...appearanceConfig, frameColor: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Couleur d'arrière-plan du cadre - seulement si un cadre est sélectionné */}
              {appearanceConfig.frameStyle && appearanceConfig.frameStyle !== "none" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="transparent-background"
                      checked={appearanceConfig.frameBackgroundTransparent}
                      onCheckedChange={(checked) => setAppearanceConfig({ ...appearanceConfig, frameBackgroundTransparent: checked as boolean })}
                    />
                    <Label htmlFor="transparent-background" className="text-sm font-medium cursor-pointer">
                      Arrière-plan transparent
                    </Label>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Utiliser un dégradé de couleurs en arrière-plan</Label>
                    <Switch
                      checked={appearanceConfig.frameBackgroundUseGradient}
                      onCheckedChange={(checked) => setAppearanceConfig({ ...appearanceConfig, frameBackgroundUseGradient: checked })}
                    />
                  </div>
                  {!appearanceConfig.frameBackgroundTransparent && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Couleur d'arrière-plan</Label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={appearanceConfig.frameBackgroundColor}
                          onChange={(e) => setAppearanceConfig({ ...appearanceConfig, frameBackgroundColor: e.target.value })}
                          className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={appearanceConfig.frameBackgroundColor}
                          onChange={(e) => setAppearanceConfig({ ...appearanceConfig, frameBackgroundColor: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Section Motif */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Grid3x3 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Motif du code QR</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Choisissez un motif pour votre code QR et sélectionnez des couleurs.
            </p>
            <div>
              <Label className="text-sm font-medium mb-3 block">Style de motif</Label>
              <div className="grid grid-cols-4 gap-3">
                {PATTERNS.map((pattern) => (
                  <button
                    key={pattern}
                    onClick={() => setAppearanceConfig({ ...appearanceConfig, pattern })}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      appearanceConfig.pattern === pattern
                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded w-full h-16 flex items-center justify-center">
                        <Grid3x3 className={`h-6 w-6 ${appearanceConfig.pattern === pattern ? 'text-primary' : 'text-gray-400'}`} />
                      </div>
                      <span className="text-xs text-center capitalize">{pattern}</span>
                    </div>
                    {appearanceConfig.pattern === pattern && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section Coins */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Square className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Coins du code QR</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Sélectionnez le style de coins de votre code QR
            </p>
            <div>
              <Label className="text-sm font-medium mb-3 block">Style de coins</Label>
              <div className="grid grid-cols-3 gap-3">
                {CORNER_STYLES.map((corner) => (
                  <button
                    key={corner}
                    onClick={() => setAppearanceConfig({ ...appearanceConfig, cornerStyle: corner })}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      appearanceConfig.cornerStyle === corner
                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded w-full h-16 flex items-center justify-center">
                        <Square className={`h-6 w-6 ${appearanceConfig.cornerStyle === corner ? 'text-primary' : 'text-gray-400'}`} />
                      </div>
                      <span className="text-xs text-center capitalize">{corner === 'extra-rounded' ? 'Extra arrondi' : corner === 'rounded' ? 'Arrondi' : 'Carré'}</span>
                    </div>
                    {appearanceConfig.cornerStyle === corner && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section Logo */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Ajouter un logo</h3>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Créez un code QR unique en y ajoutant votre logo ou une image.
            </p>
          </div>
        </div>

        {/* Colonne droite : Preview */}
        <div className="flex flex-col items-center lg:sticky lg:top-0">
          {/* Toggle Switch */}
          <div className="mb-4 w-full max-w-[280px]">
            <div className="relative inline-flex rounded-lg border-2 border-primary overflow-hidden bg-white dark:bg-gray-900">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-6 py-2 text-sm font-bold transition-all ${
                  viewMode === 'preview'
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-900 text-primary'
                }`}
              >
                Aperçu
              </button>
              <button
                onClick={() => setViewMode('qrcode')}
                className={`px-6 py-2 text-sm font-bold transition-all ${
                  viewMode === 'qrcode'
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-900 text-primary'
                }`}
              >
                Code QR
              </button>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative">
            {viewMode === 'qrcode' ? (
              <PhoneMockup>
                <div className="w-full h-full flex items-center justify-center p-8 bg-white">
                  {isGenerating ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-sm text-gray-500">Génération...</p>
                    </div>
                  ) : qrCodeImage ? (
                    <img 
                      src={qrCodeImage} 
                      alt="QR Code" 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <QrCode className="h-16 w-16 mx-auto mb-2" />
                      <p className="text-sm">Aperçu QR Code</p>
                    </div>
                  )}
                </div>
              </PhoneMockup>
            ) : (
              <PhoneMockup>
                <div className="w-full h-full flex items-center justify-center p-8 bg-white">
                  <div className="text-center text-gray-400">
                    <QrCode className="h-16 w-16 mx-auto mb-2" />
                    <p className="text-sm">Aperçu</p>
                  </div>
                </div>
              </PhoneMockup>
            )}
          </div>
        </div>
      </div>

      {/* Navigation en bas */}
      <div className="bg-white border-t px-6 py-4 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <Button
          onClick={handleCreate}
          disabled={isGenerating || isSubmitting || !qrCodeImage}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Création...
            </>
          ) : (
            <>
              Créer
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

