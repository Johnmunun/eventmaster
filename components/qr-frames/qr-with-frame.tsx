"use client"

import { useEffect, useRef, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { FrameConfig } from "@/lib/qr-frames"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface QRWithFrameProps {
  frame: FrameConfig | null
  value: string // Les données du QR code
  frameColor?: string // Couleur du cadre (si supporté)
  size?: number // Taille du canvas final en pixels
  qrColor?: string // Couleur du QR code
  qrBackgroundColor?: string // Couleur de fond du QR code
  errorCorrectionLevel?: "L" | "M" | "Q" | "H"
}

export function QRWithFrame({
  frame,
  value,
  frameColor,
  size = 512,
  qrColor = "#000000",
  qrBackgroundColor = "#FFFFFF",
  errorCorrectionLevel = "H",
}: QRWithFrameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null)
  const [qrSvg, setQrSvg] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  // Charger l'image du cadre
  useEffect(() => {
    if (!frame) {
      setIsLoading(false)
      return
    }

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setFrameImage(img)
      setIsLoading(false)
    }
    img.onerror = () => {
      console.error(`Erreur lors du chargement du cadre: ${frame.filename}`)
      setIsLoading(false)
    }
    img.src = `/frames/${frame.filename}`
  }, [frame])

  // Générer le SVG du QR code
  useEffect(() => {
    if (!value) return

    // Créer un conteneur temporaire pour le QR code SVG
    const tempDiv = document.createElement("div")
    tempDiv.style.position = "absolute"
    tempDiv.style.visibility = "hidden"
    tempDiv.style.width = `${size}px`
    tempDiv.style.height = `${size}px`
    document.body.appendChild(tempDiv)

    // Calculer la taille du QR code basée sur la position dans le cadre
    const qrSize = frame?.qrPosition
      ? Math.min(
          (size * frame.qrPosition.width) / 100,
          (size * frame.qrPosition.height) / 100
        )
      : size * 0.7

    // Créer le QR code SVG
    const qrSvgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    qrSvgElement.setAttribute("width", `${qrSize}`)
    qrSvgElement.setAttribute("height", `${qrSize}`)
    qrSvgElement.setAttribute("viewBox", `0 0 ${qrSize} ${qrSize}`)

    // Utiliser react-qrcode via un composant temporaire
    import("qrcode.react").then((QRCode) => {
      const qrComponent = document.createElement("div")
      qrComponent.innerHTML = ""
      
      // Créer un canvas temporaire pour convertir le QR code en image
      const canvas = document.createElement("canvas")
      canvas.width = qrSize
      canvas.height = qrSize
      const ctx = canvas.getContext("2d")
      
      if (ctx) {
        // Remplir le fond
        ctx.fillStyle = qrBackgroundColor
        ctx.fillRect(0, 0, qrSize, qrSize)

        // Générer le QR code avec qrcode.react
        const qrSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${qrSize}" height="${qrSize}" viewBox="0 0 ${qrSize} ${qrSize}">
          <rect width="${qrSize}" height="${qrSize}" fill="${qrBackgroundColor}"/>
          ${generateQRCodeSVG(value, qrSize, qrColor, errorCorrectionLevel)}
        </svg>`

        // Convertir SVG en image
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
          setQrSvg(canvas.toDataURL("image/png"))
        }
        img.src = "data:image/svg+xml;base64," + btoa(qrSvgString)
      }

      document.body.removeChild(tempDiv)
    })
  }, [value, size, qrColor, qrBackgroundColor, errorCorrectionLevel, frame])

  // Dessiner le QR code avec le cadre sur le canvas
  useEffect(() => {
    if (!canvasRef.current || isLoading) return
    if (!frame || !frameImage) {
      // Pas de cadre, dessiner juste le QR code
      drawQRCodeOnly()
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    // Dessiner le cadre
    ctx.drawImage(frameImage, 0, 0, size, size)

    // Appliquer la couleur du cadre si supporté et si une couleur est fournie
    if (frame.supportsColorChange && frameColor) {
      ctx.globalCompositeOperation = "source-atop"
      ctx.fillStyle = frameColor
      ctx.fillRect(0, 0, size, size)
      ctx.globalCompositeOperation = "source-over"
    }

    // Dessiner le QR code à la position spécifiée
    if (qrSvg && frame.qrPosition) {
      const qrSize = Math.min(
        (size * frame.qrPosition.width) / 100,
        (size * frame.qrPosition.height) / 100
      )
      const x = (size * frame.qrPosition.x) / 100 - qrSize / 2
      const y = (size * frame.qrPosition.y) / 100 - qrSize / 2

      const qrImg = new Image()
      qrImg.onload = () => {
        ctx.drawImage(qrImg, x, y, qrSize, qrSize)
      }
      qrImg.src = qrSvg
    }
  }, [frame, frameImage, frameColor, qrSvg, size, isLoading])

  const drawQRCodeOnly = () => {
    if (!canvasRef.current || !qrSvg) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    const qrImg = new Image()
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 0, 0, size, size)
    }
    qrImg.src = qrSvg
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto"
        style={{ width: size, height: size }}
      />
    </div>
  )
}

// Fonction helper pour générer le SVG du QR code
function generateQRCodeSVG(
  value: string,
  size: number,
  color: string,
  errorCorrectionLevel: "L" | "M" | "Q" | "H"
): string {
  // Cette fonction sera remplacée par la vraie génération QR code
  // Pour l'instant, on utilise qrcode.react
  return ""
}

// Version simplifiée utilisant qrcode.react directement (recommandée)
export function QRWithFrameSimple({
  frame,
  value,
  frameColor,
  size = 512,
  qrColor = "#000000",
  qrBackgroundColor = "#FFFFFF",
  errorCorrectionLevel = "H",
}: QRWithFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [frameLoaded, setFrameLoaded] = useState(false)

  // Charger l'image du cadre
  useEffect(() => {
    if (!frame) {
      setIsLoading(false)
      return
    }

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setFrameLoaded(true)
      setIsLoading(false)
    }
    img.onerror = () => {
      console.error(`Erreur lors du chargement du cadre: ${frame.filename}`)
      setIsLoading(false)
    }
    img.src = `/frames/${frame.filename}`
  }, [frame])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!frame) {
    // Pas de cadre, afficher juste le QR code
    return (
      <div 
        ref={containerRef}
        className="inline-block bg-white p-4 rounded-lg"
        style={{ width: size, height: size }}
      >
        <QRCodeSVG
          value={value}
          size={size - 32}
          level={errorCorrectionLevel}
          fgColor={qrColor}
          bgColor={qrBackgroundColor}
        />
      </div>
    )
  }

  // Calculer la position et la taille du QR code
  const qrSize = frame.qrPosition
    ? Math.min(
        (size * frame.qrPosition.width) / 100,
        (size * frame.qrPosition.height) / 100
      )
    : size * 0.7

  const qrX = frame.qrPosition
    ? (size * frame.qrPosition.x) / 100 - qrSize / 2
    : size * 0.15
  const qrY = frame.qrPosition
    ? (size * frame.qrPosition.y) / 100 - qrSize / 2
    : size * 0.15

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      {/* Image du cadre */}
      <div className="absolute inset-0">
        <img
          src={`/frames/${frame.filename}`}
          alt={frame.name}
          className="w-full h-full object-contain"
          style={{
            filter: frame.supportsColorChange && frameColor
              ? createColorFilter(frameColor)
              : undefined,
          }}
          onError={(e) => {
            console.error(`Erreur lors du chargement de l'image: /frames/${frame.filename}`)
            const target = e.target as HTMLImageElement
            target.style.display = "none"
            // Afficher un message d'erreur
            const parent = target.parentElement
            if (parent) {
              parent.innerHTML = `<div class="flex items-center justify-center h-full text-xs text-red-500">Image non trouvée: ${frame.filename}</div>`
            }
          }}
          onLoad={() => {
            console.log(`Image chargée avec succès: /frames/${frame.filename}`)
          }}
        />
      </div>

      {/* QR code positionné au centre de la zone définie */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: `${qrX}px`,
          top: `${qrY}px`,
          width: `${qrSize}px`,
          height: `${qrSize}px`,
          backgroundColor: qrBackgroundColor,
          borderRadius: "4px",
        }}
      >
        <QRCodeSVG
          value={value}
          size={qrSize}
          level={errorCorrectionLevel}
          fgColor={qrColor}
          bgColor={qrBackgroundColor}
        />
      </div>
    </div>
  )
}

// Helper pour créer un filtre de couleur CSS
function createColorFilter(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return ""
  
  // Utiliser un filtre CSS pour changer la couleur
  // Cette approche fonctionne mieux avec des images en niveaux de gris
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255
  
  // Créer une matrice de couleur pour teinter l'image
  return `brightness(0) saturate(100%) invert(${1 - r}) sepia(100%) saturate(${g * 100}%) hue-rotate(${b * 360}deg)`
}

// Helper pour convertir hex en RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

