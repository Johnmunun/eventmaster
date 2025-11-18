"use client"

import { useQRTemplateStore } from "@/lib/stores/qr-template-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function WhatsAppForm() {
  const { templateData, updateTemplateData } = useQRTemplateStore()
  const data = templateData as any

  const handleChange = (field: string, value: any) => {
    updateTemplateData({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Numéro WhatsApp</Label>
        <Input
          type="tel"
          value={data.phoneNumber || ''}
          onChange={(e) => handleChange('phoneNumber', e.target.value)}
          placeholder="0998 655 048"
        />
        <p className="text-xs text-gray-500 mt-1">
          Le numéro de téléphone auquel le QR code ouvrira une conversation WhatsApp
        </p>
      </div>

      <div>
        <Label>Message pré-rempli (optionnel)</Label>
        <Textarea
          value={data.message || ''}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="bonjour vous allez bien"
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">
          Message qui sera pré-rempli dans la conversation WhatsApp (modifiable par l'utilisateur)
        </p>
      </div>
    </div>
  )
}


