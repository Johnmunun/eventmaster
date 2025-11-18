"use client"

import { useQRTemplateStore } from "@/lib/stores/qr-template-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function WifiForm() {
  const { templateData, updateTemplateData } = useQRTemplateStore()
  const data = templateData as any

  const handleChange = (field: string, value: any) => {
    updateTemplateData({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Nom du réseau (SSID)</Label>
        <Input
          value={data.networkName || ''}
          onChange={(e) => handleChange('networkName', e.target.value)}
          placeholder="MonRéseauWiFi"
        />
      </div>

      <div>
        <Label>Mot de passe</Label>
        <Input
          type="password"
          value={data.password || ''}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="Mot de passe"
        />
      </div>

      <div>
        <Label>Type de sécurité</Label>
        <Select
          value={data.securityType || 'WPA2'}
          onValueChange={(value) => handleChange('securityType', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WPA2">WPA2</SelectItem>
            <SelectItem value="WPA">WPA</SelectItem>
            <SelectItem value="WEP">WEP</SelectItem>
            <SelectItem value="None">Aucune</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Message informatif (optionnel)</Label>
        <Textarea
          value={data.message || ''}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Instructions de connexion..."
          rows={3}
        />
      </div>
    </div>
  )
}


