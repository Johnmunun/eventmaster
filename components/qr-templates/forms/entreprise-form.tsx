"use client"

import { useQRTemplateStore } from "@/lib/stores/qr-template-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ImagePreview } from "../components/image-preview"
import { Plus, X } from "lucide-react"

export function EntrepriseForm() {
  const { templateData, updateTemplateData } = useQRTemplateStore()
  const data = templateData as any

  const handleChange = (field: string, value: any) => {
    updateTemplateData({ [field]: value })
  }

  const addService = () => {
    const services = data.services || []
    handleChange('services', [...services, ''])
  }

  const removeService = (index: number) => {
    const services = data.services || []
    handleChange('services', services.filter((_: any, i: number) => i !== index))
  }

  const updateService = (index: number, value: string) => {
    const services = data.services || []
    services[index] = value
    handleChange('services', [...services])
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Logo</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = (event) => {
                handleChange('logo', event.target?.result)
              }
              reader.readAsDataURL(file)
            }
          }}
        />
        {data.logo && (
          <div className="mt-2 relative group">
            <div className="relative overflow-hidden rounded-xl shadow-lg border-2 border-gray-200 w-32 h-32 mx-auto">
              <img 
                src={data.logo} 
                alt="Logo Preview" 
                className="w-full h-full object-contain p-2 transition-transform group-hover:scale-105"
              />
            </div>
            <button
              onClick={() => handleChange('logo', null)}
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 shadow-lg transition-all hover:scale-110"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div>
        <Label>Image bannière (optionnel)</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = (event) => {
                handleChange('bannerImage', event.target?.result)
              }
              reader.readAsDataURL(file)
            }
          }}
        />
        {data.bannerImage && (
          <ImagePreview
            src={data.bannerImage}
            alt="Image bannière"
            onRemove={() => handleChange('bannerImage', null)}
          />
        )}
      </div>

      <div>
        <Label>Nom de l'entreprise</Label>
        <Input
          value={data.companyName || ''}
          onChange={(e) => handleChange('companyName', e.target.value)}
          placeholder="Nom de l'entreprise"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Services</Label>
          <Button type="button" size="sm" variant="outline" onClick={addService}>
            <Plus className="w-4 h-4 mr-1" />
            Ajouter
          </Button>
        </div>
        <div className="space-y-2">
          {(data.services || []).map((service: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={service}
                onChange={(e) => updateService(index, e.target.value)}
                placeholder="Service"
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => removeService(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
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
        <Label>WhatsApp (optionnel)</Label>
        <Input
          type="tel"
          value={data.whatsapp || ''}
          onChange={(e) => handleChange('whatsapp', e.target.value)}
          placeholder="+33 6 12 34 56 78"
        />
      </div>

      <div>
        <Label>Email (optionnel)</Label>
        <Input
          type="email"
          value={data.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="contact@example.com"
        />
      </div>

      <div>
        <Label>Adresse</Label>
        <Input
          value={data.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="123 Rue Example, 75001 Paris"
        />
      </div>

      <div>
        <Label>Description (optionnel)</Label>
        <Textarea
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Une description de votre entreprise..."
          rows={3}
        />
      </div>

      <div>
        <Label>Heures d'ouverture (optionnel)</Label>
        <Input
          value={data.openingHours || ''}
          onChange={(e) => handleChange('openingHours', e.target.value)}
          placeholder="Lundi: 10:00 am - 05:00 pm"
        />
      </div>

      <div>
        <Label>Texte du bouton CTA (optionnel)</Label>
        <Input
          value={data.ctaText || ''}
          onChange={(e) => handleChange('ctaText', e.target.value)}
          placeholder="Afficher le menu"
        />
      </div>

      <div>
        <Label>URL du bouton CTA (optionnel)</Label>
        <Input
          type="url"
          value={data.ctaUrl || ''}
          onChange={(e) => handleChange('ctaUrl', e.target.value)}
          placeholder="https://example.com/menu"
        />
      </div>
    </div>
  )
}

