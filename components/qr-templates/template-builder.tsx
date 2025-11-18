"use client"

import { useQRTemplateStore } from "@/lib/stores/qr-template-store"
import { getTemplateComponent, getTemplateForm } from "./index"
import { PhoneMockup } from "./phone-mockup"
import { GlobalConfigForm } from "./global-config-form"
import { TemplateSelector } from "./template-selector"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

interface TemplateBuilderProps {
  onSave?: (templateData: any) => void
}

export function TemplateBuilder({ onSave }: TemplateBuilderProps) {
  const { selectedTemplate, globalConfig, templateData, exportToJSON } = useQRTemplateStore()
  const [isSaving, setIsSaving] = useState(false)
  const [viewMode, setViewMode] = useState<'preview' | 'qrcode'>('preview')
  
  const TemplateComponent = selectedTemplate ? getTemplateComponent(selectedTemplate) : null
  const TemplateForm = selectedTemplate ? getTemplateForm(selectedTemplate) : null

  const handleSave = async () => {
    if (!selectedTemplate) {
      toast.error("Veuillez sélectionner un template")
      return
    }

    setIsSaving(true)
    try {
      const jsonData = exportToJSON()
      
      if (onSave) {
        await onSave(jsonData)
      } else {
        // Par défaut, on peut sauvegarder via une API
        toast.success("Template sauvegardé !", {
          description: "Les données ont été exportées",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      toast.error("Erreur", {
        description: "Impossible de sauvegarder le template",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Colonne gauche : Configuration */}
      <div className="space-y-6 order-2 lg:order-1 flex flex-col h-full min-h-0 overflow-y-auto pr-2 drawer-scrollbar">
        {!selectedTemplate ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">Sélectionnez un template</h3>
            <TemplateSelector />
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-lg font-semibold mb-4">Configuration du template</h3>
              {TemplateForm && <TemplateForm />}
            </div>
            <GlobalConfigForm />
            <div className="pt-4 border-t">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                {isSaving ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder le template
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Colonne droite : Preview mobile */}
      <div className="order-1 lg:order-2 flex flex-col items-center lg:sticky lg:top-0">
        {/* Toggle Switch */}
        <div className="mb-4 w-full max-w-[280px]">
          <div className="relative inline-flex rounded-lg border-2 border-green-500 overflow-hidden bg-white">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-6 py-2 text-sm font-bold transition-all ${
                viewMode === 'preview'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-green-500'
              }`}
            >
              Aperçu
            </button>
            <button
              onClick={() => setViewMode('qrcode')}
              className={`px-6 py-2 text-sm font-bold transition-all ${
                viewMode === 'qrcode'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-green-500'
              }`}
            >
              Code QR
            </button>
          </div>
        </div>
        
        <div className="relative">
          {viewMode === 'preview' ? (
            <PhoneMockup>
              {TemplateComponent ? (
                <TemplateComponent />
              ) : (
                <div className="h-full flex items-center justify-center p-6">
                  <div className="text-center text-gray-400">
                    <span className="text-4xl mb-2 block">📱</span>
                    <p className="text-sm">Sélectionnez un template</p>
                  </div>
                </div>
              )}
            </PhoneMockup>
          ) : (
            <div className="w-[280px] h-[560px] flex items-center justify-center bg-white rounded-[2.5rem] border-4 border-gray-900">
              <div className="text-center p-6">
                <p className="text-gray-500 text-sm mb-4">Aperçu QR Code</p>
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">QR Code</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
