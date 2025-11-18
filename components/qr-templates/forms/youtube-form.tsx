"use client"

import { useQRTemplateStore } from "@/lib/stores/qr-template-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePreview } from "../components/image-preview"

export function YouTubeForm() {
  const { templateData, updateTemplateData } = useQRTemplateStore()
  const data = templateData as any

  const handleChange = (field: string, value: any) => {
    updateTemplateData({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>URL YouTube</Label>
        <Input
          type="url"
          value={data.url || ''}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <div>
        <Label>Titre personnalisé</Label>
        <Input
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Titre de la vidéo"
        />
      </div>

      <div>
        <Label>Miniature personnalisée (optionnel)</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = (event) => {
                handleChange('thumbnail', event.target?.result)
              }
              reader.readAsDataURL(file)
            }
          }}
        />
        {data.thumbnail && (
          <ImagePreview
            src={data.thumbnail}
            alt="Miniature personnalisée"
            onRemove={() => handleChange('thumbnail', null)}
          />
        )}
      </div>
    </div>
  )
}

