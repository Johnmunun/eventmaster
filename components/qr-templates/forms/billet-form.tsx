"use client"

import { useQRTemplateStore } from "@/lib/stores/qr-template-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileInput } from "@/components/ui/file-input"

export function BilletForm() {
  const { templateData, updateTemplateData } = useQRTemplateStore()
  const data = templateData as any

  const handleChange = (field: string, value: any) => {
    updateTemplateData({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <FileInput
          label="Image de couverture"
          accept="image/*"
          maxSize={5}
          preview={data.coverImage || null}
          onFileChange={(file) => {
            if (file) {
              const reader = new FileReader()
              reader.onload = (event) => {
                handleChange('coverImage', event.target?.result)
              }
              reader.readAsDataURL(file)
            } else {
              handleChange('coverImage', null)
            }
          }}
          onRemove={() => handleChange('coverImage', null)}
        />
      </div>

      <div>
        <Label>Titre de l'événement</Label>
        <Input
          value={data.eventTitle || ''}
          onChange={(e) => handleChange('eventTitle', e.target.value)}
          placeholder="Concert de..."
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
          placeholder="Salle de concert..."
        />
      </div>

      <div>
        <Label>Code du billet</Label>
        <Input
          value={data.ticketCode || ''}
          onChange={(e) => handleChange('ticketCode', e.target.value)}
          placeholder="XXXX-XXXX"
        />
      </div>

      <div>
        <Label>Type de billet</Label>
        <Input
          value={data.ticketType || ''}
          onChange={(e) => handleChange('ticketType', e.target.value)}
          placeholder="VIP, Standard..."
        />
      </div>

      <div>
        <Label>Informations de place (optionnel)</Label>
        <Input
          value={data.seatInfo || ''}
          onChange={(e) => handleChange('seatInfo', e.target.value)}
          placeholder="Rangée A, Place 12"
        />
      </div>
    </div>
  )
}
