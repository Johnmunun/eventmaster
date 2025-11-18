"use client"

import { useQRTemplateStore } from "@/lib/stores/qr-template-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function GlobalConfigForm() {
  const { globalConfig, updateGlobalConfig } = useQRTemplateStore()

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
      <h3 className="font-semibold mb-4">Personnalisation globale</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Couleur primaire</Label>
          <div className="flex gap-2 mt-2">
            <Input
              type="color"
              className="w-16 h-10 cursor-pointer"
              value={globalConfig.primaryColor}
              onChange={(e) => updateGlobalConfig({ primaryColor: e.target.value })}
            />
            <Input
              type="text"
              value={globalConfig.primaryColor}
              onChange={(e) => updateGlobalConfig({ primaryColor: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label>Couleur secondaire</Label>
          <div className="flex gap-2 mt-2">
            <Input
              type="color"
              className="w-16 h-10 cursor-pointer"
              value={globalConfig.secondaryColor}
              onChange={(e) => updateGlobalConfig({ secondaryColor: e.target.value })}
            />
            <Input
              type="text"
              value={globalConfig.secondaryColor}
              onChange={(e) => updateGlobalConfig({ secondaryColor: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Couleur de fond du template</Label>
        <div className="flex gap-2 mt-2">
          <Input
            type="color"
            className="w-16 h-10 cursor-pointer"
            value={globalConfig.backgroundColor || '#FFFFFF'}
            onChange={(e) => updateGlobalConfig({ backgroundColor: e.target.value })}
          />
          <Input
            type="text"
            value={globalConfig.backgroundColor || ''}
            onChange={(e) => updateGlobalConfig({ backgroundColor: e.target.value || null })}
            placeholder="#FFFFFF ou vide"
          />
        </div>
      </div>

      <div>
        <Label>Image de couverture (optionnel)</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = (event) => {
                updateGlobalConfig({ coverImage: event.target?.result as string })
              }
              reader.readAsDataURL(file)
            }
          }}
        />
        {globalConfig.coverImage && (
          <div className="mt-2 relative group">
            <div className="relative overflow-hidden rounded-xl shadow-lg border-2 border-gray-200">
              <img 
                src={globalConfig.coverImage} 
                alt="Preview" 
                className="w-full h-40 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <button
              onClick={() => updateGlobalConfig({ coverImage: null })}
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 shadow-lg transition-all hover:scale-110"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div>
        <Label>Logo (optionnel)</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = (event) => {
                updateGlobalConfig({ logo: event.target?.result as string })
              }
              reader.readAsDataURL(file)
            }
          }}
        />
        {globalConfig.logo && (
          <div className="mt-2 relative group">
            <div className="relative overflow-hidden rounded-xl shadow-lg border-2 border-gray-200 w-32 h-32 mx-auto">
              <img 
                src={globalConfig.logo} 
                alt="Logo Preview" 
                className="w-full h-full object-contain p-2 transition-transform group-hover:scale-105"
              />
            </div>
            <button
              onClick={() => updateGlobalConfig({ logo: null })}
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 shadow-lg transition-all hover:scale-110"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-semibold mb-3">Style des bordures d'images</h4>
        
        <div className="space-y-4">
          <div>
            <Label>Style de bordure</Label>
            <Select
              value={globalConfig.imageBorderStyle}
              onValueChange={(value: any) => updateGlobalConfig({ imageBorderStyle: value })}
            >
              <SelectTrigger>
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
                <Label>Épaisseur (px)</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={globalConfig.imageBorderWidth}
                  onChange={(e) => updateGlobalConfig({ imageBorderWidth: parseInt(e.target.value) || 2 })}
                />
              </div>
              <div>
                <Label>Couleur</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    className="w-12 h-10 cursor-pointer"
                    value={globalConfig.imageBorderColor}
                    onChange={(e) => updateGlobalConfig({ imageBorderColor: e.target.value })}
                  />
                  <Input
                    type="text"
                    value={globalConfig.imageBorderColor}
                    onChange={(e) => updateGlobalConfig({ imageBorderColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <Label>Arrondi des images</Label>
            <Select
              value={globalConfig.imageBorderRadius}
              onValueChange={(value: any) => updateGlobalConfig({ imageBorderRadius: value })}
            >
              <SelectTrigger>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Typographie</Label>
          <Select
            value={globalConfig.typography}
            onValueChange={(value: any) => updateGlobalConfig({ typography: value })}
          >
            <SelectTrigger>
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
          <Label>Poids de la police</Label>
          <Select
            value={globalConfig.fontWeight || 'normal'}
            onValueChange={(value: any) => updateGlobalConfig({ fontWeight: value })}
          >
            <SelectTrigger>
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
          <Label>Arrondis</Label>
          <Select
            value={globalConfig.borderRadius}
            onValueChange={(value: any) => updateGlobalConfig({ borderRadius: value })}
          >
            <SelectTrigger>
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
  )
}

