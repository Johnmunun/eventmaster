"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PhoneMockup } from "@/components/qr-templates/phone-mockup"
import { getTemplateComponent } from "@/components/qr-templates/index"
import { useQRTemplateStore, TemplateType } from "@/lib/stores/qr-template-store"
import { Loader2, ExternalLink, FileText, Image as ImageIcon, Video, Globe, Download, Calendar, Clock, MapPin, Tag, Percent, Euro, Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

// Composant pour afficher un coupon
function CouponDisplay({ couponData }: { 
  couponData: {
    code?: string
    discount?: string
    discountType?: "percentage" | "amount"
    expiresAt?: string
    description?: string
  }
}) {
  const [copied, setCopied] = useState(false)
  
  const handleCopyCode = () => {
    if (couponData.code) {
      navigator.clipboard.writeText(couponData.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatDiscount = () => {
    if (!couponData.discount) return ""
    if (couponData.discountType === "percentage") {
      return `${couponData.discount}%`
    } else {
      return `${couponData.discount}€`
    }
  }

  const formatExpiryDate = (dateStr?: string) => {
    if (!dateStr) return null
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        {/* Badge de réduction */}
        <div className="relative w-full max-w-xs">
          <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-2xl p-8 shadow-2xl transform rotate-[-2deg]">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Tag className="h-8 w-8 text-white" />
                <span className="text-white text-sm font-semibold uppercase tracking-wider">Code Promo</span>
              </div>
              {couponData.discount && (
                <div className="text-6xl font-bold text-white drop-shadow-lg">
                  {formatDiscount()}
                </div>
              )}
              {couponData.discountType === "percentage" && (
                <p className="text-white/90 text-sm">de réduction</p>
              )}
            </div>
          </div>
        </div>

        {/* Code promo */}
        {couponData.code && (
          <div className="w-full max-w-xs space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Code promo</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-card border-2 border-dashed border-primary rounded-lg px-4 py-3 text-center">
                <span className="text-2xl font-bold text-primary tracking-wider">
                  {couponData.code}
                </span>
              </div>
              <Button
                onClick={handleCopyCode}
                size="icon"
                variant="outline"
                className="h-12 w-12"
              >
                {copied ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-green-500 text-center">Code copié !</p>
            )}
          </div>
        )}

        {/* Description */}
        {couponData.description && (
          <div className="w-full max-w-xs">
            <p className="text-sm text-muted-foreground text-center">
              {couponData.description}
            </p>
          </div>
        )}

        {/* Date d'expiration */}
        {couponData.expiresAt && (
          <div className="w-full max-w-xs">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Valable jusqu'au {formatExpiryDate(couponData.expiresAt)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Composant pour afficher les QR codes non-template (PDF, IMAGE, URL, etc.)
function NonTemplateContent({ type, originalData }: { type: string; originalData: any }) {
  const data = typeof originalData === 'string' ? originalData : originalData

  switch (type) {
    case "PDF":
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
          <FileText className="h-16 w-16 text-primary" />
          <h2 className="text-xl font-bold text-center">Document PDF</h2>
          <p className="text-sm text-muted-foreground text-center">
            Cliquez sur le bouton ci-dessous pour télécharger ou visualiser le document
          </p>
          <Button asChild className="w-full">
            <a href={data} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Ouvrir le PDF
            </a>
          </Button>
        </div>
      )

    case "IMAGE":
      // Gérer les galeries d'images
      let imageUrls: string[] = []
      try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data
        if (parsed.gallery && Array.isArray(parsed.gallery)) {
          imageUrls = parsed.gallery
        } else {
          imageUrls = [data]
        }
      } catch {
        imageUrls = [data]
      }

      return (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative w-full aspect-square rounded-lg overflow-hidden">
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      )

    case "VIDEO":
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
          <Video className="h-16 w-16 text-primary" />
          <h2 className="text-xl font-bold text-center">Vidéo</h2>
          <Button asChild className="w-full">
            <a href={data} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Ouvrir la vidéo
            </a>
          </Button>
        </div>
      )

    case "URL":
    case "CUSTOM":
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
          <Globe className="h-16 w-16 text-primary" />
          <h2 className="text-xl font-bold text-center">Lien externe</h2>
          <p className="text-sm text-muted-foreground text-center break-all px-4">
            {data}
          </p>
          <Button asChild className="w-full">
            <a href={data} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Ouvrir le lien
            </a>
          </Button>
        </div>
      )

    case "TEXT":
      return (
        <div className="flex flex-col h-full p-6">
          <div className="flex-1 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Texte</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
              {data}
            </p>
          </div>
        </div>
      )

    case "PROGRAM":
      // Parser les données du programme
      let programEvents: Array<{
        time: string
        title: string
        description: string
        location: string
      }> = []
      
      try {
        let parsed: any
        if (typeof data === 'string') {
          // Essayer de parser si c'est une string
          try {
            parsed = JSON.parse(data)
          } catch {
            parsed = data
          }
        } else {
          parsed = data
        }
        
        // Vérifier différentes structures possibles
        if (parsed && typeof parsed === 'object') {
          if (parsed.events && Array.isArray(parsed.events)) {
            programEvents = parsed.events
          } else if (Array.isArray(parsed)) {
            programEvents = parsed
          } else if (parsed.type === 'program' && parsed.events) {
            programEvents = parsed.events
          }
        }
      } catch (e) {
        console.error("Erreur parsing programme:", e)
        // Si le parsing échoue, essayer de traiter data comme un tableau
        if (Array.isArray(data)) {
          programEvents = data
        }
      }

      return (
        <div className="flex flex-col h-full p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Programme</h2>
            <p className="text-sm text-muted-foreground">Découvrez le programme de l'événement</p>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4">
            {programEvents.length > 0 ? (
              programEvents.map((event, index) => (
                <div key={index} className="bg-card border rounded-lg p-4 space-y-2">
                  {event.time && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                  )}
                  {event.title && (
                    <h3 className="font-semibold text-base">{event.title}</h3>
                  )}
                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun événement dans le programme
              </p>
            )}
          </div>
        </div>
      )

    case "COUPON":
      // Parser les données du coupon
      let couponData: {
        code?: string
        discount?: string
        discountType?: "percentage" | "amount"
        expiresAt?: string
        description?: string
      } = {}
      
      try {
        let parsed: any
        if (typeof data === 'string') {
          try {
            parsed = JSON.parse(data)
          } catch {
            parsed = data
          }
        } else {
          parsed = data
        }
        
        if (parsed && typeof parsed === 'object') {
          if (parsed.type === 'coupon') {
            couponData = {
              code: parsed.code,
              discount: parsed.discount,
              discountType: parsed.discountType || parsed.type,
              expiresAt: parsed.expiresAt,
              description: parsed.description,
            }
          } else {
            couponData = parsed
          }
        }
      } catch (e) {
        console.error("Erreur parsing coupon:", e)
      }

      return <CouponDisplay couponData={couponData} />

    default:
      // Pour les types non supportés, ne pas utiliser data comme URL si c'est du JSON
      const isJsonData = typeof data === 'string' && (data.startsWith('{') || data.startsWith('['))
      const isValidUrl = typeof data === 'string' && !isJsonData && (data.startsWith('http://') || data.startsWith('https://') || data.startsWith('/'))
      
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
          <p className="text-muted-foreground text-center">
            Type de contenu non supporté: {type}
          </p>
          {isValidUrl && (
            <Button asChild>
              <a href={data} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ouvrir le contenu
              </a>
            </Button>
          )}
          {isJsonData && (
            <p className="text-xs text-muted-foreground text-center px-4">
              Ce QR code contient des données structurées qui ne peuvent pas être affichées directement.
            </p>
          )}
        </div>
      )
  }
}

export default function QRPublicPage() {
  const params = useParams()
  const qrId = params.id as string
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [qrCodeType, setQrCodeType] = useState<string | null>(null)
  const [qrCodeData, setQrCodeData] = useState<any>(null)
  const [templateData, setTemplateData] = useState<any>(null)
  
  const { setSelectedTemplate, updateGlobalConfig, updateTemplateData } = useQRTemplateStore()

  useEffect(() => {
    const loadQRData = async () => {
      try {
        // Décoder l'ID au cas où il serait encodé
        let decodedId = qrId
        try {
          // Essayer de décoder l'URL si elle contient des données JSON encodées
          decodedId = decodeURIComponent(qrId)
          // Si c'est du JSON, c'est un ancien QR code avec les données directement
          if (decodedId.startsWith('{') || decodedId.startsWith('[')) {
            setError("Ce QR code utilise un ancien format. Veuillez générer un nouveau QR code.")
            setLoading(false)
            return
          }
        } catch (e) {
          // Si le décodage échoue, utiliser l'ID original
          decodedId = qrId
        }

        // Essayer d'abord par code (le plus probable)
        let response = await fetch(`/api/qrcodes/code/${encodeURIComponent(decodedId)}/template`)
        let data = await response.json()

        // Si pas trouvé par code, essayer par ID
        if (!response.ok || !data.success) {
          response = await fetch(`/api/qrcodes/${encodeURIComponent(decodedId)}/template`)
          data = await response.json()
        }

        if (!response.ok || !data.success) {
          setError(data.error || "QR code introuvable. Assurez-vous que le QR code a été généré avec la dernière version du système.")
          return
        }

        // Stocker les données
        setQrCodeType(data.qrCodeType)
        setQrCodeData(data.qrCodeData)
        setTemplateData(data.templateData)

        // Si c'est un template, charger les données dans le store
        if (data.templateData && data.templateData.type) {
          const templateType = data.templateData.type as TemplateType
          if (templateType) {
            setSelectedTemplate(templateType)
            // Charger la configuration globale (couleurs, typographie, etc.)
            if (data.templateData.globalConfig) {
              updateGlobalConfig(data.templateData.globalConfig)
            }
            // Charger les données spécifiques du template (contenu)
            if (data.templateData.templateData) {
              updateTemplateData(data.templateData.templateData)
            }
          }
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
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

  // TOUJOURS afficher le template si disponible (tous les QR codes utilisent maintenant les templates)
  if (TemplateComponent && selectedTemplate && templateData) {
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

  // Fallback : afficher le contenu non-template pour les anciens QR codes
  if (qrCodeType && qrCodeData && qrCodeType !== "TEMPLATE") {
    // Déterminer les données à afficher
    // Pour les nouveaux QR codes, les données sont dans originalData
    // Pour les anciens QR codes, les données peuvent être directement dans qrCodeData
    let dataToDisplay = qrCodeData.originalData
    
    // Si originalData n'existe pas, essayer d'autres champs selon le type
    if (dataToDisplay === undefined || dataToDisplay === null) {
      // Pour les types qui stockent des données JSON structurées
      if (qrCodeType === "PROGRAM" || qrCodeType === "FEEDBACK" || qrCodeType === "COUPON" || 
          qrCodeType === "VCARD" || qrCodeType === "PLAYLIST" || qrCodeType === "GALLERY") {
        // Ces types peuvent avoir les données directement dans qrCodeData
        // ou dans un champ spécifique
        if (qrCodeType === "PROGRAM" && qrCodeData.events) {
          dataToDisplay = qrCodeData
        } else if (qrCodeData.data) {
          dataToDisplay = qrCodeData.data
        } else {
          // Essayer de trouver les données dans qrCodeData directement
          dataToDisplay = qrCodeData
        }
      } else {
        // Pour les autres types (URL, PDF, IMAGE, etc.), utiliser url ou les données directement
        dataToDisplay = qrCodeData.url || qrCodeData
      }
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md">
          <PhoneMockup>
            <NonTemplateContent 
              type={qrCodeType} 
              originalData={dataToDisplay} 
            />
          </PhoneMockup>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <p className="text-muted-foreground mb-4">Aucune donnée disponible</p>
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

