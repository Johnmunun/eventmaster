"use client"

import { useQRTemplateStore } from "@/lib/stores/qr-template-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePreview } from "../components/image-preview"

export function FacebookForm() {
  const { templateData, updateTemplateData } = useQRTemplateStore()
  const data = templateData as any

  const handleChange = (field: string, value: any) => {
    updateTemplateData({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Lien de la page Facebook</Label>
        <Input
          type="url"
          value={data.pageUrl || ''}
          onChange={(e) => handleChange('pageUrl', e.target.value)}
          placeholder="https://facebook.com/pagename"
        />
      </div>

      <div>
        <Label>Nom de la page</Label>
        <Input
          value={data.pageName || ''}
          onChange={(e) => handleChange('pageName', e.target.value)}
          placeholder="Nom de la page Facebook"
        />
      </div>

      <div>
        <Label>Image de la page (optionnel)</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = (event) => {
                handleChange('pageImage', event.target?.result)
              }
              reader.readAsDataURL(file)
            }
          }}
        />
        {data.pageImage && (
          <ImagePreview
            src={data.pageImage}
            alt="Image de la page Facebook"
            onRemove={() => handleChange('pageImage', null)}
          />
        )}
      </div>
    </div>
  )
}

