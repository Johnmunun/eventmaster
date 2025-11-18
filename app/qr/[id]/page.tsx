"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PhoneMockup } from "@/components/qr-templates/phone-mockup"
import { getTemplateComponent } from "@/components/qr-templates/index"
import { useQRTemplateStore, TemplateType } from "@/lib/stores/qr-template-store"
import { Loader2 } from "lucide-react"

export default function QRPublicPage() {
  const params = useParams()
  const qrId = params.id as string
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { setSelectedTemplate, updateGlobalConfig, updateTemplateData } = useQRTemplateStore()

  useEffect(() => {
    const loadQRData = async () => {
      try {
        // Essayer d'abord avec l'ID, puis avec le code
        let response = await fetch(`/api/qrcodes/${qrId}/template`)
        let data = await response.json()

        // Si pas trouvé par ID, essayer par code
        if (!response.ok || !data.success) {
          response = await fetch(`/api/qrcodes/code/${qrId}/template`)
          data = await response.json()
        }

        if (!response.ok || !data.success) {
          setError(data.error || "QR code introuvable")
          return
        }

        // Charger les données dans le store
        if (data.templateData) {
          setSelectedTemplate(data.templateData.type as TemplateType)
          updateGlobalConfig(data.templateData.globalConfig || {})
          updateTemplateData(data.templateData.templateData || {})
        }
      } catch (err) {
        console.error("Erreur lors du chargement:", err)
        setError("Erreur de chargement")
      } finally {
        setLoading(false)
      }
    }

    if (qrId) {
      loadQRData()
    }
  }, [qrId, setSelectedTemplate, updateGlobalConfig, updateTemplateData])

  const { selectedTemplate } = useQRTemplateStore()
  const TemplateComponent = selectedTemplate ? getTemplateComponent(selectedTemplate) : null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error || !TemplateComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Template introuvable"}</p>
          <a
            href="/"
            className="text-primary hover:underline"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <PhoneMockup>
          <TemplateComponent />
        </PhoneMockup>
      </div>
    </div>
  )
}

