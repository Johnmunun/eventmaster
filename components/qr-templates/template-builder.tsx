"use client"

import { useQRTemplateStore, TemplateType } from "@/lib/stores/qr-template-store"
import { getTemplateComponent, getTemplateForm } from "./index"
import { PhoneMockup } from "./phone-mockup"
import { GlobalConfigForm } from "./global-config-form"
import { TemplateSelector } from "./template-selector"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, ArrowLeft, QrCode } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

interface TemplateBuilderProps {
  onNext?: () => void
  onSave?: (templateData: any) => void
  onBack?: () => void
}

export function TemplateBuilder({ onNext, onSave, onBack }: TemplateBuilderProps) {
  const { selectedTemplate, globalConfig, templateData, exportToJSON, setSelectedTemplate } = useQRTemplateStore()
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'preview' | 'qrcode'>('preview')
  const [hoveredTemplate, setHoveredTemplate] = useState<TemplateType | null>(null)
  
  // Utiliser le template survolé pour la preview, sinon le template sélectionné
  const previewTemplate = hoveredTemplate || selectedTemplate
  const TemplateComponent = previewTemplate ? getTemplateComponent(previewTemplate) : null
  const TemplateForm = selectedTemplate ? getTemplateForm(selectedTemplate) : null

  const handleNext = async () => {
    if (!selectedTemplate) {
      toast.error("Veuillez sélectionner un template")
      return
    }

    setIsLoading(true)
    try {
      // Si onNext est fourni, l'utiliser (pour passer à l'étape suivante)
      if (onNext) {
        onNext()
      } else if (onSave) {
        // Sinon, utiliser onSave si fourni
        const jsonData = exportToJSON()
        await onSave(jsonData)
      } else {
        toast.error("Aucune action configurée")
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur", {
        description: "Une erreur est survenue",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (selectedTemplate) {
      setSelectedTemplate(null)
    } else if (onBack) {
      onBack()
    }
  }

  // Rendre le mockup par défaut avec QR code
  const renderDefaultMockup = () => {
    // Pattern QR code réaliste (pattern fixe pour éviter les changements aléatoires)
    const qrPattern = [
      [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
      [1,0,1,0,1,1,0,1,1,0,1,1,0,1,0,1,0,1,0],
      [0,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,1,0,0],
      [1,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,1,0],
      [0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0],
      [1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1],
      [1,0,1,1,1,0,1,0,1,0,0,1,0,1,0,1,1,0,1],
      [1,0,1,1,1,0,1,0,0,1,0,0,0,1,0,1,1,0,1],
      [1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,0,0,0,1],
      [1,1,1,1,1,1,1,0,0,1,0,1,0,1,1,1,1,1,1],
    ]

    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-white">
        {/* QR Code au centre avec bordure en pointillés */}
        <div className="relative mb-8">
          <div 
            className="w-48 h-48 border-2 border-dashed rounded-2xl flex items-center justify-center" 
            style={{ borderColor: 'hsl(var(--primary))' }}
          >
            <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center shadow-lg p-2">
              <div className="relative w-full h-full">
                {/* QR Code pattern */}
                <div className="w-full h-full" style={{ display: 'grid', gridTemplateColumns: 'repeat(19, 1fr)', gap: 0 }}>
                  {qrPattern.flat().map((cell, i) => (
                    <div 
                      key={i} 
                      className={`${cell === 1 ? 'bg-black' : 'bg-white'}`}
                      style={{ aspectRatio: '1' }}
                    />
                  ))}
                </div>
                {/* Logo au centre */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center shadow-sm">
                    <span className="text-[10px] font-bold leading-tight">LOGO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Texte en bas avec couleur du thème */}
        <div className="text-center space-y-1 px-4">
          <p className="text-base font-semibold" style={{ color: 'hsl(var(--primary))' }}>
            Sélectionnez un
          </p>
          <p className="text-base font-semibold" style={{ color: 'hsl(var(--primary))' }}>
            type de code QR
          </p>
          <p className="text-base font-semibold" style={{ color: 'hsl(var(--primary))' }}>
            sur la gauche
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Colonne gauche : Configuration */}
      <div className="order-2 lg:order-1 flex flex-col h-full min-h-0">
        {/* Bouton retour */}
        {selectedTemplate && (
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto pr-2 drawer-scrollbar space-y-6">
          {!selectedTemplate ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">Sélectionnez un template</h3>
              <TemplateSelector onHover={setHoveredTemplate} />
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-4">Configuration du template</h3>
                {TemplateForm && <TemplateForm />}
              </div>
              <GlobalConfigForm />
            </>
          )}
        </div>
        
        {/* Bouton Suivant fixe en bas - toujours visible */}
        {selectedTemplate && (
          <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 z-10">
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Chargement...
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Colonne droite : Preview mobile */}
      <div className="order-1 lg:order-2 flex flex-col items-center lg:sticky lg:top-0 h-full">
        {/* Toggle Switch - seulement si un template est sélectionné */}
        {selectedTemplate && (
          <div className="mb-4 w-full" style={{ maxWidth: selectedTemplate === 'whatsapp' ? '320px' : '280px' }}>
            <div className="relative inline-flex rounded-lg border-2 border-primary overflow-hidden bg-white">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-6 py-2 text-sm font-bold transition-all ${
                  viewMode === 'preview'
                    ? 'bg-primary text-white'
                    : 'bg-white text-primary'
                }`}
              >
                Aperçu
              </button>
              <button
                onClick={() => setViewMode('qrcode')}
                className={`px-6 py-2 text-sm font-bold transition-all ${
                  viewMode === 'qrcode'
                    ? 'bg-primary text-white'
                    : 'bg-white text-primary'
                }`}
              >
                Code QR
              </button>
            </div>
          </div>
        )}
        
        <div className="relative">
          {viewMode === 'preview' || !selectedTemplate ? (
            <PhoneMockup 
              width={previewTemplate === 'whatsapp' ? 320 : 280}
              height={previewTemplate === 'whatsapp' ? 640 : 560}
            >
              {TemplateComponent ? (
                <TemplateComponent />
              ) : (
                renderDefaultMockup()
              )}
            </PhoneMockup>
          ) : (
            <div className="w-[280px] h-[560px] flex items-center justify-center bg-white rounded-[2.5rem] border-4 border-gray-900">
              <div className="text-center p-6">
                <p className="text-gray-500 text-sm mb-4">Aperçu QR Code</p>
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
