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

export function ConcertForm() {
  const { templateData, updateTemplateData } = useQRTemplateStore()
  const data = templateData as any

  const handleChange = (field: string, value: any) => {
    updateTemplateData({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Image de l'artiste</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = (event) => {
                handleChange('artistImage', event.target?.result)
              }
              reader.readAsDataURL(file)
            }
          }}
        />
        {data.artistImage && (
          <ImagePreview
            src={data.artistImage}
            alt="Image de l'artiste"
            onRemove={() => handleChange('artistImage', null)}
          />
        )}
      </div>

      <div>
        <Label>Nom de l'artiste</Label>
        <Input
          value={data.artistName || ''}
          onChange={(e) => handleChange('artistName', e.target.value)}
          placeholder="Nom de l'artiste"
        />
      </div>

      <div>
        <Label>Nom de la tournée (optionnel)</Label>
        <Input
          value={data.tourName || ''}
          onChange={(e) => handleChange('tourName', e.target.value)}
          placeholder="Tournée 2024"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={data.date || ''}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>
        <div>
          <Label>Heure</Label>
          <Input
            type="time"
            value={data.time || ''}
            onChange={(e) => handleChange('time', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label>Lieu du concert</Label>
        <Input
          value={data.venue || ''}
          onChange={(e) => handleChange('venue', e.target.value)}
          placeholder="Salle de concert..."
        />
      </div>

      <div>
        <Label>Thème</Label>
        <Select
          value={data.theme || 'dark'}
          onValueChange={(value) => handleChange('theme', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dark">Sombre</SelectItem>
            <SelectItem value="flashy">Flashy / Coloré</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Instructions (optionnel)</Label>
        <Textarea
          value={data.instructions || ''}
          onChange={(e) => handleChange('instructions', e.target.value)}
          placeholder="Informations d'accès, sécurité..."
          rows={3}
        />
      </div>
    </div>
  )
}

