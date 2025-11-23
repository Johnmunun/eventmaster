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
  const [availableFrames, setAvailableFrames] = useState<Set<string>>(new Set())
  const categories = ["all", ...getCategories()]

  const filteredFrames =
    selectedCategory === "all"
      ? QR_FRAMES
      : QR_FRAMES.filter((frame) => frame.category === selectedCategory)

  // Vérifier quelles images sont disponibles (optionnel, pour debug)
  useEffect(() => {
    // Ne pas logger par défaut pour éviter le spam
    // console.log("FrameSelector - Frames disponibles:", filteredFrames.length)
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
                onClick={() => {
                  // Permettre la sélection si l'image est disponible ou si on n'a pas encore vérifié
                  // On désactive seulement si on sait que l'image n'existe pas
                  const isUnavailable = availableFrames.size > 0 && !availableFrames.has(frame.id)
                  if (!isUnavailable) {
                    onFrameSelect(frame)
                  }
                }}
                className={cn(
                  "flex-shrink-0 w-24 h-24 rounded-lg border-2 transition-all relative overflow-hidden",
                  "hover:border-primary hover:shadow-md group",
                  isSelected
                    ? "border-primary shadow-md ring-2 ring-primary/20"
                    : "border-gray-200 dark:border-gray-700",
                  // Désactiver visuellement seulement si on sait que l'image n'existe pas
                  availableFrames.size > 0 && !availableFrames.has(frame.id)
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
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
                      // Appliquer le filtre de couleur seulement si supporté et si une couleur est fournie
                      // Ne pas appliquer de filtre par défaut pour que l'image soit visible
                      filter: frame.supportsColorChange && frameColor && frameColor !== "#000000"
                        ? createColorFilter(frameColor)
                        : "none",
                      opacity: 1, // S'assurer que l'image est visible
                      display: "block", // S'assurer que l'image est affichée
                    }}
                    onError={(e) => {
                      // Gérer gracieusement les images manquantes sans erreur console
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      const parent = target.parentElement
                      if (parent) {
                        // Afficher un placeholder au lieu de l'image
                        parent.innerHTML = `
                          <div class="flex flex-col items-center justify-center h-full p-2 text-center">
                            <div class="text-2xl mb-1">📦</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400 leading-tight">${frame.name}</div>
                            <div class="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Non disponible</div>
                          </div>
                        `
                        // Marquer ce frame comme non disponible
                        setAvailableFrames(prev => {
                          const next = new Set(prev)
                          next.delete(frame.id)
                          return next
                        })
                      }
                    }}
                    onLoad={() => {
                      // Marquer ce frame comme disponible
                      setAvailableFrames(prev => new Set(prev).add(frame.id))
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

// Helper pour créer un filtre de couleur CSS qui ne cache pas l'image
function createColorFilter(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return ""
  
  // Utiliser un filtre qui teinte l'image sans la rendre invisible
  // Cette approche fonctionne mieux avec des images en niveaux de gris
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255
  
  // Créer une matrice de couleur pour teinter l'image
  // Ne pas utiliser brightness(0) qui rend l'image invisible
  return `brightness(0.8) saturate(100%) invert(${1 - r}) sepia(100%) saturate(${g * 100}%) hue-rotate(${b * 360}deg)`
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

