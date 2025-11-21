"use client"

import { useQRTemplateStore } from "@/lib/stores/qr-template-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FileInput } from "@/components/ui/file-input"
import { Plus, X } from "lucide-react"

export function LinkPageForm() {
  const { templateData, updateTemplateData } = useQRTemplateStore()
  const data = templateData as any

  const handleChange = (field: string, value: any) => {
    updateTemplateData({ [field]: value })
  }

  const addLink = () => {
    const links = data.links || []
    handleChange('links', [...links, { label: '', url: '', icon: '' }])
  }

  const removeLink = (index: number) => {
    const links = data.links || []
    handleChange('links', links.filter((_: any, i: number) => i !== index))
  }

  const updateLink = (index: number, field: string, value: string) => {
    const links = data.links || []
    links[index] = { ...links[index], [field]: value }
    handleChange('links', [...links])
  }

  return (
    <div className="space-y-4">
      <div>
        <FileInput
          label="Image de couverture"
          accept="image/*"
          maxSize={5}
          preview={data.image || null}
          onFileChange={(file) => {
            if (file) {
              const reader = new FileReader()
              reader.onload = (event) => {
                handleChange('image', event.target?.result)
              }
              reader.readAsDataURL(file)
            } else {
              handleChange('image', null)
            }
          }}
          onRemove={() => handleChange('image', null)}
        />
      </div>

      <div>
        <Label>Nom</Label>
        <Input
          value={data.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Nom"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Description..."
          rows={3}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Liens</Label>
          <Button type="button" size="sm" variant="outline" onClick={addLink}>
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </Button>
        </div>
        <div className="space-y-2">
          {(data.links || []).map((link: any, index: number) => (
            <div key={index} className="space-y-2 p-3 border rounded-lg">
              <div className="flex gap-2">
                <Input
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) => updateLink(index, 'label', e.target.value)}
                />
                <Input
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeLink(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Input
                placeholder="Icône (emoji, optionnel)"
                value={link.icon || ''}
                onChange={(e) => updateLink(index, 'icon', e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Réseaux sociaux</Label>
        <div className="space-y-2 mt-2">
          <Input
            placeholder="Instagram URL"
            value={data.socialLinks?.instagram || ''}
            onChange={(e) => handleChange('socialLinks', { ...data.socialLinks, instagram: e.target.value })}
          />
          <Input
            placeholder="Facebook URL"
            value={data.socialLinks?.facebook || ''}
            onChange={(e) => handleChange('socialLinks', { ...data.socialLinks, facebook: e.target.value })}
          />
          <Input
            placeholder="YouTube URL"
            value={data.socialLinks?.youtube || ''}
            onChange={(e) => handleChange('socialLinks', { ...data.socialLinks, youtube: e.target.value })}
          />
          <Input
            placeholder="TikTok URL"
            value={data.socialLinks?.tiktok || ''}
            onChange={(e) => handleChange('socialLinks', { ...data.socialLinks, tiktok: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}

