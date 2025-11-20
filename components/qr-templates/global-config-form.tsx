"use client"

import { useQRTemplateStore } from "@/lib/stores/qr-template-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FormSection } from "@/components/ui/form-section"
import { FileInput } from "@/components/ui/file-input"
import { Palette, Pencil, ArrowLeftRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Palettes de couleurs prédéfinies
const colorPalettes = [
  { primary: "#527AC9", secondary: "#7EC09F", name: "Bleu-Vert" },
  { primary: "#E5E7EB", secondary: "#000000", name: "Gris-Noir" },
  { primary: "#DBEAFE", secondary: "#3B82F6", name: "Bleu Clair-Foncé" },
  { primary: "#E9D5FF", secondary: "#000000", name: "Violet-Noir" },
  { primary: "#D1FAE5", secondary: "#000000", name: "Vert-Noir" },
  { primary: "#FED7AA", secondary: "#000000", name: "Orange-Noir" },
]

export function GlobalConfigForm() {
  const { globalConfig, updateGlobalConfig } = useQRTemplateStore()

  const handlePaletteSelect = (palette: typeof colorPalettes[0]) => {
    updateGlobalConfig({
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
    })
  }

  const swapColors = () => {
    updateGlobalConfig({
      primaryColor: globalConfig.secondaryColor,
      secondaryColor: globalConfig.primaryColor,
    })
  }

  const isPaletteSelected = (palette: typeof colorPalettes[0]) => {
    return (
      globalConfig.primaryColor === palette.primary &&
      globalConfig.secondaryColor === palette.secondary
    )
  }

  return (
    <FormSection
      icon={Palette}
      title="Apparence"
      description="Choisissez un thème de couleur pour votre page."
      defaultExpanded={true}
    >
      <div className="space-y-6">
          {/* Palette de couleurs */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
              Palette de couleurs
            </Label>
            <div className="flex gap-3 flex-wrap">
              {colorPalettes.map((palette, index) => (
                <button
                  key={index}
                  onClick={() => handlePaletteSelect(palette)}
                  className={`relative p-1 rounded-lg border-2 transition-all hover:scale-105 ${
                    isPaletteSelected(palette)
                      ? "border-primary shadow-lg"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                  }`}
                  title={palette.name}
                >
                  <div className="flex gap-0.5">
                    <div
                      className="w-8 h-10 rounded-l"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <div
                      className="w-8 h-10 rounded-r"
                      style={{ backgroundColor: palette.secondary }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Couleur primaire */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
              Couleur primaire
            </Label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-md border-2 border-gray-200 dark:border-gray-700 cursor-pointer flex items-center justify-center"
                  style={{ backgroundColor: globalConfig.primaryColor }}
                >
                  <Pencil className="h-4 w-4 text-white drop-shadow-lg" />
                </div>
                <Input
                  type="color"
                  value={globalConfig.primaryColor}
                  onChange={(e) => updateGlobalConfig({ primaryColor: e.target.value })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <Input
                type="text"
                value={globalConfig.primaryColor}
                onChange={(e) => updateGlobalConfig({ primaryColor: e.target.value })}
                className="flex-1 rounded-[2px] border-gray-300 dark:border-gray-600"
                placeholder="#527AC9"
              />
            </div>
          </div>

          {/* Bouton swap */}
          <div className="flex justify-center -my-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={swapColors}
              className="rounded-full h-10 w-10 border-2"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Couleur secondaire */}
          <div>
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
              Couleur secondaire
            </Label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-md border-2 border-gray-200 dark:border-gray-700 cursor-pointer flex items-center justify-center"
                  style={{ backgroundColor: globalConfig.secondaryColor }}
                >
                  <Pencil className="h-4 w-4 text-white drop-shadow-lg" />
                </div>
                <Input
                  type="color"
                  value={globalConfig.secondaryColor}
                  onChange={(e) => updateGlobalConfig({ secondaryColor: e.target.value })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <Input
                type="text"
                value={globalConfig.secondaryColor}
                onChange={(e) => updateGlobalConfig({ secondaryColor: e.target.value })}
                className="flex-1 rounded-[2px] border-gray-300 dark:border-gray-600"
                placeholder="#7EC09F"
              />
            </div>
          </div>

          {/* Autres options (collapsibles) */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                Couleur de fond du template
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={globalConfig.backgroundColor || '#FFFFFF'}
                  onChange={(e) => updateGlobalConfig({ backgroundColor: e.target.value })}
                  className="w-10 h-10 cursor-pointer rounded-md"
                />
                <Input
                  type="text"
                  value={globalConfig.backgroundColor || ''}
                  onChange={(e) => updateGlobalConfig({ backgroundColor: e.target.value || null })}
                  className="flex-1 rounded-[2px] border-gray-300 dark:border-gray-600"
                  placeholder="#FFFFFF ou vide"
                />
              </div>
            </div>
          </div>

          {/* Image de couverture */}
          <FileInput
            label="Image de couverture (optionnel)"
            description="Utilisée comme arrière-plan de la page QR. Remplace le dégradé de couleurs pour un aspect plus personnalisé."
            accept="image/*"
            maxSize={5}
            preview={globalConfig.coverImage || null}
            onFileChange={(file) => {
              if (file) {
                const reader = new FileReader()
                reader.onload = (event) => {
                  updateGlobalConfig({ coverImage: event.target?.result as string })
                }
                reader.readAsDataURL(file)
              } else {
                updateGlobalConfig({ coverImage: null })
              }
            }}
            onRemove={() => updateGlobalConfig({ coverImage: null })}
          />

          {/* Logo */}
          <FileInput
            label="Logo (optionnel)"
            description="Affiche votre logo en bas de la page QR pour renforcer votre identité visuelle (visible dans certains templates comme Profil)."
            accept="image/*"
            maxSize={5}
            preview={globalConfig.logo || null}
            onFileChange={(file) => {
              if (file) {
                const reader = new FileReader()
                reader.onload = (event) => {
                  updateGlobalConfig({ logo: event.target?.result as string })
                }
                reader.readAsDataURL(file)
              } else {
                updateGlobalConfig({ logo: null })
              }
            }}
            onRemove={() => updateGlobalConfig({ logo: null })}
          />

          {/* Style des bordures d'images */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Style des bordures d'images
            </h4>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                  Style de bordure
                </Label>
                <Select
                  value={globalConfig.imageBorderStyle}
                  onValueChange={(value: any) => updateGlobalConfig({ imageBorderStyle: value })}
                >
                  <SelectTrigger className="rounded-[2px] border-gray-300 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    <SelectItem value="solid">Pleine</SelectItem>
                    <SelectItem value="dashed">Tirets</SelectItem>
                    <SelectItem value="dotted">Pointillés</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="shadow">Ombre</SelectItem>
                    <SelectItem value="gradient">Dégradé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {globalConfig.imageBorderStyle !== 'none' && globalConfig.imageBorderStyle !== 'shadow' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      Épaisseur (px)
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={globalConfig.imageBorderWidth}
                      onChange={(e) => updateGlobalConfig({ imageBorderWidth: parseInt(e.target.value) || 2 })}
                      className="rounded-[2px] border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                      Couleur
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        className="w-12 h-10 cursor-pointer rounded-md"
                        value={globalConfig.imageBorderColor}
                        onChange={(e) => updateGlobalConfig({ imageBorderColor: e.target.value })}
                      />
                      <Input
                        type="text"
                        value={globalConfig.imageBorderColor}
                        onChange={(e) => updateGlobalConfig({ imageBorderColor: e.target.value })}
                        className="flex-1 rounded-[2px] border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                  Arrondi des images
                </Label>
                <Select
                  value={globalConfig.imageBorderRadius}
                  onValueChange={(value: any) => updateGlobalConfig({ imageBorderRadius: value })}
                >
                  <SelectTrigger className="rounded-[2px] border-gray-300 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    <SelectItem value="small">Petit</SelectItem>
                    <SelectItem value="medium">Moyen</SelectItem>
                    <SelectItem value="large">Grand</SelectItem>
                    <SelectItem value="full">Rond</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Typographie et autres */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                Typographie
              </Label>
              <Select
                value={globalConfig.typography}
                onValueChange={(value: any) => updateGlobalConfig({ typography: value })}
              >
                <SelectTrigger className="rounded-md border-gray-300 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sans">Sans-serif (Poppins)</SelectItem>
                  <SelectItem value="serif">Serif (Georgia)</SelectItem>
                  <SelectItem value="mono">Monospace (JetBrains)</SelectItem>
                  <SelectItem value="times">Times New Roman</SelectItem>
                  <SelectItem value="playfair">Playfair Display</SelectItem>
                  <SelectItem value="montserrat">Montserrat</SelectItem>
                  <SelectItem value="roboto">Roboto</SelectItem>
                  <SelectItem value="lato">Lato</SelectItem>
                  <SelectItem value="cursive">Cursive (Dancing Script)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                Poids de la police
              </Label>
              <Select
                value={globalConfig.fontWeight || 'normal'}
                onValueChange={(value: any) => updateGlobalConfig({ fontWeight: value })}
              >
                <SelectTrigger className="rounded-md border-gray-300 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light (300)</SelectItem>
                  <SelectItem value="normal">Normal (400)</SelectItem>
                  <SelectItem value="medium">Medium (500)</SelectItem>
                  <SelectItem value="semibold">Semi-bold (600)</SelectItem>
                  <SelectItem value="bold">Bold (700)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                Arrondis
              </Label>
              <Select
                value={globalConfig.borderRadius}
                onValueChange={(value: any) => updateGlobalConfig({ borderRadius: value })}
              >
                <SelectTrigger className="rounded-md border-gray-300 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Petit</SelectItem>
                  <SelectItem value="medium">Moyen</SelectItem>
                  <SelectItem value="large">Grand</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
      </div>
    </FormSection>
  )
}
