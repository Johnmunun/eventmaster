"use client"

import { useQRTemplateStore } from "@/lib/stores/qr-template-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePreview } from "../components/image-preview"

export function VCardForm() {
  const { templateData, updateTemplateData } = useQRTemplateStore()
  const data = templateData as any

  const handleChange = (field: string, value: any) => {
    updateTemplateData({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Photo de profil (optionnelle)</Label>
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
            alt="Photo de profil"
            onRemove={() => handleChange('profileImage', null)}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Prénom</Label>
          <Input
            value={data.firstName || ''}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="Prénom"
          />
        </div>
        <div>
          <Label>Nom</Label>
          <Input
            value={data.lastName || ''}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Nom"
          />
        </div>
      </div>

      <div>
        <Label>Entreprise (optionnel)</Label>
        <Input
          value={data.organization || ''}
          onChange={(e) => handleChange('organization', e.target.value)}
          placeholder="Nom de l'entreprise"
        />
      </div>

      <div>
        <Label>Poste / Métier (optionnel)</Label>
        <Input
          value={data.jobTitle || ''}
          onChange={(e) => handleChange('jobTitle', e.target.value)}
          placeholder="Développeur, Manager..."
        />
      </div>

      <div>
        <Label>Email (optionnel)</Label>
        <Input
          type="email"
          value={data.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="email@example.com"
        />
      </div>

      <div>
        <Label>Téléphone (optionnel)</Label>
        <Input
          type="tel"
          value={data.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+33 6 12 34 56 78"
        />
      </div>

      <div>
        <Label>Site Web (optionnel)</Label>
        <Input
          type="url"
          value={data.website || ''}
          onChange={(e) => handleChange('website', e.target.value)}
          placeholder="https://example.com"
        />
      </div>

      <div>
        <Label>Description (optionnel)</Label>
        <Textarea
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Une description personnelle ou professionnelle..."
          rows={4}
        />
      </div>
    </div>
  )
}

