"use client"

import { useState, useEffect } from "react"
import { FrameConfig, QR_FRAMES, getCategories } from "@/lib/qr-frames"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface FrameSelectorProps {
  selectedFrame: FrameConfig | null
  onFrameSelect: (frame: FrameConfig | null) => void
  frameColor?: string
  onColorChange?: (color: string) => void
}

export function FrameSelector({
  selectedFrame,
  onFrameSelect,
  frameColor,
  onColorChange,
}: FrameSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const categories = ["all", ...getCategories()]

  const filteredFrames =
    selectedCategory === "all"
      ? QR_FRAMES
      : QR_FRAMES.filter((frame) => frame.category === selectedCategory)

  // Debug: Log des frames disponibles
  useEffect(() => {
    console.log("FrameSelector - Frames disponibles:", filteredFrames.length, filteredFrames.map(f => f.filename))
  }, [filteredFrames])

  return (
    <div className="space-y-4">
      {/* Filtres par catégorie */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="text-xs"
          >
            {category === "all"
              ? "Tous"
              : category === "shopping"
              ? "Shopping"
              : category === "gift"
              ? "Cadeaux"
              : category === "communication"
              ? "Communication"
              : category === "transport"
              ? "Transport"
              : category === "document"
              ? "Documents"
              : category === "decoration"
              ? "Décoration"
              : "Autres"}
          </Button>
        ))}
      </div>

      {/* Sélecteur de couleur pour le cadre (si supporté) */}
      {selectedFrame?.supportsColorChange && onColorChange && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Couleur du cadre</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={frameColor || selectedFrame.defaultColor || "#000000"}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-12 h-10 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={frameColor || selectedFrame.defaultColor || "#000000"}
              onChange={(e) => onColorChange(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md text-sm"
              placeholder="#000000"
            />
          </div>
        </div>
      )}

      {/* Liste des cadres avec scroll horizontal */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-3 pb-4">
          {/* Option "Aucun cadre" */}
          <button
            onClick={() => onFrameSelect(null)}
            className={cn(
              "flex-shrink-0 w-24 h-24 rounded-lg border-2 transition-all",
              "flex items-center justify-center bg-gray-50 dark:bg-gray-800",
              "hover:border-primary hover:shadow-md",
              selectedFrame === null
                ? "border-primary shadow-md bg-primary/5"
                : "border-gray-200 dark:border-gray-700"
            )}
          >
            <div className="text-center">
              <div className="text-xs font-medium mb-1">Aucun</div>
              <div className="text-xs text-muted-foreground">QR simple</div>
            </div>
          </button>

          {/* Cadres */}
          {filteredFrames.length === 0 ? (
            <div className="flex items-center justify-center w-full py-8 text-sm text-muted-foreground">
              Aucun cadre disponible. Ajoutez des images dans /public/frames/
            </div>
          ) : (
            filteredFrames.map((frame) => {
            const isSelected = selectedFrame?.id === frame.id
            return (
              <button
                key={frame.id}
                onClick={() => onFrameSelect(frame)}
                className={cn(
                  "flex-shrink-0 w-24 h-24 rounded-lg border-2 transition-all relative overflow-hidden",
                  "hover:border-primary hover:shadow-md group",
                  isSelected
                    ? "border-primary shadow-md ring-2 ring-primary/20"
                    : "border-gray-200 dark:border-gray-700"
                )}
                title={frame.name}
              >
                {/* Image du cadre */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                  <img
                    src={`/frames/${frame.filename}`}
                    alt={frame.name}
                    className="w-full h-full object-contain"
                    style={{
                      filter: frame.supportsColorChange && frameColor
                        ? `brightness(0) saturate(100%) ${frameColorToFilter(frameColor)}`
                        : undefined,
                    }}
                    onError={(e) => {
                      // Fallback si l'image n'existe pas
                      console.error(`Image non trouvée: /frames/${frame.filename}`)
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = `<div class="text-xs text-center p-2 text-gray-600 dark:text-gray-400">${frame.name}</div>`
                      }
                    }}
                    onLoad={() => {
                      console.log(`Image chargée avec succès: /frames/${frame.filename}`)
                    }}
                  />
                </div>

                {/* Badge de sélection */}
                {isSelected && (
                  <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}

                {/* Nom du cadre au survol */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {frame.name}
                </div>
              </button>
            )
          }))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

// Helper pour convertir une couleur hex en filtre CSS
function frameColorToFilter(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return ""
  
  // Créer un filtre qui colore l'image
  // Cette approche utilise un filtre CSS complexe pour changer la couleur
  // Note: Ce n'est pas parfait, mais fonctionne pour la plupart des cas
  return `invert(${rgb.r / 255}) sepia(1) saturate(${rgb.g / 255}) hue-rotate(${rgb.b}deg)`
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

