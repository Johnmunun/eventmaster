"use client"

import { useQRTemplateStore } from "@/lib/stores/qr-template-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePreview } from "../components/image-preview"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function OffreForm() {
  const { templateData, updateTemplateData } = useQRTemplateStore()
  const data = templateData as any

  const handleChange = (field: string, value: any) => {
    updateTemplateData({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Image principale</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = (event) => {
                handleChange('image', event.target?.result)
              }
              reader.readAsDataURL(file)
            }
          }}
        />
        {data.image && (
          <ImagePreview
            src={data.image}
            alt="Image principale"
            onRemove={() => handleChange('image', null)}
          />
        )}
      </div>

      <div>
        <Label>Titre de l'offre</Label>
        <Input
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Offre spéciale"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Type de réduction</Label>
          <Select
            value={data.discountType || 'percentage'}
            onValueChange={(value) => handleChange('discountType', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Pourcentage (%)</SelectItem>
              <SelectItem value="amount">Montant (€)</SelectItem>
              <SelectItem value="text">Texte libre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Valeur</Label>
          <Input
            value={data.discountValue || ''}
            onChange={(e) => handleChange('discountValue', e.target.value)}
            placeholder="10 ou 10€ ou 'Spécial'"
          />
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Description détaillée de l'offre..."
          rows={3}
        />
      </div>

      <div>
        <Label>Conditions (optionnel)</Label>
        <Textarea
          value={data.conditions || ''}
          onChange={(e) => handleChange('conditions', e.target.value)}
          placeholder="Conditions d'utilisation..."
          rows={2}
        />
      </div>

      <div>
        <Label>Texte du bouton CTA</Label>
        <Input
          value={data.ctaText || ''}
          onChange={(e) => handleChange('ctaText', e.target.value)}
          placeholder="Obtenir mon bon"
        />
      </div>
    </div>
  )
}

