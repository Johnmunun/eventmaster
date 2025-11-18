"use client"

import { useQRTemplateStore } from "@/lib/stores/qr-template-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export function MariageForm() {
  const { templateData, updateTemplateData } = useQRTemplateStore()
  const data = templateData as any

  const handleChange = (field: string, value: any) => {
    updateTemplateData({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Photo du couple</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = (event) => {
                handleChange('coupleImage', event.target?.result)
              }
              reader.readAsDataURL(file)
            }
          }}
        />
        {data.coupleImage && (
          <div className="mt-2 relative group">
            <div className="relative overflow-hidden rounded-xl shadow-lg border-2 border-gray-200">
              <img 
                src={data.coupleImage} 
                alt="Preview" 
                className="w-full h-40 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <button
              onClick={() => handleChange('coupleImage', null)}
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 shadow-lg transition-all hover:scale-110"
            >
              ×
            </button>
          </div>
        )}
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

