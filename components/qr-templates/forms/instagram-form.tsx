"use client"

import { useQRTemplateStore } from "@/lib/stores/qr-template-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePreview } from "../components/image-preview"

export function InstagramForm() {
  const { templateData, updateTemplateData } = useQRTemplateStore()
  const data = templateData as any

  const handleChange = (field: string, value: any) => {
    updateTemplateData({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Nom Instagram</Label>
        <Input
          value={data.username || ''}
          onChange={(e) => handleChange('username', e.target.value)}
          placeholder="@username"
        />
      </div>

      <div>
        <Label>URL du profil Instagram</Label>
        <Input
          type="url"
          value={data.url || ''}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder="https://instagram.com/username"
        />
      </div>

      <div>
        <Label>Bio courte</Label>
        <Textarea
          value={data.bio || ''}
          onChange={(e) => handleChange('bio', e.target.value)}
          placeholder="Description du profil..."
          rows={3}
        />
      </div>

      <div>
        <Label>Photo de profil (optionnel)</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = (event) => {
                handleChange('profileImage', event.target?.result)
              }
              reader.readAsDataURL(file)
            }
          }}
        />
        {data.profileImage && (
          <ImagePreview
            src={data.profileImage}
            alt="Photo de profil Instagram"
            onRemove={() => handleChange('profileImage', null)}
          />
        )}
      </div>
    </div>
  )
}

