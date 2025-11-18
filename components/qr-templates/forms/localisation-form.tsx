"use client"

import { useQRTemplateStore } from "@/lib/stores/qr-template-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePreview } from "../components/image-preview"

export function LocalisationForm() {
  const { templateData, updateTemplateData } = useQRTemplateStore()
  const data = templateData as any

  const handleChange = (field: string, value: any) => {
    updateTemplateData({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Adresse complète</Label>
        <Textarea
          value={data.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="123 Rue Example, 75001 Paris, France"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Latitude (optionnel)</Label>
          <Input
            type="number"
            step="any"
            value={data.latitude || ''}
            onChange={(e) => handleChange('latitude', parseFloat(e.target.value) || undefined)}
            placeholder="48.8566"
          />
        </div>
        <div>
          <Label>Longitude (optionnel)</Label>
          <Input
            type="number"
            step="any"
            value={data.longitude || ''}
            onChange={(e) => handleChange('longitude', parseFloat(e.target.value) || undefined)}
            placeholder="2.3522"
          />
        </div>
      </div>

      <div>
        <Label>Photo du lieu (optionnel)</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = (event) => {
                handleChange('placeImage', event.target?.result)
              }
              reader.readAsDataURL(file)
            }
          }}
        />
        {data.placeImage && (
          <ImagePreview
            src={data.placeImage}
            alt="Photo du lieu"
            onRemove={() => handleChange('placeImage', null)}
          />
        )}
      </div>

      <div>
        <Label>Note ou commentaire (optionnel)</Label>
        <Textarea
          value={data.note || ''}
          onChange={(e) => handleChange('note', e.target.value)}
          placeholder="Informations supplémentaires..."
          rows={2}
        />
      </div>
    </div>
  )
}

