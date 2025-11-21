"use client"

import { useQRTemplateStore } from "@/lib/stores/qr-template-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { FileInput } from "@/components/ui/file-input"

export function MariageForm() {
  const { templateData, updateTemplateData } = useQRTemplateStore()
  const data = templateData as any

  const handleChange = (field: string, value: any) => {
    updateTemplateData({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <FileInput
          label="Photo du couple"
          accept="image/*"
          maxSize={5}
          preview={data.coupleImage || null}
          onFileChange={(file) => {
            if (file) {
              const reader = new FileReader()
              reader.onload = (event) => {
                handleChange('coupleImage', event.target?.result)
              }
              reader.readAsDataURL(file)
            } else {
              handleChange('coupleImage', null)
            }
          }}
          onRemove={() => handleChange('coupleImage', null)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Prénom 1</Label>
          <Input
            value={data.name1 || ''}
            onChange={(e) => handleChange('name1', e.target.value)}
            placeholder="Prénom"
          />
        </div>
        <div>
          <Label>Prénom 2</Label>
          <Input
            value={data.name2 || ''}
            onChange={(e) => handleChange('name2', e.target.value)}
            placeholder="Prénom"
          />
        </div>
      </div>

      <div>
        <Label>Date</Label>
        <Input
          type="date"
          value={data.date || ''}
          onChange={(e) => handleChange('date', e.target.value)}
        />
      </div>

      <div>
        <Label>Lieu</Label>
        <Input
          value={data.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Lieu de la cérémonie"
        />
      </div>

      <div>
        <Label>Lieu de la cérémonie (optionnel)</Label>
        <Input
          value={data.ceremonyLocation || ''}
          onChange={(e) => handleChange('ceremonyLocation', e.target.value)}
          placeholder="Église, mairie..."
        />
      </div>

      <div>
        <Label>Message romantique</Label>
        <Textarea
          value={data.message || ''}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Message personnel..."
          rows={3}
        />
      </div>

      <div>
        <Label>Plan de table (optionnel)</Label>
        <Input
          value={data.tablePlan || ''}
          onChange={(e) => handleChange('tablePlan', e.target.value)}
          placeholder="Table 5 - Famille..."
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Activer RSVP</Label>
        <Switch
          checked={data.rsvp || false}
          onCheckedChange={(checked) => handleChange('rsvp', checked)}
        />
      </div>
    </div>
  )
}

