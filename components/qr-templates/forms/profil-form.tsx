"use client"

import { useQRTemplateStore } from "@/lib/stores/qr-template-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { useState } from "react"

export function ProfilForm() {
  const { templateData, updateTemplateData } = useQRTemplateStore()
  const data = templateData as any

  const handleChange = (field: string, value: any) => {
    updateTemplateData({ [field]: value })
  }

  const addCustomLink = () => {
    const links = data.customLinks || []
    handleChange('customLinks', [...links, { label: '', url: '' }])
  }

  const removeCustomLink = (index: number) => {
    const links = data.customLinks || []
    handleChange('customLinks', links.filter((_: any, i: number) => i !== index))
  }

  const updateCustomLink = (index: number, field: string, value: string) => {
    const links = data.customLinks || []
    links[index] = { ...links[index], [field]: value }
    handleChange('customLinks', [...links])
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Photo de profil</Label>
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
          <div className="mt-2 relative group">
            <div className="relative overflow-hidden rounded-xl shadow-lg border-2 border-gray-200">
              <img 
                src={data.profileImage} 
                alt="Preview" 
                className="w-full h-40 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <button
              onClick={() => handleChange('profileImage', null)}
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 shadow-lg transition-all hover:scale-110"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div>
        <Label>Nom</Label>
        <Input
          value={data.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="John Doe"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Description courte..."
          rows={3}
        />
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

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Liens personnalisables</Label>
          <Button type="button" size="sm" variant="outline" onClick={addCustomLink}>
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </Button>
        </div>
        <div className="space-y-2">
          {(data.customLinks || []).map((link: any, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Label"
                value={link.label}
                onChange={(e) => updateCustomLink(index, 'label', e.target.value)}
              />
              <Input
                placeholder="URL"
                value={link.url}
                onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => removeCustomLink(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

