"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import { FrameConfig } from "@/lib/qr-frames"

interface EditableQRMockupProps {
  qrData: string
  selectedFrame: FrameConfig | null
  frameColor?: string
  qrColor: string
  qrBackgroundColor: string
  qrCodeImage?: string
  editMode?: boolean
  // Positions initiales QR
  initialQrPosition?: { x: number; y: number }
  initialQrSize?: { width: number; height: number }
  initialQrCrop?: { x: number; y: number; width: number; height: number }
  // Positions initiales Frame
  initialFramePosition?: { x: number; y: number }
  initialFrameSize?: { width: number; height: number }
  initialFrameCrop?: { x: number; y: number; width: number; height: number }
  // Callbacks QR
  onQrPositionChange?: (position: { x: number; y: number }) => void
  onQrSizeChange?: (size: { width: number; height: number }) => void
  onQrCropChange?: (crop: { x: number; y: number; width: number; height: number }) => void
  // Callbacks Frame
  onFramePositionChange?: (position: { x: number; y: number }) => void
  onFrameSizeChange?: (size: { width: number; height: number }) => void
  onFrameCropChange?: (crop: { x: number; y: number; width: number; height: number }) => void
}

// Composant réutilisable pour un élément éditable (QR ou Frame)
function EditableElement({
  children,
  editMode,
  initialPosition = { x: 50, y: 50 },
  initialSize = { width: 80, height: 80 },
  initialCrop = { x: 0, y: 0, width: 100, height: 100 },
  onPositionChange,
  onSizeChange,
  onCropChange,
  borderColor = "border-primary",
  label = "",
  containerRef,
}: {
  children: React.ReactNode
  editMode: boolean
  initialPosition?: { x: number; y: number }
  initialSize?: { width: number; height: number }
  initialCrop?: { x: number; y: number; width: number; height: number }
  onPositionChange?: (position: { x: number; y: number }) => void
  onSizeChange?: (size: { width: number; height: number }) => void
  onCropChange?: (crop: { x: number; y: number; width: number; height: number }) => void
  borderColor?: string
  label?: string
  containerRef: React.RefObject<HTMLDivElement>
}) {
  const [position, setPosition] = useState(initialPosition)
  const [size, setSize] = useState(initialSize)
  const [crop, setCrop] = useState(initialCrop)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState<{ width: number; height: number; x: number; y: number }>({ width: 0, height: 0, x: 0, y: 0 })
  const elementRef = useRef<HTMLDivElement>(null)

  // Synchroniser avec les valeurs externes
  useEffect(() => {
    setPosition(initialPosition)
    setSize(initialSize)
    setCrop(initialCrop)
  }, [initialPosition, initialSize, initialCrop])

  // Calculer les valeurs en pixels
  const getPixelValues = useCallback(() => {
    if (!containerRef.current) return { x: 0, y: 0, width: 280, height: 280 }
    const container = containerRef.current
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    return {
      x: (position.x / 100) * containerWidth,
      y: (position.y / 100) * containerHeight,
      width: (size.width / 100) * containerWidth,
      height: (size.height / 100) * containerHeight,
    }
  }, [position, size])

  // Gérer le drag (souris et tactile)
  const handleStart = useCallback((clientX: number, clientY: number) => {
    if (!editMode) return
    
    const pixelValues = getPixelValues()
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    setIsDragging(true)
    setDragStart({
      x: clientX - (rect.left + pixelValues.x),
      y: clientY - (rect.top + pixelValues.y),
    })
  }, [editMode, getPixelValues])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('.resize-handle')) return
    
    e.preventDefault()
    e.stopPropagation()
    handleStart(e.clientX, e.clientY)
  }, [handleStart])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('.resize-handle')) return
    
    e.preventDefault()
    e.stopPropagation()
    const touch = e.touches[0]
    if (touch) {
      handleStart(touch.clientX, touch.clientY)
    }
  }, [handleStart])

  // Gérer le mouvement (souris et tactile)
  useEffect(() => {
    if (!editMode || (!isDragging && !isResizing)) return

    const handleMove = (clientX: number, clientY: number, shiftKey: boolean = false) => {
      if (!containerRef.current) return
      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight

      if (isDragging) {
        const relativeX = clientX - rect.left
        const relativeY = clientY - rect.top
        
        let newX = ((relativeX - dragStart.x) / containerWidth) * 100
        let newY = ((relativeY - dragStart.y) / containerHeight) * 100

        // Permettre un agrandissement beaucoup plus important - espace de déplacement étendu
        // Permettre de déplacer même si l'élément dépasse largement du conteneur
        // Limites étendues pour permettre un déplacement sur une zone beaucoup plus grande
        const maxX = 100 + size.width / 2 + 400 // Permet de déplacer jusqu'à 400% au-delà
        const maxY = 100 + size.height / 2 + 400
        const minX = -size.width / 2 - 400 // Permet de déplacer jusqu'à 400% avant
        const minY = -size.height / 2 - 400
        
        newX = Math.max(minX, Math.min(maxX, newX))
        newY = Math.max(minY, Math.min(maxY, newY))

        setPosition({ x: newX, y: newY })
        onPositionChange?.({ x: newX, y: newY })
      } else if (isResizing && resizeStart.x !== 0 && resizeStart.y !== 0) {
        const oppositeX = resizeStart.x
        const oppositeY = resizeStart.y
        
        const deltaX = clientX - oppositeX
        const deltaY = clientY - oppositeY
        
        let newWidth = (Math.abs(deltaX) / containerWidth) * 100
        let newHeight = (Math.abs(deltaY) / containerHeight) * 100

        // Permettre un agrandissement beaucoup plus important (jusqu'à 500% du conteneur)
        newWidth = Math.max(5, Math.min(500, newWidth))
        newHeight = Math.max(5, Math.min(500, newHeight))

        if (shiftKey) {
          const minSize = Math.min(newWidth, newHeight)
          newWidth = minSize
          newHeight = minSize
        }

        setSize({ width: newWidth, height: newHeight })
        onSizeChange?.({ width: newWidth, height: newHeight })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY, e.shiftKey)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      if (touch) {
        handleMove(touch.clientX, touch.clientY, false)
      }
    }

    const handleEnd = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [editMode, isDragging, isResizing, dragStart, resizeStart, size, onPositionChange, onSizeChange])

  const handleResizeStart = useCallback((clientX: number, clientY: number, oppositeX: number, oppositeY: number) => {
    setIsResizing(true)
    setResizeStart({
      width: size.width,
      height: size.height,
      x: oppositeX,
      y: oppositeY,
    })
  }, [size])

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, oppositeX: number, oppositeY: number) => {
    e.preventDefault()
    e.stopPropagation()
    handleResizeStart(e.clientX, e.clientY, oppositeX, oppositeY)
  }, [handleResizeStart])

  const handleResizeTouchStart = useCallback((e: React.TouchEvent, oppositeX: number, oppositeY: number) => {
    e.preventDefault()
    e.stopPropagation()
    const touch = e.touches[0]
    if (touch) {
      handleResizeStart(touch.clientX, touch.clientY, oppositeX, oppositeY)
    }
  }, [handleResizeStart])

  const handleReset = () => {
    setPosition({ x: 50, y: 50 })
    setSize({ width: 80, height: 80 })
    setCrop({ x: 0, y: 0, width: 100, height: 100 })
    onPositionChange?.({ x: 50, y: 50 })
    onSizeChange?.({ width: 80, height: 80 })
    onCropChange?.({ x: 0, y: 0, width: 100, height: 100 })
  }

  const pixelValues = getPixelValues()

  return (
    <div className="absolute inset-0">
      <div
        ref={elementRef}
        className={`absolute ${editMode ? `cursor-move border-2 border-dashed ${borderColor}` : ""}`}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          width: `${size.width}%`,
          height: `${size.height}%`,
          transform: "translate(-50%, -50%)",
          transition: editMode && !isDragging && !isResizing ? "none" : "all 0.2s",
          zIndex: editMode ? 30 : 10,
          touchAction: editMode ? "none" : "auto", // Empêcher le scroll pendant l'édition
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Contenu avec recadrage */}
        <div
          className="w-full h-full overflow-hidden"
          style={{
            clipPath: editMode
              ? `inset(${crop.y}% ${100 - crop.x - crop.width}% ${100 - crop.y - crop.height}% ${crop.x}%)`
              : "none",
          }}
        >
          {children}
        </div>

        {/* Poignées de redimensionnement */}
        {editMode && (
          <>
            <div
              className="resize-handle absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-primary rounded-tl-full cursor-nw-resize border-2 border-white shadow-lg hover:bg-primary/80 active:bg-primary/90 z-40 touch-none"
              style={{ transform: "translate(50%, 50%)" }}
              onMouseDown={(e) => {
                const container = containerRef.current
                if (!container) return
                const rect = container.getBoundingClientRect()
                const pixelValues = getPixelValues()
                const oppositeX = rect.left + pixelValues.x
                const oppositeY = rect.top + pixelValues.y
                handleResizeMouseDown(e, oppositeX, oppositeY)
              }}
              onTouchStart={(e) => {
                const container = containerRef.current
                if (!container) return
                const rect = container.getBoundingClientRect()
                const pixelValues = getPixelValues()
                const oppositeX = rect.left + pixelValues.x
                const oppositeY = rect.top + pixelValues.y
                handleResizeTouchStart(e, oppositeX, oppositeY)
              }}
            />
            <div
              className="resize-handle absolute top-0 left-0 w-6 h-6 md:w-8 md:h-8 bg-primary/70 rounded-br-full cursor-nw-resize border-2 border-white shadow-md hover:bg-primary/90 active:bg-primary z-40 touch-none"
              style={{ transform: "translate(-50%, -50%)" }}
              onMouseDown={(e) => {
                const container = containerRef.current
                if (!container) return
                const rect = container.getBoundingClientRect()
                const pixelValues = getPixelValues()
                const oppositeX = rect.left + pixelValues.x + pixelValues.width
                const oppositeY = rect.top + pixelValues.y + pixelValues.height
                handleResizeMouseDown(e, oppositeX, oppositeY)
              }}
              onTouchStart={(e) => {
                const container = containerRef.current
                if (!container) return
                const rect = container.getBoundingClientRect()
                const pixelValues = getPixelValues()
                const oppositeX = rect.left + pixelValues.x + pixelValues.width
                const oppositeY = rect.top + pixelValues.y + pixelValues.height
                handleResizeTouchStart(e, oppositeX, oppositeY)
              }}
            />
            <div
              className="resize-handle absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 bg-primary/70 rounded-bl-full cursor-ne-resize border-2 border-white shadow-md hover:bg-primary/90 active:bg-primary z-40 touch-none"
              style={{ transform: "translate(50%, -50%)" }}
              onMouseDown={(e) => {
                const container = containerRef.current
                if (!container) return
                const rect = container.getBoundingClientRect()
                const pixelValues = getPixelValues()
                const oppositeX = rect.left + pixelValues.x
                const oppositeY = rect.top + pixelValues.y + pixelValues.height
                handleResizeMouseDown(e, oppositeX, oppositeY)
              }}
              onTouchStart={(e) => {
                const container = containerRef.current
                if (!container) return
                const rect = container.getBoundingClientRect()
                const pixelValues = getPixelValues()
                const oppositeX = rect.left + pixelValues.x
                const oppositeY = rect.top + pixelValues.y + pixelValues.height
                handleResizeTouchStart(e, oppositeX, oppositeY)
              }}
            />
            <div
              className="resize-handle absolute bottom-0 left-0 w-6 h-6 md:w-8 md:h-8 bg-primary/70 rounded-tr-full cursor-sw-resize border-2 border-white shadow-md hover:bg-primary/90 active:bg-primary z-40 touch-none"
              style={{ transform: "translate(-50%, 50%)" }}
              onMouseDown={(e) => {
                const container = containerRef.current
                if (!container) return
                const rect = container.getBoundingClientRect()
                const pixelValues = getPixelValues()
                const oppositeX = rect.left + pixelValues.x + pixelValues.width
                const oppositeY = rect.top + pixelValues.y
                handleResizeMouseDown(e, oppositeX, oppositeY)
              }}
              onTouchStart={(e) => {
                const container = containerRef.current
                if (!container) return
                const rect = container.getBoundingClientRect()
                const pixelValues = getPixelValues()
                const oppositeX = rect.left + pixelValues.x + pixelValues.width
                const oppositeY = rect.top + pixelValues.y
                handleResizeTouchStart(e, oppositeX, oppositeY)
              }}
            />
          </>
        )}

        {/* Label en mode édition */}
        {editMode && label && (
          <div className={`absolute -top-6 left-0 text-xs px-2 py-1 rounded ${borderColor.replace('border-', 'bg-')} text-white text-center whitespace-nowrap shadow-md z-50`}>
            {label}
          </div>
        )}

        {/* Info position/taille - Amélioré pour mobile */}
        {editMode && (
          <div className="absolute -bottom-8 left-0 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg z-50">
            <div className="flex flex-col gap-0.5">
              <span>Pos: {position.x.toFixed(0)}%, {position.y.toFixed(0)}%</span>
              <span>Taille: {size.width.toFixed(0)}% × {size.height.toFixed(0)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function EditableQRMockup({
  qrData,
  selectedFrame,
  frameColor,
  qrColor,
  qrBackgroundColor,
  qrCodeImage,
  editMode: externalEditMode = false,
  initialQrPosition = { x: 50, y: 50 },
  initialQrSize = { width: 60, height: 60 },
  initialQrCrop = { x: 0, y: 0, width: 100, height: 100 },
  initialFramePosition = { x: 50, y: 50 },
  initialFrameSize = { width: 80, height: 80 },
  initialFrameCrop = { x: 0, y: 0, width: 100, height: 100 },
  onQrPositionChange,
  onQrSizeChange,
  onQrCropChange,
  onFramePositionChange,
  onFrameSizeChange,
  onFrameCropChange,
}: EditableQRMockupProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleReset = () => {
    onQrPositionChange?.({ x: 50, y: 50 })
    onQrSizeChange?.({ width: 60, height: 60 })
    onQrCropChange?.({ x: 0, y: 0, width: 100, height: 100 })
    onFramePositionChange?.({ x: 50, y: 50 })
    onFrameSizeChange?.({ width: 80, height: 80 })
    onFrameCropChange?.({ x: 0, y: 0, width: 100, height: 100 })
  }

  return (
    <>
      {/* Contrôles - Améliorés pour mobile */}
      {externalEditMode && (
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </Button>
          <div className="text-xs text-gray-600 dark:text-gray-400 text-center sm:text-left">
            <div className="hidden sm:block">
              Glissez pour déplacer • Redimensionner depuis les coins • Cadre et QR indépendants
            </div>
            <div className="sm:hidden space-y-1">
              <div>👆 Glissez pour déplacer</div>
              <div>📏 Pincez les coins pour redimensionner</div>
            </div>
          </div>
        </div>
      )}

      {/* Conteneur - Permet le scroll et l'agrandissement */}
      <div
        ref={containerRef}
        className="w-full relative bg-white"
        style={{ 
          minHeight: "100%", 
          padding: "2rem",
          // Permettre au contenu de dépasser pour activer le scroll
          // Calculer la hauteur minimale pour permettre un agrandissement jusqu'à 300%
          height: "auto",
          overflow: "visible",
          // S'assurer que le conteneur peut grandir pour permettre le scroll
          position: "relative",
          // Permettre au conteneur de grandir au-delà de 100% pour activer le scroll
          minHeight: "calc(100% + 400%)" // Permet un agrandissement jusqu'à 500%
        }}
      >
        {/* Frame éditable (si sélectionné) */}
        {selectedFrame && (
          <EditableElement
            editMode={externalEditMode}
            initialPosition={initialFramePosition}
            initialSize={initialFrameSize}
            initialCrop={initialFrameCrop}
            onPositionChange={onFramePositionChange}
            onSizeChange={onFrameSizeChange}
            onCropChange={onFrameCropChange}
            borderColor="border-blue-500"
            label="Cadre"
            containerRef={containerRef}
          >
            <img
              src={`/frames/${selectedFrame.filename}`}
              alt={selectedFrame.name}
              className="w-full h-full object-contain"
              style={{
                filter: selectedFrame.supportsColorChange && frameColor
                  ? `brightness(0.8) saturate(100%) invert(${1 - parseInt(frameColor.slice(1, 3), 16) / 255}) sepia(100%) saturate(${parseInt(frameColor.slice(3, 5), 16) / 255 * 100}%) hue-rotate(${parseInt(frameColor.slice(5, 7), 16) * 360 / 255}deg)`
                  : "none",
              }}
            />
          </EditableElement>
        )}

        {/* QR Code éditable - Afficher le QR code SANS le cadre en mode édition */}
        <EditableElement
          editMode={externalEditMode}
          initialPosition={initialQrPosition}
          initialSize={initialQrSize}
          initialCrop={initialQrCrop}
          onPositionChange={onQrPositionChange}
          onSizeChange={onQrSizeChange}
          onCropChange={onQrCropChange}
          borderColor="border-green-500"
          label="QR Code"
          containerRef={containerRef}
        >
          {/* En mode édition avec cadre, afficher le QR code seul (sans cadre) */}
          {externalEditMode && selectedFrame ? (
            <div className="w-full h-full flex items-center justify-center bg-white">
              <QRCodeSVG
                value={qrData}
                size={200}
                level="H"
                fgColor={qrColor}
                bgColor={qrBackgroundColor}
              />
            </div>
          ) : qrCodeImage ? (
            <img
              src={qrCodeImage}
              alt="QR Code"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white">
              <QRCodeSVG
                value={qrData}
                size={200}
                level="H"
                fgColor={qrColor}
                bgColor={qrBackgroundColor}
              />
            </div>
          )}
        </EditableElement>
      </div>
    </>
  )
}
