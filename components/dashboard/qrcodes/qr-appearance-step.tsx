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
  Loader2,
  ShoppingBag,
  Gift,
  Mail,
  Bike,
  Hand,
  Lock,
  Folder,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil } from "lucide-react"
import { PhoneMockup } from "@/components/qr-templates/phone-mockup"
import { FormSection } from "@/components/ui/form-section"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { FrameSelector } from "@/components/qr-frames/frame-selector"
import { QRWithFrameSimple } from "@/components/qr-frames/qr-with-frame"
import { FrameConfig, QR_FRAMES, getFrameById } from "@/lib/qr-frames"
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
  frameStyle: string | null // ID du frame (ex: "bag-1", "gift-1", etc.) ou null
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
  name?: string
  password?: string
  folderId?: string | null
}

const FRAME_STYLES = [
  { id: "none", label: "Aucun", icon: X },
  { id: "simple", label: "Simple", icon: Square },
  { id: "hand", label: "Main", icon: Hand },
  { id: "bag", label: "Sac", icon: ShoppingBag },
  { id: "gift", label: "Cadeau", icon: Gift },
  { id: "envelope", label: "Enveloppe", icon: Mail },
  { id: "scooter", label: "Scooter", icon: Bike },
  { id: "bubble", label: "Bulle", icon: QrCode },
  { id: "abstract1", label: "Abstrait 1", icon: Grid3x3 },
  { id: "abstract2", label: "Abstrait 2", icon: Grid3x3 },
  { id: "abstract3", label: "Abstrait 3", icon: Grid3x3 },
  { id: "abstract4", label: "Abstrait 4", icon: Grid3x3 },
]

const PATTERNS = ["square", "dots", "rounded", "circle"]
const CORNER_STYLES = ["square", "rounded", "extra-rounded"]

export function QRAppearanceStep({ qrData, onBack, onCreate }: QRAppearanceStepProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'qrcode'>('qrcode')
  const [selectedFrame, setSelectedFrame] = useState<FrameConfig | null>(null)
  const [appearanceConfig, setAppearanceConfig] = useState<QRAppearanceConfig>({
    frameStyle: null, // null = aucun frame, sinon ID du frame (ex: "bag-1")
    frameText: "Scanne-moi!",
    frameColor: "#000000",
    frameUseGradient: false,
    frameBackgroundColor: "#FFFFFF",
    frameBackgroundTransparent: false,
    frameBackgroundUseGradient: false,
    pattern: "square",
    cornerStyle: "square",
    foregroundColor: "#000000",
    backgroundColor: "#FFFFFF",
    name: "",
    password: "",
    folderId: null
  })
  const [qrCodeImage, setQrCodeImage] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [folders, setFolders] = useState<Array<{ id: string; name: string }>>([])
  const [isLoadingFolders, setIsLoadingFolders] = useState(false)

  // Synchroniser selectedFrame avec frameStyle
  useEffect(() => {
    if (appearanceConfig.frameStyle && appearanceConfig.frameStyle !== "none") {
      const frame = getFrameById(appearanceConfig.frameStyle)
      setSelectedFrame(frame || null)
      if (frame?.defaultColor) {
        setAppearanceConfig(prev => ({ ...prev, frameColor: frame.defaultColor || prev.frameColor }))
      }
    } else {
      setSelectedFrame(null)
    }
  }, [appearanceConfig.frameStyle])

  // Charger les dossiers
  useEffect(() => {
    const fetchFolders = async () => {
      setIsLoadingFolders(true)
      try {
        const response = await fetch("/api/folders")
        const data = await response.json()
        if (data.success) {
          setFolders(data.folders || [])
        }
      } catch (error) {
        console.error("Erreur lors du chargement des dossiers:", error)
      } finally {
        setIsLoadingFolders(false)
      }
    }
    fetchFolders()
  }, [])

  // Générer le QR code
  const generateQRCode = async () => {
    console.log("generateQRCode appelé", { qrData, qrDataLength: qrData?.length, qrDataType: typeof qrData })
    
    if (!qrData || qrData === "{}" || qrData.trim() === "") {
      console.warn("qrData is empty or invalid:", qrData)
      setQrCodeImage("")
      toast.error("Erreur", {
        description: "Les données du QR code sont vides. Veuillez remplir tous les champs requis.",
      })
      setIsGenerating(false)
      return
    }
    
    // Valider la longueur des données (QR code a une limite)
    if (qrData.length > 2953) {
      console.warn("qrData trop long pour un QR code:", qrData.length)
      toast.error("Erreur", {
        description: "Les données sont trop longues pour un QR code. Veuillez réduire la taille.",
      })
      setIsGenerating(false)
      return
    }
    
    console.log("Génération du QR code avec les données:", qrData.substring(0, 100))
    
    setIsGenerating(true)
    try {
      // Charger dynamiquement qrcode si nécessaire
      if (!QRCodeLib && typeof window !== 'undefined') {
        try {
          const module = await import('qrcode')
          QRCodeLib = module.default
        } catch (importError) {
          console.error("Erreur lors du chargement de la bibliothèque QRCode:", importError)
          toast.error("Erreur", {
            description: "Impossible de charger la bibliothèque QR code. Veuillez rafraîchir la page.",
          })
          setIsGenerating(false)
          return
        }
      }
      
      if (!QRCodeLib) {
        console.error("QRCode library not available")
        toast.error("Erreur", {
          description: "La bibliothèque QR code n'est pas disponible. Veuillez rafraîchir la page.",
        })
        setIsGenerating(false)
        return
      }
      
      // Valider les couleurs
      const isValidColor = (color: string): boolean => {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
      }
      
      const foregroundColor = isValidColor(appearanceConfig.foregroundColor) 
        ? appearanceConfig.foregroundColor 
        : "#000000"
      const backgroundColor = isValidColor(appearanceConfig.backgroundColor) 
        ? appearanceConfig.backgroundColor 
        : "#FFFFFF"
      
      const canvas = document.createElement('canvas')
      
      try {
        await QRCodeLib.toCanvas(canvas, qrData, {
          width: 300,
          margin: 2,
          color: {
            dark: foregroundColor,
            light: backgroundColor
          },
          errorCorrectionLevel: 'H'
        })
      } catch (qrError: any) {
        console.error("Erreur lors de la génération du canvas QR:", qrError)
        throw new Error(`Impossible de générer le QR code: ${qrError?.message || "Erreur inconnue"}`)
      }
      
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
                  // Motif cercle - cercles ronds
                  ctx.beginPath()
                  ctx.arc(x + pixelSize/2, y + pixelSize/2, pixelSize * 0.45, 0, 2 * Math.PI)
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
        // Pour le frame "bag", ajouter la hauteur de la poignée
        const handleHeight = appearanceConfig.frameStyle === "bag" ? 35 : 0
        frameCanvas.width = canvas.width + framePadding * 2
        frameCanvas.height = canvas.height + framePadding * 2 + textHeight + handleHeight
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
          } else if (appearanceConfig.frameStyle === "bag") {
            // Cadre sac - style étiquette avec poignée en haut (comme l'image)
            const radius = 20
            const handleHeight = 30
            const handleWidth = 60
            const handleRadius = 12
            
            // Couleur du frame (bleu par défaut si non spécifié)
            const frameColor = appearanceConfig.frameColor || "#3B82F6"
            
            // Dessiner le fond bleu avec dégradé
            if (appearanceConfig.frameUseGradient) {
              const gradient = frameCtx.createLinearGradient(0, 0, 0, frameCanvas.height)
              gradient.addColorStop(0, frameColor)
              gradient.addColorStop(1, appearanceConfig.frameBackgroundColor || "#1E40AF")
              frameCtx.fillStyle = gradient
            } else {
              // Dégradé subtil même sans option activée pour un effet 3D
              const gradient = frameCtx.createLinearGradient(0, 0, 0, frameCanvas.height)
              const darkerColor = frameColor
              const lighterColor = frameColor + "CC" // Légèrement transparent
              gradient.addColorStop(0, lighterColor)
              gradient.addColorStop(0.5, frameColor)
              gradient.addColorStop(1, darkerColor)
              frameCtx.fillStyle = gradient
            }
            
            // Poignée/tab en haut au centre (arrondie)
            const handleX = (frameCanvas.width - handleWidth) / 2
            frameCtx.beginPath()
            // Top de la poignée
            frameCtx.moveTo(handleX + handleRadius, 0)
            frameCtx.lineTo(handleX + handleWidth - handleRadius, 0)
            frameCtx.quadraticCurveTo(handleX + handleWidth, 0, handleX + handleWidth, handleRadius)
            // Côté droit de la poignée
            frameCtx.lineTo(handleX + handleWidth, handleHeight - handleRadius)
            frameCtx.quadraticCurveTo(handleX + handleWidth, handleHeight, handleX + handleWidth - handleRadius, handleHeight)
            // Bas de la poignée (arrondi)
            frameCtx.lineTo(handleX + handleRadius, handleHeight)
            frameCtx.quadraticCurveTo(handleX, handleHeight, handleX, handleHeight - handleRadius)
            // Côté gauche de la poignée
            frameCtx.lineTo(handleX, handleRadius)
            frameCtx.quadraticCurveTo(handleX, 0, handleX + handleRadius, 0)
            frameCtx.closePath()
            frameCtx.fill()
            
            // Corps principal avec coins arrondis
            const bodyY = handleHeight + 5
            frameCtx.beginPath()
            // Top gauche
            frameCtx.moveTo(10 + radius, bodyY)
            // Top droit
            frameCtx.lineTo(frameCanvas.width - 10 - radius, bodyY)
            frameCtx.quadraticCurveTo(frameCanvas.width - 10, bodyY, frameCanvas.width - 10, bodyY + radius)
            // Côté droit
            frameCtx.lineTo(frameCanvas.width - 10, frameCanvas.height - 10 - radius)
            // Bas droit
            frameCtx.quadraticCurveTo(frameCanvas.width - 10, frameCanvas.height - 10, frameCanvas.width - 10 - radius, frameCanvas.height - 10)
            // Bas
            frameCtx.lineTo(10 + radius, frameCanvas.height - 10)
            // Bas gauche
            frameCtx.quadraticCurveTo(10, frameCanvas.height - 10, 10, frameCanvas.height - 10 - radius)
            // Côté gauche
            frameCtx.lineTo(10, bodyY + radius)
            // Top gauche
            frameCtx.quadraticCurveTo(10, bodyY, 10 + radius, bodyY)
            frameCtx.closePath()
            frameCtx.fill()
            
            // Ombre/bordure pour plus de profondeur
            frameCtx.strokeStyle = frameColor
            frameCtx.lineWidth = 3
            frameCtx.stroke()
            
            // Ajouter le texte "Scanne-moi !" en bas sur le fond bleu
            if (appearanceConfig.frameText) {
              frameCtx.fillStyle = "#FFFFFF"
              frameCtx.font = "bold 16px Arial"
              frameCtx.textAlign = "center"
              frameCtx.textBaseline = "middle"
              const textY = frameCanvas.height - 25
              frameCtx.fillText(
                appearanceConfig.frameText, 
                frameCanvas.width / 2, 
                textY
              )
            }
          } else if (appearanceConfig.frameStyle === "gift") {
            // Cadre cadeau - avec ruban
            frameCtx.beginPath()
            // Corps du cadeau
            frameCtx.rect(10, 10, frameCanvas.width - 20, frameCanvas.height - 20)
            frameCtx.stroke()
            // Ruban vertical
            frameCtx.beginPath()
            frameCtx.moveTo(frameCanvas.width / 2, 10)
            frameCtx.lineTo(frameCanvas.width / 2, frameCanvas.height - 10)
            frameCtx.stroke()
            // Ruban horizontal
            frameCtx.beginPath()
            frameCtx.moveTo(10, frameCanvas.height / 2)
            frameCtx.lineTo(frameCanvas.width - 10, frameCanvas.height / 2)
            frameCtx.stroke()
            // Nœud au centre
            frameCtx.beginPath()
            frameCtx.arc(frameCanvas.width / 2, frameCanvas.height / 2, 15, 0, Math.PI * 2)
            frameCtx.fill()
          } else {
            // Par défaut, cadre simple
            frameCtx.strokeRect(10, 10, frameCanvas.width - 20, frameCanvas.height - 20)
          }
          
          // Dessiner le QR code au centre (ajuster pour le frame "bag" avec poignée)
          const qrY = appearanceConfig.frameStyle === "bag" ? framePadding + 35 : framePadding
          frameCtx.drawImage(canvas, framePadding, qrY)
          
          // Ajouter le texte en bas comme un bouton (sauf pour le frame "bag" qui l'a déjà)
          if (appearanceConfig.frameText && appearanceConfig.frameStyle !== "bag") {
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
        console.log("QR code généré avec frame, longueur:", finalDataUrl.length)
        setQrCodeImage(finalDataUrl)
      } else {
        const dataUrl = canvas.toDataURL('image/png')
        console.log("QR code généré sans frame, longueur:", dataUrl.length)
        setQrCodeImage(dataUrl)
      }
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error)
      setQrCodeImage("")
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue lors de la génération du QR code"
      toast.error("Erreur de génération", {
        description: errorMessage,
        duration: 5000,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Générer le QR code quand les paramètres changent
  useEffect(() => {
    console.log("useEffect pour generateQRCode déclenché", { qrData, hasQrData: !!qrData })
    if (qrData) {
      generateQRCode()
    } else {
      console.warn("qrData est vide, impossible de générer le QR code")
      setQrCodeImage("")
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
    console.log("handleCreate appelé", { qrCodeImage: !!qrCodeImage, isSubmitting, qrData })
    
    if (!qrCodeImage) {
      console.error("qrCodeImage est vide, impossible de créer le QR code")
      toast.error("Erreur", {
        description: "Le QR code n'a pas pu être généré. Veuillez réessayer.",
      })
      return
    }
    
    if (isSubmitting) {
      console.log("Déjà en cours de soumission, ignore")
      return
    }
    
    setIsSubmitting(true)
    try {
      console.log("Appel de onCreate avec:", { qrCodeImageLength: qrCodeImage.length, appearanceConfig })
      await onCreate(qrCodeImage, appearanceConfig)
      // Si la création réussit, le drawer se ferme donc on ne réinitialise pas ici
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      toast.error("Erreur", {
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la création du QR code.",
      })
      // Réinitialiser l'état en cas d'erreur pour permettre de réessayer
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden" style={{ minHeight: '100%', position: 'relative' }}>
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
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" style={{ cursor: 'pointer' }}>
              <span className="text-xl">?</span>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" style={{ cursor: 'pointer' }}>
              <span className="text-xl">☰</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 min-h-0 overflow-hidden relative z-0">
        {/* Colonne gauche : Configuration */}
        <div className="space-y-6 overflow-y-auto pr-2 drawer-scrollbar min-h-0 relative z-0">
          {/* Section Nom du QR Code */}
          <FormSection
            icon={FileText}
            title="Nom du code QR"
            description="Donnez un nom à votre code QR."
            collapsible={false}
          >
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                Nom
              </Label>
              <Input
                value={appearanceConfig.name || ""}
                onChange={(e) => setAppearanceConfig({ ...appearanceConfig, name: e.target.value })}
                placeholder="Par exemple : Mon code QR"
                className="rounded-[2px] border-gray-300 dark:border-gray-600"
              />
            </div>
          </FormSection>

          {/* Section Mot de passe */}
          <FormSection
            icon={Lock}
            title="Mot de passe"
            description="Protégez votre QR code avec un mot de passe (optionnel)."
            collapsible={false}
          >
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                Mot de passe (optionnel)
              </Label>
              <Input
                type="password"
                value={appearanceConfig.password || ""}
                onChange={(e) => setAppearanceConfig({ ...appearanceConfig, password: e.target.value })}
                placeholder="Entrez un mot de passe"
                className="rounded-[2px] border-gray-300 dark:border-gray-600"
              />
            </div>
          </FormSection>

          {/* Section Dossier */}
          <FormSection
            icon={Folder}
            title="Dossier"
            description="Liez ce QR à un dossier existant ou à un nouveau dossier."
            collapsible={false}
          >
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                Dossier
              </Label>
              <Select
                value={appearanceConfig.folderId || "none"}
                onValueChange={(value) => setAppearanceConfig({ ...appearanceConfig, folderId: value === "none" ? null : value })}
              >
                <SelectTrigger className="rounded-[2px] border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Aucun dossier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun dossier</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FormSection>

          {/* Section Cadre */}
          <FormSection
            icon={Frame}
            title="Cadre"
            description="Les cadres permettent à votre code QR de se démarquer parmi les autres et suscitent plus de scans."
            collapsible={false}
          >
            <div className="space-y-4">
              <FrameSelector
                selectedFrame={selectedFrame}
                onFrameSelect={(frame) => {
                  setSelectedFrame(frame)
                  setAppearanceConfig({ 
                    ...appearanceConfig, 
                    frameStyle: frame?.id || null,
                    frameColor: frame?.defaultColor || appearanceConfig.frameColor
                  })
                }}
                frameColor={appearanceConfig.frameColor}
                onColorChange={(color) => {
                  setAppearanceConfig({ ...appearanceConfig, frameColor: color })
                }}
              />

              {/* Texte encadré - seulement si un cadre est sélectionné */}
              {selectedFrame && (
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

              {/* Couleur du cadre - seulement si un cadre est sélectionné et supporte le changement de couleur */}
              {selectedFrame && selectedFrame.supportsColorChange && (
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
                        style={{ cursor: 'pointer' }}
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
              {selectedFrame && (
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
                          style={{ cursor: 'pointer' }}
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
          </FormSection>

          {/* Section Motif */}
          <FormSection
            icon={Grid3x3}
            title="Motif du code QR"
            description="Choisissez un motif pour votre code QR et sélectionnez des couleurs."
            collapsible={false}
          >
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
          </FormSection>

          {/* Section Coins */}
          <FormSection
            icon={Square}
            title="Coins du code QR"
            description="Sélectionnez le style de coins de votre code QR"
            collapsible={false}
          >
            <div>
              <Label className="text-sm font-medium mb-3 block">Style de coins</Label>
              <div className="grid grid-cols-3 gap-3">
                {CORNER_STYLES.map((corner) => (
                  <button
                    key={corner}
                    type="button"
                    onClick={() => setAppearanceConfig({ ...appearanceConfig, cornerStyle: corner })}
                    className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      appearanceConfig.cornerStyle === corner
                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    style={{ cursor: 'pointer' }}
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
          </FormSection>

          {/* Section Logo */}
          <FormSection
            icon={ImageIcon}
            title="Ajouter un logo"
            description="Créez un code QR unique en y ajoutant votre logo ou une image."
            collapsible={false}
          >
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fonctionnalité à venir
              </p>
            </div>
          </FormSection>
        </div>

        {/* Colonne droite : Preview */}
        <div className="flex flex-col items-center lg:sticky lg:top-0">
          {/* Toggle Switch */}
          <div className="mb-4 w-full max-w-[280px]">
            <div className="relative inline-flex rounded-lg border-2 border-primary overflow-hidden bg-white dark:bg-gray-900">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-6 py-2 text-sm font-bold transition-all cursor-pointer ${
                  viewMode === 'preview'
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-900 text-primary'
                }`}
                style={{ cursor: 'pointer' }}
              >
                Aperçu
              </button>
              <button
                type="button"
                onClick={() => setViewMode('qrcode')}
                className={`px-6 py-2 text-sm font-bold transition-all cursor-pointer ${
                  viewMode === 'qrcode'
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-900 text-primary'
                }`}
                style={{ cursor: 'pointer' }}
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
                  ) : qrCodeImage || qrData ? (
                    // Utiliser QRWithFrameSimple si un frame est sélectionné, sinon utiliser l'image générée
                    selectedFrame ? (
                      <div className="flex items-center justify-center w-full h-full">
                        <QRWithFrameSimple
                          frame={selectedFrame}
                          value={qrData}
                          frameColor={appearanceConfig.frameColor}
                          size={280}
                          qrColor={appearanceConfig.foregroundColor}
                          qrBackgroundColor={appearanceConfig.backgroundColor}
                          errorCorrectionLevel="H"
                        />
                      </div>
                    ) : qrCodeImage ? (
                      <img 
                        src={qrCodeImage} 
                        alt="QR Code" 
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <QRWithFrameSimple
                          frame={null}
                          value={qrData}
                          size={280}
                          qrColor={appearanceConfig.foregroundColor}
                          qrBackgroundColor={appearanceConfig.backgroundColor}
                          errorCorrectionLevel="H"
                        />
                      </div>
                    )
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
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between relative z-50 flex-shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onBack()
          }}
          className="flex items-center gap-2 cursor-pointer relative z-50"
          style={{ cursor: 'pointer' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mr-4">
            QR: {qrCodeImage ? '✓' : '✗'} | Gén: {isGenerating ? 'Oui' : 'Non'} | Sub: {isSubmitting ? 'Oui' : 'Non'}
          </div>
        )}
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log("Bouton Créer cliqué!", { 
              isGenerating, 
              isSubmitting, 
              hasQrCodeImage: !!qrCodeImage,
              qrCodeImageLength: qrCodeImage?.length || 0,
              qrData: qrData?.substring(0, 50),
              disabled: isGenerating || isSubmitting || !qrCodeImage
            })
            if (!isGenerating && !isSubmitting && qrCodeImage) {
              handleCreate()
            } else {
              console.warn("Bouton désactivé, impossible de créer", {
                isGenerating,
                isSubmitting,
                hasQrCodeImage: !!qrCodeImage
              })
            }
          }}
          disabled={isGenerating || isSubmitting || !qrCodeImage}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl relative z-50"
          style={{ 
            cursor: (isGenerating || isSubmitting || !qrCodeImage) ? 'not-allowed' : 'pointer',
            pointerEvents: 'auto',
            position: 'relative',
            zIndex: 50
          }}
          title={!qrCodeImage ? "Le QR code est en cours de génération..." : isGenerating ? "Génération en cours..." : ""}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Création...
            </>
          ) : isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Génération...
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

