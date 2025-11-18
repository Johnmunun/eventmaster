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

export function AnniversaireForm() {
  const { templateData, updateTemplateData } = useQRTemplateStore()
  const data = templateData as any

  const handleChange = (field: string, value: any) => {
    updateTemplateData({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Photo de la personne</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = (event) => {
                handleChange('personImage', event.target?.result)
              }
              reader.readAsDataURL(file)
            }
          }}
        />
        {data.personImage && (
          <ImagePreview
            src={data.personImage}
            alt="Photo de la personne"
            onRemove={() => handleChange('personImage', null)}
          />
        )}
      </div>

      <div>
        <Label>Nom de la personne</Label>
        <Input
          value={data.personName || ''}
          onChange={(e) => handleChange('personName', e.target.value)}
          placeholder="Nom"
        />
      </div>

      <div>
        <Label>Âge (optionnel)</Label>
        <Input
          type="number"
          value={data.age || ''}
          onChange={(e) => handleChange('age', parseInt(e.target.value) || undefined)}
          placeholder="25"
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
        <Label>Lieu</Label>
        <Input
          value={data.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Lieu de la fête"
        />
      </div>

      <div>
        <Label>Thème</Label>
        <Select
          value={data.theme || 'blue'}
          onValueChange={(value) => handleChange('theme', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blue">Bleu</SelectItem>
            <SelectItem value="pink">Rose</SelectItem>
            <SelectItem value="yellow">Jaune</SelectItem>
            <SelectItem value="rainbow">Arc-en-ciel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Message personnel</Label>
        <Textarea
          value={data.message || ''}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Message d'invitation..."
          rows={3}
        />
      </div>

      <div>
        <Label>Programme (optionnel)</Label>
        <Textarea
          value={data.program || ''}
          onChange={(e) => handleChange('program', e.target.value)}
          placeholder="Programme de la journée..."
          rows={2}
        />
      </div>
    </div>
  )
}

