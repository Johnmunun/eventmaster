/**
 * Générateur QR dynamique multi-étapes
 * Similaire à online-qr-generator.com
 * Supporte: URL, PDF, Images, Vidéo, Texte, Carte d'invité, WhatsApp, Réseaux sociaux
 */
"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { TemplateBuilder } from "@/components/qr-templates/template-builder"
import { useQRTemplateStore, TemplateType } from "@/lib/stores/qr-template-store"
import { getTemplateComponent } from "@/components/qr-templates/index"
import { PhoneMockup } from "@/components/qr-templates/phone-mockup"
import { QRAppearanceStep, QRAppearanceConfig } from "./qr-appearance-step"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  QrCode,
  Plus, 
  Link, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Type, 
  User, 
  MessageCircle, 
  Share2,
  Palette,
  Upload,
  Loader2,
  Sparkles,
  Check,
  Circle,
  Square,
  Shapes,
  Utensils,
  Wifi,
  Calendar,
  CreditCard,
  Music,
  Image,
  MessageSquare,
  Radio,
  Mail,
  Phone,
  Building,
  MapPin,
  Bitcoin,
  Ticket
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
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
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FormSection } from "@/components/ui/form-section"
import { FileInput } from "@/components/ui/file-input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type QRGeneratorDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onQRCodeCreated?: () => void
}

type QRType = 
  | "URL" 
  | "PDF" 
  | "IMAGE" 
  | "VIDEO" 
  | "TEXT" 
  | "GUEST_CARD" 
  | "WHATSAPP" 
  | "SOCIAL"
  | "MENU"
  | "WIFI"
  | "PROGRAM"
  | "VCARD"
  | "COUPON"
  | "PLAYLIST"
  | "GALLERY"
  | "FEEDBACK"
  | "LIVE_STREAM"
  | "EMAIL"
  | "SMS"
  | "LOCATION"
  | "PHONE"
  | "BITCOIN"
  | "EVENTBRITE"

interface QRTypeOption {
  id: QRType
  label: string
  icon: React.ReactNode
  description: string
  color: string
}

const QR_TYPES: QRTypeOption[] = [
  // TYPES ÉVÉNEMENTIELS (en premier, affichés par 3)
  {
    id: "EVENTBRITE",
    label: "Billet Événement",
    icon: <Ticket className="h-6 w-6" />,
    description: "Ticket pour événement",
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "GUEST_CARD",
    label: "Carte d'invité",
    icon: <User className="h-6 w-6" />,
    description: "Nom + Table (mariages)",
    color: "from-orange-500 to-orange-600"
  },
  {
    id: "PROGRAM",
    label: "Programme",
    icon: <Calendar className="h-6 w-6" />,
    description: "Programme de l'événement",
    color: "from-rose-500 to-rose-600"
  },
  {
    id: "MENU",
    label: "Menu",
    icon: <Utensils className="h-6 w-6" />,
    description: "Menu du repas",
    color: "from-amber-500 to-amber-600"
  },
  {
    id: "LIVE_STREAM",
    label: "Live Stream",
    icon: <Radio className="h-6 w-6" />,
    description: "Diffusion en direct",
    color: "from-red-500 to-red-600"
  },
  {
    id: "GALLERY",
    label: "Galerie",
    icon: <Image className="h-6 w-6" />,
    description: "Galerie photo",
    color: "from-fuchsia-500 to-fuchsia-600"
  },
  {
    id: "FEEDBACK",
    label: "Feedback",
    icon: <MessageSquare className="h-6 w-6" />,
    description: "Formulaire de satisfaction",
    color: "from-lime-500 to-lime-600"
  },
  {
    id: "COUPON",
    label: "Coupon",
    icon: <CreditCard className="h-6 w-6" />,
    description: "Code promo/Réduction",
    color: "from-yellow-500 to-yellow-600"
  },
  {
    id: "PLAYLIST",
    label: "Playlist",
    icon: <Music className="h-6 w-6" />,
    description: "Playlist musicale",
    color: "from-violet-500 to-violet-600"
  },
  // AUTRES TYPES
  {
    id: "SOCIAL",
    label: "Réseaux sociaux",
    icon: <Share2 className="h-6 w-6" />,
    description: "YouTube, Instagram, Facebook",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    id: "WIFI",
    label: "Wi-Fi",
    icon: <Wifi className="h-6 w-6" />,
    description: "Connexion Wi-Fi",
    color: "from-cyan-500 to-cyan-600"
  },
  {
    id: "VCARD",
    label: "vCard",
    icon: <User className="h-6 w-6" />,
    description: "Carte de visite",
    color: "from-teal-500 to-teal-600"
  },
  {
    id: "URL",
    label: "URL",
    icon: <Link className="h-6 w-6" />,
    description: "Lien vers un site web",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "PDF",
    label: "PDF",
    icon: <FileText className="h-6 w-6" />,
    description: "Document PDF",
    color: "from-red-500 to-red-600"
  },
  {
    id: "IMAGE",
    label: "Images",
    icon: <ImageIcon className="h-6 w-6" />,
    description: "Une ou plusieurs images",
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "VIDEO",
    label: "Vidéo",
    icon: <Video className="h-6 w-6" />,
    description: "Lien vers une vidéo",
    color: "from-pink-500 to-pink-600"
  },
  {
    id: "TEXT",
    label: "Texte",
    icon: <Type className="h-6 w-6" />,
    description: "Texte personnalisé",
    color: "from-green-500 to-green-600"
  },
  {
    id: "WHATSAPP",
    label: "WhatsApp",
    icon: <MessageCircle className="h-6 w-6" />,
    description: "Numéro WhatsApp",
    color: "from-emerald-500 to-emerald-600"
  },
  {
    id: "EMAIL",
    label: "Email",
    icon: <Mail className="h-6 w-6" />,
    description: "Adresse email",
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "SMS",
    label: "SMS",
    icon: <MessageCircle className="h-6 w-6" />,
    description: "Message texte",
    color: "from-green-500 to-green-600"
  },
  {
    id: "LOCATION",
    label: "Localisation",
    icon: <MapPin className="h-6 w-6" />,
    description: "Coordonnées GPS",
    color: "from-red-500 to-red-600"
  },
  {
    id: "PHONE",
    label: "Téléphone",
    icon: <Phone className="h-6 w-6" />,
    description: "Numéro de téléphone",
    color: "from-teal-500 to-teal-600"
  },
  {
    id: "BITCOIN",
    label: "Bitcoin",
    icon: <Bitcoin className="h-6 w-6" />,
    description: "Adresse Bitcoin",
    color: "from-orange-500 to-orange-600"
  },
]

// Schémas de validation par type
const urlSchema = z.object({
  url: z.string().url("URL invalide").min(1, "L'URL est requise"),
})

// PDF : seul le nom est obligatoire (dans customizationForm), le fichier est optionnel
const pdfSchema = z.object({
  pdfFile: z.instanceof(File).optional().or(z.any()),
})

// IMAGE : seul le nom est obligatoire, les images sont optionnelles
const imageSchema = z.object({
  images: z.array(z.instanceof(File)).optional().or(z.any()),
})

const videoSchema = z.object({
  videoUrl: z.string().url("URL vidéo invalide").min(1, "L'URL vidéo est requise"),
})

const textSchema = z.object({
  text: z.string().min(1, "Le texte est requis").max(1000, "Texte trop long"),
})

const guestCardSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  table: z.string().min(1, "Le numéro de table est requis"),
})

const whatsappSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Numéro de téléphone invalide"),
  message: z.string().optional(),
})

const socialSchema = z.object({
  platform: z.enum(["facebook", "instagram", "twitter", "linkedin", "youtube", "tiktok"]),
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
})

// Schémas événementiels
const menuSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  items: z.array(z.object({
    name: z.string().min(1, "Le nom du plat est requis"),
    description: z.string().optional(),
    price: z.string().optional(),
    allergens: z.string().optional(),
  })).min(1, "Au moins un plat est requis"),
})

const wifiSchema = z.object({
  ssid: z.string().min(1, "Le nom du réseau est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
  security: z.enum(["WPA", "WPA2", "WEP", "nopass"]).default("WPA2"),
  hidden: z.boolean().default(false),
})

const programSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  events: z.array(z.object({
    time: z.string().min(1, "L'heure est requise"),
    title: z.string().min(1, "Le titre est requis"),
    description: z.string().optional(),
    location: z.string().optional(),
  })).min(1, "Au moins un événement est requis"),
})

const vcardSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  organization: z.string().optional(),
  title: z.string().optional(),
  email: z.string().email("Email invalide").optional(),
  phone: z.string().optional(),
  website: z.string().url("URL invalide").optional(),
  address: z.string().optional(),
})

const couponSchema = z.object({
  code: z.string().min(1, "Le code est requis"),
  discount: z.string().min(1, "La réduction est requise"),
  type: z.enum(["percentage", "amount"]).default("percentage"),
  expiresAt: z.string().optional(),
  description: z.string().optional(),
})

const playlistSchema = z.object({
  platform: z.enum(["spotify", "youtube", "apple", "custom"]),
  url: z.string().url("URL invalide").optional(),
  title: z.string().min(1, "Le titre est requis"),
  allowSuggestions: z.boolean().default(false),
})

const gallerySchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  allowUpload: z.boolean().default(false),
  images: z.array(z.instanceof(File)).optional(),
})

const feedbackSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  questions: z.array(z.object({
    question: z.string().min(1, "La question est requise"),
    type: z.enum(["rating", "text", "choice"]).default("rating"),
  })).min(1, "Au moins une question est requise"),
})

const liveStreamSchema = z.object({
  platform: z.enum(["youtube", "zoom", "teams", "custom"]),
  url: z.string().url("URL invalide").min(1, "L'URL est requise"),
  title: z.string().min(1, "Le titre est requis"),
  instructions: z.string().optional(),
})

const emailSchema = z.object({
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  subject: z.string().optional(),
  body: z.string().optional(),
})

const smsSchema = z.object({
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  message: z.string().optional(),
})

const locationSchema = z.object({
  latitude: z.string().min(1, "La latitude est requise"),
  longitude: z.string().min(1, "La longitude est requise"),
  name: z.string().optional(),
})

const phoneSchema = z.object({
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
})

const bitcoinSchema = z.object({
  address: z.string().min(1, "L'adresse Bitcoin est requise"),
  amount: z.string().optional(),
  label: z.string().optional(),
  message: z.string().optional(),
})

// eventbriteSchema supprimé - EVENTBRITE utilise le template "eventticket" avec son propre formulaire

const customizationSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Nom trop long"),
  folderId: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur invalide").default("#000000"),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur invalide").default("#FFFFFF"),
  logoFile: z.instanceof(File).optional(),
  pixelShape: z.enum(["square", "round", "mixed"]).default("square"),
})

export function QRGeneratorDrawer({ open, onOpenChange, onQRCodeCreated }: QRGeneratorDrawerProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [totalSteps, setTotalSteps] = useState(3) // 3 étapes : type+contenu -> template -> apparence
  const [selectedType, setSelectedType] = useState<QRType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [qrPreview, setQrPreview] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [folders, setFolders] = useState<Array<{ id: string; name: string }>>([])
  const [qrCodeData, setQrCodeData] = useState<string>("") // Données pour l'étape d'apparence
  const [appearanceConfig, setAppearanceConfig] = useState<QRAppearanceConfig | null>(null)
  const [landingPageConfig, setLandingPageConfig] = useState({
    backgroundColor: "#527AC9",
    textColor: "#FFFFFF",
    showPhone: false,
    showEmail: false,
    showSocial: false,
    showLocation: false,
    phone: "",
    email: "",
    location: "",
    socialLinks: [] as Array<{ platform: string; url: string }>,
    profileImage: null as string | null,
    name: "",
    title: "",
    description: "",
  })

  // Obtenir le schéma selon le type sélectionné
  const getSchemaForType = useCallback((type: QRType | null) => {
    if (!type) return z.object({})
    switch (type) {
      case "URL": return urlSchema
      case "PDF": return pdfSchema
      case "IMAGE": return imageSchema
      case "VIDEO": return videoSchema
      case "TEXT": return textSchema
      case "GUEST_CARD": return guestCardSchema
      case "WHATSAPP": return whatsappSchema
      case "SOCIAL": return socialSchema
      case "MENU": return menuSchema
      case "WIFI": return wifiSchema
      case "PROGRAM": return programSchema
      case "VCARD": return vcardSchema
      case "COUPON": return couponSchema
      case "PLAYLIST": return playlistSchema
      case "GALLERY": return gallerySchema
      case "FEEDBACK": return feedbackSchema
      case "LIVE_STREAM": return liveStreamSchema
      case "EMAIL": return emailSchema
      case "SMS": return smsSchema
      case "LOCATION": return locationSchema
      case "PHONE": return phoneSchema
      case "BITCOIN": return bitcoinSchema
      // EVENTBRITE utilise le template "eventticket" avec son propre formulaire, pas de schéma ici
      default: return z.object({})
    }
  }, [])

  // Formulaires par étape
  const contentForm = useForm<any>({
    resolver: zodResolver(getSchemaForType(selectedType)),
    mode: "onChange", // Valider à chaque changement
  })

  // Mettre à jour le resolver quand selectedType change (sans réinitialiser le formulaire)
  useEffect(() => {
    if (selectedType) {
      // Mettre à jour le resolver avec le nouveau schéma
      const newSchema = getSchemaForType(selectedType)
      contentForm.clearErrors()
      // Réinitialiser le resolver avec le nouveau schéma
      // Note: react-hook-form ne permet pas de changer le resolver dynamiquement
      // On doit donc s'assurer que le resolver est correct dès le départ
    }
  }, [selectedType, contentForm, getSchemaForType])

  const customizationForm = useForm({
    resolver: zodResolver(customizationSchema),
    defaultValues: {
      name: "",
      folderId: "",
      color: "#000000",
      backgroundColor: "#FFFFFF",
      pixelShape: "square" as const,
    },
  })

  // Charger les dossiers
  useEffect(() => {
    if (open) {
      fetchFolders()
    }
  }, [open])

  const fetchFolders = async () => {
    try {
      const response = await fetch("/api/folders")
      const data = await response.json()
      if (data.success) {
        setFolders(data.folders)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des dossiers:", error)
    }
  }

  // Réinitialiser quand le drawer se ferme
  useEffect(() => {
    if (!open) {
      setStep(1)
      setTotalSteps(3)
      setSelectedType(null)
      setQrPreview(null)
      setLogoPreview(null)
      setQrCodeData("")
      contentForm.reset()
      customizationForm.reset()
    }
  }, [open])

  // Gérer l'upload du logo pour prévisualisation
  const handleLogoUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Le fichier est trop volumineux (max 5Mo)")
      return
    }
    
    // Créer une preview locale (base64)
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setLogoPreview(result)
      customizationForm.setValue("logoFile", file)
    }
    reader.readAsDataURL(file)
  }

  // Générer la preview du QR code avec logo
  const generatePreview = useCallback(async () => {
    if (!selectedType) return

    const contentData = contentForm.getValues()
    const customData = customizationForm.getValues()

    // Construire les données selon le type
    let qrData = ""
    
    switch (selectedType) {
      case "URL":
        qrData = contentData.url || ""
        break
      case "PDF":
        // Pour PDF, on génère un QR code qui pointe vers l'URL du PDF uploadé
        // En production, il faudrait uploader le PDF d'abord
        qrData = "https://example.com/pdf-placeholder"
        break
      case "IMAGE":
        // Pour images, on génère un QR code qui pointe vers une galerie
        qrData = "https://example.com/gallery-placeholder"
        break
      case "VIDEO":
        qrData = contentData.videoUrl || ""
        break
      case "TEXT":
        qrData = contentData.text || ""
        break
      case "GUEST_CARD":
        qrData = JSON.stringify({
          firstName: contentData.firstName,
          lastName: contentData.lastName,
          table: contentData.table,
        })
        break
      case "WHATSAPP":
        const whatsappMessage = contentData.message ? encodeURIComponent(contentData.message) : ""
        qrData = `https://wa.me/${contentData.phone.replace(/\D/g, "")}${whatsappMessage ? `?text=${whatsappMessage}` : ""}`
        break
      case "SOCIAL":
        const socialUrls: Record<string, string> = {
          facebook: `https://facebook.com/${contentData.username}`,
          instagram: `https://instagram.com/${contentData.username}`,
          twitter: `https://twitter.com/${contentData.username}`,
          linkedin: `https://linkedin.com/in/${contentData.username}`,
          youtube: `https://youtube.com/@${contentData.username}`,
          tiktok: `https://tiktok.com/@${contentData.username}`,
        }
        qrData = socialUrls[contentData.platform] || ""
        break
      case "MENU":
        // Pour le menu, on génère une URL vers une page de menu
        qrData = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/menu/${Date.now()}`
        break
      case "WIFI":
        // Format Wi-Fi: WIFI:T:WPA2;S:SSID;P:Password;;
        const security = contentData.security || "WPA2"
        const ssid = contentData.ssid || ""
        const password = contentData.password || ""
        qrData = `WIFI:T:${security};S:${ssid};P:${password};;`
        break
      case "PROGRAM":
        // Pour le programme, on génère une URL vers une page de programme
        qrData = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/program/${Date.now()}`
        break
      case "VCARD":
        // Format vCard
        const vcard = [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `FN:${contentData.firstName || ""} ${contentData.lastName || ""}`,
          `N:${contentData.lastName || ""};${contentData.firstName || ""};;;`,
          contentData.organization ? `ORG:${contentData.organization}` : "",
          contentData.title ? `TITLE:${contentData.title}` : "",
          contentData.email ? `EMAIL:${contentData.email}` : "",
          contentData.phone ? `TEL:${contentData.phone}` : "",
          contentData.website ? `URL:${contentData.website}` : "",
          contentData.address ? `ADR:;;${contentData.address};;;;` : "",
          "END:VCARD"
        ].filter(Boolean).join("\n")
        qrData = vcard
        break
      case "COUPON":
        // Pour le coupon, on génère une URL vers une page de coupon
        qrData = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/coupon/${contentData.code || Date.now()}`
        break
      case "PLAYLIST":
        qrData = contentData.url || ""
        break
      case "GALLERY":
        // Pour la galerie, on génère une URL vers une page de galerie
        qrData = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/gallery/${Date.now()}`
        break
      case "FEEDBACK":
        // Pour le feedback, on génère une URL vers un formulaire
        qrData = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/feedback/${Date.now()}`
        break
      case "LIVE_STREAM":
        qrData = contentData.url || ""
        break
      case "EMAIL":
        // Format mailto: avec sujet et corps
        const emailParams = new URLSearchParams()
        if (contentData.subject) emailParams.append("subject", contentData.subject)
        if (contentData.body) emailParams.append("body", contentData.body)
        const emailQuery = emailParams.toString()
        qrData = `mailto:${contentData.email}${emailQuery ? `?${emailQuery}` : ""}`
        break
      case "SMS":
        // Format sms: avec message
        const smsMessage = contentData.message ? encodeURIComponent(contentData.message) : ""
        qrData = `sms:${contentData.phone.replace(/\D/g, "")}${smsMessage ? `?body=${smsMessage}` : ""}`
        break
      case "LOCATION":
        // Format geo: pour les coordonnées GPS
        const lat = contentData.latitude
        const lon = contentData.longitude
        const geoName = contentData.name ? encodeURIComponent(contentData.name) : ""
        qrData = `geo:${lat},${lon}${geoName ? `?q=${geoName}` : ""}`
        break
      case "PHONE":
        // Format tel: pour les numéros de téléphone
        qrData = `tel:${contentData.phone.replace(/\D/g, "")}`
        break
      case "BITCOIN":
        // Format bitcoin: pour les adresses Bitcoin
        const btcParams = new URLSearchParams()
        if (contentData.amount) btcParams.append("amount", contentData.amount)
        if (contentData.label) btcParams.append("label", contentData.label)
        if (contentData.message) btcParams.append("message", contentData.message)
        const btcQuery = btcParams.toString()
        qrData = `bitcoin:${contentData.address}${btcQuery ? `?${btcQuery}` : ""}`
        break
      case "EVENTBRITE":
        qrData = contentData.url || ""
        break
    }

    if (!qrData || qrData.trim() === "") {
      console.log("qrData est vide, skip de la preview")
      return
    }

    // Valider et corriger les couleurs hexadécimales
    const isValidHexColor = (color: string): boolean => {
      if (!color || color === "#") return false
      return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
    }

    let color = customData.color || "#000000"
    let backgroundColor = customData.backgroundColor || "#FFFFFF"
    const pixelShape = customData.pixelShape || "square"

    if (!isValidHexColor(color)) {
      color = "#000000"
    }
    if (!isValidHexColor(backgroundColor)) {
      backgroundColor = "#FFFFFF"
    }

    console.log("Génération preview avec:", { color, backgroundColor, pixelShape, hasLogo: !!logoPreview, qrDataLength: qrData.length })

    // Générer le QR code avec les options de personnalisation
    try {
      const response = await fetch("/api/qrcodes/generate-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: qrData,
          color: color,
          backgroundColor: backgroundColor,
          pixelShape: pixelShape,
          logoBase64: logoPreview || null, // Envoyer le logo en base64 pour la preview
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Erreur API generate-preview:", response.status, errorText)
        return
      }

      const result = await response.json()
      if (result.success) {
        setQrPreview(result.imageUrl)
      } else {
        console.error("Erreur dans la réponse:", result.error)
      }
    } catch (error) {
      console.error("Erreur lors de la génération de la preview:", error)
      // Ne pas bloquer l'interface si la preview échoue
    }
  }, [selectedType, contentForm, customizationForm, logoPreview])

  // Surveiller tous les changements pour preview dynamique
  const watchedContent = contentForm.watch()
  const watchedCustom = customizationForm.watch()

  // Générer la preview en temps réel quand les données changent (seulement pour les étapes 1 et 2)
  // L'étape 3 utilise QRAppearanceStep qui génère le QR code côté client
  useEffect(() => {
    if ((step === 1 || step === 2) && selectedType) {
      const timer = setTimeout(() => {
        generatePreview()
      }, 300) // Debounce pour éviter trop de requêtes
      return () => clearTimeout(timer)
    }
  }, [
    step, 
    selectedType, 
    watchedContent,
    watchedCustom.color,
    watchedCustom.backgroundColor,
    watchedCustom.pixelShape,
    logoPreview,
    generatePreview
  ])

  // Les changements sont déjà surveillés par watchedCustom dans useEffect ci-dessus

  // Mapping entre types de QR codes et templates
  const getTemplateForQRType = (qrType: QRType): TemplateType | null => {
    const mapping: Record<QRType, TemplateType | null> = {
      "URL": "linkpage",
      "PDF": "linkpage",
      "IMAGE": "linkpage",
      "VIDEO": "linkpage",
      "TEXT": "profil",
      "GUEST_CARD": "mariage",
      "WHATSAPP": "whatsapp",
      "SOCIAL": "profil", // L'utilisateur choisira ensuite YouTube/Instagram/Facebook
      "MENU": "linkpage",
      "WIFI": "wifi",
      "PROGRAM": "billet",
      "VCARD": "vcard",
      "COUPON": "offre",
      "PLAYLIST": "linkpage",
      "GALLERY": "linkpage",
      "FEEDBACK": "linkpage",
      "LIVE_STREAM": "concert",
      "EMAIL": "entreprise",
      "SMS": "profil",
      "LOCATION": "localisation",
      "PHONE": "entreprise",
      "BITCOIN": "linkpage",
      "EVENTBRITE": "eventticket",
    }
    return mapping[qrType] || null
  }

  const { setSelectedTemplate: setTemplateType } = useQRTemplateStore()

  const handleTypeSelect = async (type: QRType) => {
    // Initialiser les valeurs par défaut selon le type AVANT de changer le type
    const defaultValues: any = {}
    if (type === "MENU") {
      defaultValues.items = [{ name: "", description: "", price: "", allergens: "" }]
    } else if (type === "PROGRAM") {
      defaultValues.events = [{ time: "", title: "", description: "", location: "" }]
    } else if (type === "FEEDBACK") {
      defaultValues.questions = [{ question: "", type: "rating" }]
    } else if (type === "TEXT") {
      // Initialiser avec une valeur par défaut vide pour TEXT
      defaultValues.text = ""
    } else if (type === "URL") {
      defaultValues.url = ""
    } else if (type === "VIDEO") {
      defaultValues.videoUrl = ""
    }
    
    // Réinitialiser le formulaire AVANT de changer le type pour éviter le flash
    contentForm.reset(defaultValues, {
      keepErrors: false,
      keepDirty: false,
      keepIsSubmitted: false,
      keepTouched: false,
      keepIsValid: false,
      keepSubmitCount: false,
    })
    
    // TOUS les types utilisent le système de template
    const templateType = getTemplateForQRType(type)
    if (templateType) {
      setTemplateType(templateType)
    } else {
      // Si aucun template spécifique, utiliser linkpage par défaut
      setTemplateType("linkpage")
    }
    
    // Changer le type et passer directement à l'étape 2 sans délai pour éviter le flash
    setSelectedType(type)
    // Passer immédiatement à l'étape 2 sans setTimeout pour éviter l'affichage du formulaire
    setStep(2)
  }

  const handleNext = async () => {
    if (step === 1) {
      if (!selectedType) {
        toast.error("Veuillez sélectionner un type de QR code")
        return
      }
      // Validation du formulaire de contenu
      const isValid = await contentForm.trigger()
      if (!isValid) {
        toast.error("Erreur de validation", {
          description: "Veuillez remplir tous les champs requis correctement."
        })
        return
      }
      // Passer directement à l'étape 2 (template)
      setStep(2)
    } else if (step === 2) {
      // Étape 2 (template) : passer à l'étape 3 (apparence)
      // Utiliser NEXT_PUBLIC_APP_URL si disponible, sinon nettoyer window.location.origin
      let baseUrl = 'http://localhost:3000'
      if (typeof window !== 'undefined') {
        if (process.env.NEXT_PUBLIC_APP_URL) {
          baseUrl = process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
        } else {
          // Nettoyer window.location.origin pour enlever les chemins incorrects
          const origin = window.location.origin
          baseUrl = origin.split('/dashboard')[0].split('/api')[0].replace(/\/$/, '')
        }
      }
      const qrCodeId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const qrUrl = `${baseUrl}/qr/${qrCodeId}`
      setQrCodeData(qrUrl)
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmitWithAppearance = async (qrCodeImage: string, appearanceConfig: QRAppearanceConfig) => {
    setIsSubmitting(true)
    try {
      // Valider le formulaire AVANT de récupérer les valeurs
      // Ne valider que si le type nécessite une validation stricte
      const typesRequiringValidation = ["URL", "TEXT", "VIDEO", "WHATSAPP", "SOCIAL", "EMAIL", "SMS", "PHONE", "LOCATION", "BITCOIN", "GUEST_CARD"]
      const needsValidation = selectedType && typesRequiringValidation.includes(selectedType)
      
      if (needsValidation) {
        // Déclencher la validation uniquement pour les champs requis
        await contentForm.trigger()
        const hasErrors = Object.keys(contentForm.formState.errors).length > 0
        
        // Ne bloquer que si il y a vraiment des erreurs
        // trigger() peut retourner false même sans erreurs si le formulaire n'est pas initialisé
        if (hasErrors) {
          console.error("Erreurs de validation du formulaire:", contentForm.formState.errors)
          const firstError = Object.values(contentForm.formState.errors)[0] as any
          const errorMessage = firstError?.message || "Veuillez remplir tous les champs requis"
          toast.error("Erreur de validation", {
            description: errorMessage,
            duration: 4000,
          })
          setIsSubmitting(false)
          return
        }
      }
      
      // Pour les types qui n'ont pas besoin de validation stricte (PDF, IMAGE, etc.)
      // On continue sans valider le formulaire

      const contentData = contentForm.getValues()
      const customData = customizationForm.getValues()
      
      // Debug: Log des données récupérées
      console.log("handleSubmitWithAppearance - Données récupérées:", {
        selectedType,
        contentData,
        customData,
        formErrors: contentForm.formState.errors,
        textValue: contentData.text,
        textLength: contentData.text?.length,
        textTrimmed: contentData.text?.trim(),
      })
      
      // Validation manuelle pour certains types critiques (double vérification)
      if (selectedType) {
        // Valider manuellement les champs requis selon le type
        let hasErrors = false
        let errorMessage = ""
        
        switch (selectedType) {
          case "URL":
            if (!contentData.url || !contentData.url.trim()) {
              hasErrors = true
              errorMessage = "L'URL est requise"
            }
            break
          case "TEXT":
            // Vérifier que le texte existe et n'est pas vide après trim
            const textValue = contentData.text
            console.log("Validation TEXT - textValue:", textValue, "type:", typeof textValue, "trimmed:", textValue?.trim())
            if (!textValue || (typeof textValue === 'string' && !textValue.trim())) {
              hasErrors = true
              errorMessage = "Le texte est requis"
              // Marquer le champ comme erreur dans le formulaire
              contentForm.setError("text", {
                type: "manual",
                message: "Le texte est requis"
              })
            }
            break
          case "VIDEO":
            if (!contentData.videoUrl || !contentData.videoUrl.trim()) {
              hasErrors = true
              errorMessage = "L'URL de la vidéo est requise"
            }
            break
          case "PDF":
            // PDF : seul le nom est obligatoire (dans customizationForm), le fichier est optionnel
            // Pas de validation stricte ici, le fichier peut être ajouté plus tard
            break
          case "IMAGE":
            // IMAGE : seul le nom est obligatoire, les images sont optionnelles
            // Pas de validation stricte ici, les images peuvent être ajoutées plus tard
            break
          case "WHATSAPP":
            if (!contentData.phone || !contentData.phone.trim()) {
              hasErrors = true
              errorMessage = "Le numéro de téléphone est requis"
            }
            break
          // WIFI utilise le template "wifi" avec son propre formulaire, pas de validation ici
          // case "WIFI": supprimé - utilise le template
          case "EMAIL":
            if (!contentData.email || !contentData.email.trim()) {
              hasErrors = true
              errorMessage = "L'adresse email est requise"
            }
            break
          case "PHONE":
            if (!contentData.phone || !contentData.phone.trim()) {
              hasErrors = true
              errorMessage = "Le numéro de téléphone est requis"
            }
            break
          case "SMS":
            if (!contentData.phone || !contentData.phone.trim()) {
              hasErrors = true
              errorMessage = "Le numéro de téléphone est requis"
            }
            break
          case "LOCATION":
            if (!contentData.latitude || !contentData.longitude) {
              hasErrors = true
              errorMessage = "Les coordonnées GPS sont requises"
            }
            break
          case "BITCOIN":
            if (!contentData.address || !contentData.address.trim()) {
              hasErrors = true
              errorMessage = "L'adresse Bitcoin est requise"
            }
            break
          case "PLAYLIST":
            // Pour PLAYLIST, seul le titre est requis, l'URL est optionnelle
            if (!contentData.title || !contentData.title.trim()) {
              hasErrors = true
              errorMessage = "Le titre de la playlist est requis"
            }
            break
          // LIVE_STREAM utilise le template "concert" avec son propre formulaire, pas de validation ici
          // case "LIVE_STREAM": supprimé - utilise le template
          // EVENTBRITE utilise le template "eventticket" avec son propre formulaire, pas de validation ici
          // case "EVENTBRITE": supprimé - utilise le template
          case "SOCIAL":
            if (!contentData.platform || !contentData.username || !contentData.username.trim()) {
              hasErrors = true
              errorMessage = "Le réseau social et le nom d'utilisateur sont requis"
            }
            break
          // Les types suivants utilisent le système de template et ne nécessitent pas de validation stricte ici
          // GALLERY, PROGRAM, FEEDBACK, COUPON, MENU, VCARD sont gérés par leur schéma Zod
        }
        
        if (hasErrors) {
          toast.error("Erreur", {
            description: errorMessage,
          })
          setIsSubmitting(false)
          return
        }
      }

      // TOUJOURS récupérer les données du template depuis le store
      const { exportToJSON } = useQRTemplateStore.getState()
      let templateDataToSave = exportToJSON()

      // Utiliser l'URL qui a été générée pour l'aperçu (qrCodeData)
      // Cette URL sera mise à jour côté serveur avec le vrai code
      const qrUrl = qrCodeData || (() => {
        // Utiliser NEXT_PUBLIC_APP_URL si disponible, sinon nettoyer window.location.origin
        let baseUrl = 'http://localhost:3000'
        if (typeof window !== 'undefined') {
          if (process.env.NEXT_PUBLIC_APP_URL) {
            baseUrl = process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
          } else {
            // Nettoyer window.location.origin pour enlever les chemins incorrects
            const origin = window.location.origin
            baseUrl = origin.split('/dashboard')[0].split('/api')[0].replace(/\/$/, '')
          }
        }
        const tempCode = `temp_${Date.now()}`
        return `${baseUrl}/qr/${tempCode}`
      })()

      // Préparer les données selon le type pour sauvegarder dans la DB
      // TOUJOURS utiliser le système de template
      let qrData = ""
      const formData = new FormData()

      // Intégrer les données de contenu dans le templateData si nécessaire
      if (templateDataToSave && selectedType) {
        // Mettre à jour templateData avec les données du formulaire de contenu
        if (!templateDataToSave.templateData) {
          templateDataToSave.templateData = {}
        }
        
        // Ajouter les données spécifiques selon le type
        switch (selectedType) {
          case "URL":
            templateDataToSave.templateData.url = contentData.url || ""
            break
          case "TEXT":
            templateDataToSave.templateData.text = contentData.text || ""
            break
          case "VIDEO":
            templateDataToSave.templateData.videoUrl = contentData.videoUrl || ""
            break
          case "PLAYLIST":
            templateDataToSave.templateData.title = contentData.title || ""
            templateDataToSave.templateData.platform = contentData.platform || ""
            templateDataToSave.templateData.url = contentData.url || ""
            break
          case "GUEST_CARD":
            templateDataToSave.templateData.firstName = contentData.firstName || ""
            templateDataToSave.templateData.lastName = contentData.lastName || ""
            templateDataToSave.templateData.table = contentData.table || ""
            break
          // Ajouter d'autres types si nécessaire
        }
      }

      // Pour les types qui ne sont pas des templates (URL, TEXT, VIDEO, PDF, IMAGE, etc.)
      // on doit construire qrData avec les données réelles
      // Pour les types template (MENU, PROGRAM, etc.), on utilise qrUrl
      const nonTemplateTypes = ["URL", "TEXT", "VIDEO", "PDF", "IMAGE", "WHATSAPP", "SOCIAL", "EMAIL", "SMS", "PHONE", "LOCATION", "BITCOIN", "WIFI", "VCARD", "GUEST_CARD"]
      
      if (nonTemplateTypes.includes(selectedType || "")) {
        // Construire qrData avec les données réelles selon le type
        switch (selectedType) {
          case "TEXT":
            qrData = contentData.text || ""
            break
          case "URL":
            qrData = contentData.url || ""
            break
          case "VIDEO":
            qrData = contentData.videoUrl || ""
            break
          case "PDF":
            // Pour PDF, le fichier sera uploadé côté serveur
            // On utilise une URL temporaire qui sera remplacée par l'URL réelle après upload
            // Si un fichier est fourni, il sera uploadé dans l'API
            qrData = contentData.pdfUrl || "https://example.com/pdf-placeholder"
            break
          case "IMAGE":
            // Pour IMAGE, les fichiers seront uploadés côté serveur
            // On utilise une URL temporaire qui sera remplacée par l'URL réelle après upload
            if (contentData.images && contentData.images.length > 0) {
              qrData = contentData.imageUrl || "https://example.com/image-placeholder"
            } else {
              qrData = contentData.imageUrl || "https://example.com/image-placeholder"
            }
            break
          case "WHATSAPP":
            const whatsappMessage = contentData.message ? encodeURIComponent(contentData.message) : ""
            qrData = `https://wa.me/${contentData.phone?.replace(/\D/g, "") || ""}${whatsappMessage ? `?text=${whatsappMessage}` : ""}`
            break
          case "SOCIAL":
            const socialUrls: Record<string, string> = {
              facebook: `https://facebook.com/${contentData.username || ""}`,
              instagram: `https://instagram.com/${contentData.username || ""}`,
              twitter: `https://twitter.com/${contentData.username || ""}`,
              linkedin: `https://linkedin.com/in/${contentData.username || ""}`,
              youtube: `https://youtube.com/@${contentData.username || ""}`,
              tiktok: `https://tiktok.com/@${contentData.username || ""}`,
            }
            qrData = socialUrls[contentData.platform || ""] || ""
            break
          case "EMAIL":
            qrData = `mailto:${contentData.email || ""}`
            break
          case "SMS":
            qrData = `sms:${contentData.phone?.replace(/\D/g, "") || ""}`
            break
          case "PHONE":
            qrData = `tel:${contentData.phone?.replace(/\D/g, "") || ""}`
            break
          case "LOCATION":
            qrData = `geo:${contentData.latitude || ""},${contentData.longitude || ""}`
            break
          case "BITCOIN":
            qrData = `bitcoin:${contentData.address || ""}`
            break
          case "WIFI":
            const security = contentData.security || "WPA2"
            const ssid = contentData.ssid || ""
            const password = contentData.password || ""
            qrData = `WIFI:T:${security};S:${ssid};P:${password};;`
            break
          case "VCARD":
            const vcard = [
              "BEGIN:VCARD",
              "VERSION:3.0",
              `FN:${contentData.firstName || ""} ${contentData.lastName || ""}`,
              `N:${contentData.lastName || ""};${contentData.firstName || ""};;;`,
              contentData.organization ? `ORG:${contentData.organization}` : "",
              contentData.jobTitle ? `TITLE:${contentData.jobTitle}` : "",
              contentData.email ? `EMAIL:${contentData.email}` : "",
              contentData.phone ? `TEL:${contentData.phone}` : "",
              contentData.website ? `URL:${contentData.website}` : "",
              "END:VCARD"
            ].filter(Boolean).join("\n")
            qrData = vcard
            break
          case "GUEST_CARD":
            qrData = JSON.stringify({
              firstName: contentData.firstName || "",
              lastName: contentData.lastName || "",
              table: contentData.table || "",
            })
            break
          // PDF et IMAGE seront gérés après l'upload
          default:
            qrData = qrUrl
        }
      } else {
        // Pour les types template (MENU, PROGRAM, etc.), utiliser l'URL
        qrData = qrUrl
      }
      
      formData.append("type", selectedType || "URL")
      
      // Gérer les fichiers uploadés (PDF, images) - les ajouter au formData
      if (selectedType === "PDF" && contentData.pdfFile) {
        formData.append("pdfFile", contentData.pdfFile)
      }
      if (selectedType === "IMAGE" && contentData.images && contentData.images.length > 0) {
        contentData.images.forEach((img: File) => {
          formData.append("images", img)
        })
      }

      // Vérifier que qrData n'est pas vide
      // Pour certains types (GALLERY, PROGRAM, etc.), "{}" peut être valide si les champs optionnels sont vides
      const typesWithOptionalData = ["GALLERY", "PROGRAM", "FEEDBACK", "COUPON", "MENU"]
      const isEmpty = !qrData || qrData.trim() === ""
      const isOnlyEmptyJson = qrData === "{}"
      
      // Pour GUEST_CARD, on a déjà validé les champs, donc si qrData est "{}", c'est une erreur
      if (selectedType === "GUEST_CARD" && isOnlyEmptyJson) {
        console.error("GUEST_CARD - qrData est vide après validation:", {
          qrData,
          contentData,
          formState: contentForm.formState
        })
        const errorMsg = "Impossible de générer le QR code. Les données sont invalides."
        toast.error("Erreur", {
          description: errorMsg,
        })
        setIsSubmitting(false)
        throw new Error(errorMsg)
      }
      
      if (isEmpty || (!typesWithOptionalData.includes(selectedType || "") && isOnlyEmptyJson)) {
        console.error("qrData est vide ou invalide:", qrData, "Type:", selectedType, "contentData:", contentData)
        const errorMsg = "Les données du QR code sont invalides. Veuillez remplir tous les champs requis."
        toast.error("Erreur de validation", {
          description: errorMsg,
          duration: 5000,
        })
        setIsSubmitting(false)
        throw new Error(errorMsg)
      }
      
      // Valider que qrCodeImage est bien fourni
      if (!qrCodeImage || qrCodeImage.trim() === "") {
        const errorMsg = "L'image du QR code n'a pas pu être générée. Veuillez réessayer."
        console.error("qrCodeImage est vide")
        toast.error("Erreur de génération", {
          description: errorMsg,
          duration: 5000,
        })
        setIsSubmitting(false)
        throw new Error(errorMsg)
      }

      console.log("Envoi des données au serveur - Type:", selectedType, "qrData (premiers 100 chars):", qrData.substring(0, 100))

      // Ajouter les données
      formData.append("name", appearanceConfig.name || customData.name || "QR Code")
      formData.append("data", qrData)
      formData.append("color", appearanceConfig.foregroundColor)
      formData.append("backgroundColor", appearanceConfig.backgroundColor)
      formData.append("frameStyle", appearanceConfig.frameStyle || "")
      formData.append("pattern", appearanceConfig.pattern)
      formData.append("cornerStyle", appearanceConfig.cornerStyle)
      
      // Ajouter password si fourni
      if (appearanceConfig.password) {
        formData.append("password", appearanceConfig.password)
      }
      
      // Ajouter templateData si présent
      if (templateDataToSave) {
        formData.append("templateData", JSON.stringify(templateDataToSave))
      }
      
      // Utiliser folderId de appearanceConfig en priorité, sinon customData
      const folderId = appearanceConfig.folderId || customData.folderId
      if (folderId) {
        formData.append("folderId", folderId)
      }
      if (appearanceConfig.logo) {
        // Convertir l'image base64 en blob
        const response = await fetch(appearanceConfig.logo)
        const blob = await response.blob()
        formData.append("logoFile", blob, "logo.png")
      }
      // Ajouter l'image du QR code généré
      const qrImageBlob = await (await fetch(qrCodeImage)).blob()
      formData.append("qrCodeImage", qrImageBlob, "qrcode.png")

      // Valider que tous les champs requis sont présents avant l'envoi
      if (!selectedType) {
        const errorMsg = "Le type de QR code n'est pas défini"
        toast.error("Erreur de validation", {
          description: errorMsg,
          duration: 5000,
        })
        setIsSubmitting(false)
        throw new Error(errorMsg)
      }
      
      console.log("Envoi des données au serveur:", {
        type: selectedType,
        hasQrCodeImage: !!qrCodeImage,
        qrCodeImageLength: qrCodeImage?.length,
        qrDataLength: qrData?.length,
        hasTemplateData: !!templateDataToSave
      })
      
      const response = await fetch("/api/qrcodes/generate", {
        method: "POST",
        body: formData,
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        let errorMsg = "Impossible de générer le QR code"
        try {
          const errorJson = JSON.parse(errorText)
          errorMsg = errorJson.error || errorMsg
        } catch {
          errorMsg = errorText || errorMsg
        }
        console.error("Erreur API:", response.status, errorMsg)
        toast.error("Erreur serveur", {
          description: errorMsg,
          duration: 5000,
        })
        setIsSubmitting(false)
        throw new Error(errorMsg)
      }

      const result = await response.json()

      if (result.success) {
        toast.success("QR code généré avec succès!", {
          description: "Votre QR code a été créé et sauvegardé",
          duration: 4000,
        })
        onQRCodeCreated?.()
        onOpenChange(false)
      } else {
        const errorMsg = result.error || "Impossible de générer le QR code"
        console.error("Erreur dans la réponse:", result)
        toast.error("Erreur de génération", {
          description: errorMsg,
          duration: 5000,
        })
        setIsSubmitting(false)
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error)
      if (!(error instanceof Error && error.message.includes("Erreur"))) {
        toast.error("Erreur inattendue", {
          description: error instanceof Error ? error.message : "Une erreur est survenue lors de la génération",
          duration: 5000,
        })
      }
      setIsSubmitting(false)
      throw error; // Re-lancer l'erreur
    }
  }

  // handleSubmit supprimé - remplacé par handleSubmitWithAppearance

  // Rendre la page de landing personnalisable dans le téléphone
  const renderLandingPage = () => {
    // Utiliser watch() pour les mises à jour en temps réel
    const contentData = contentForm.watch()
    const config = landingPageConfig

    // Récupérer les données selon le type
    let displayName = config.name || contentData.firstName || contentData.name || "Nom"
    let displayTitle = config.title || contentData.title || contentData.lastName || "Titre"
    let displayDescription = config.description || contentData.description || contentData.text || ""

    if (selectedType === "VCARD") {
      displayName = `${contentData.firstName || ""} ${contentData.lastName || ""}`.trim() || displayName
      displayTitle = contentData.title || displayTitle
      displayDescription = contentData.organization ? `Chez ${contentData.organization}` : displayDescription
    } else if (selectedType === "GUEST_CARD") {
      displayName = `${contentData.firstName || ""} ${contentData.lastName || ""}`.trim() || displayName
      displayTitle = contentData.table ? `Table ${contentData.table}` : displayTitle
    }

    return (
      <div 
        className="w-full h-full flex flex-col overflow-y-auto"
        style={{ 
          backgroundColor: config.backgroundColor,
          color: config.textColor 
        }}
      >
        {/* Header avec image de profil */}
        <div className="flex flex-col items-center pt-12 pb-6 px-6">
          {config.profileImage ? (
            <img 
              src={config.profileImage} 
              alt="Profile" 
              className="w-24 h-24 rounded-full border-4 border-white/30 shadow-lg mb-4 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 shadow-lg mb-4 flex items-center justify-center">
              <User className="w-12 h-12" style={{ color: config.textColor, opacity: 0.7 }} />
            </div>
          )}
          <h1 className="text-2xl font-bold text-center mb-2">{displayName}</h1>
          {displayTitle && (
            <p className="text-base text-center opacity-90">{displayTitle}</p>
          )}
        </div>

        {/* Icônes de contact */}
        <div className="flex justify-center gap-4 px-6 mb-6">
          {config.showPhone && config.phone && (
            <a href={`tel:${config.phone}`} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">
              <Phone className="w-6 h-6" />
            </a>
          )}
          {config.showEmail && config.email && (
            <a href={`mailto:${config.email}`} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">
              <Mail className="w-6 h-6" />
            </a>
          )}
          {config.showLocation && config.location && (
            <a href={`geo:${config.location}`} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">
              <MapPin className="w-6 h-6" />
            </a>
          )}
        </div>

        {/* Description */}
        {displayDescription && (
          <div className="px-6 mb-6">
            <p className="text-sm text-center opacity-90 leading-relaxed">
              {displayDescription}
            </p>
          </div>
        )}

        {/* Réseaux sociaux */}
        {config.showSocial && config.socialLinks.length > 0 && (
          <div className="px-6 mb-6">
            <div className="flex justify-center gap-3 flex-wrap">
              {config.socialLinks.map((link, idx) => (
                <a 
                  key={idx}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition"
                >
                  <Share2 className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Informations de contact en bas */}
        <div className="mt-auto px-6 pb-8">
          {config.showPhone && config.phone && (
            <div className="flex items-center gap-3 mb-3">
              <Phone className="w-5 h-5 opacity-80" />
              <span className="text-sm">{config.phone}</span>
            </div>
          )}
          {config.showEmail && config.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 opacity-80" />
              <span className="text-sm">{config.email}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Fonction pour rendre le formulaire de contenu avec design amélioré
  const renderContentForm = () => {
    if (!selectedType) return null

    return (
      <div className="space-y-5">
        {/* URL */}
        {selectedType === "URL" && (
          <div className="space-y-3">
            <Label htmlFor="url" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
              URL du site web
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              className="rounded-[2px] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              {...contentForm.register("url")}
            />
            {contentForm.formState.errors.url && (
              <p className="text-xs text-red-500 mt-1">
                {contentForm.formState.errors.url.message as string}
              </p>
            )}
          </div>
        )}

        {/* PDF */}
        {selectedType === "PDF" && (
          <div>
            <FileInput
              label="Fichier PDF"
              accept=".pdf"
              maxSize={5}
              onFileChange={(file) => {
                if (file) {
                  contentForm.setValue("pdfFile", file)
                } else {
                  contentForm.setValue("pdfFile", null)
                }
              }}
            />
            {contentForm.formState.errors.pdfFile && (
              <p className="text-xs text-red-500 mt-1">
                {contentForm.formState.errors.pdfFile.message as string}
              </p>
            )}
          </div>
        )}

        {/* IMAGE */}
        {selectedType === "IMAGE" && (
          <div>
            <FileInput
              label="Images"
              description="Vous pouvez sélectionner plusieurs images"
              accept="image/*"
              maxSize={5}
              onFileChange={(file) => {
                if (file) {
                  const currentFiles = contentForm.getValues("images") || []
                  contentForm.setValue("images", [...currentFiles, file])
                }
              }}
            />
            {contentForm.formState.errors.images && (
              <p className="text-xs text-red-500 mt-1">
                {contentForm.formState.errors.images.message as string}
              </p>
            )}
          </div>
        )}

        {/* VIDEO */}
        {selectedType === "VIDEO" && (
          <div className="space-y-3">
            <Label htmlFor="videoUrl" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
              URL de la vidéo
            </Label>
            <Input
              id="videoUrl"
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              className="rounded-[2px] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              {...contentForm.register("videoUrl")}
            />
            {contentForm.formState.errors.videoUrl && (
              <p className="text-xs text-red-500 mt-1">
                {contentForm.formState.errors.videoUrl.message as string}
              </p>
            )}
          </div>
        )}

        {/* TEXT */}
        {selectedType === "TEXT" && (
          <div className="space-y-3">
            <Label htmlFor="text" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
              Texte
            </Label>
            <Textarea
              id="text"
              placeholder="Entrez votre texte ici..."
              rows={5}
              className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              {...contentForm.register("text")}
            />
            {contentForm.formState.errors.text && (
              <p className="text-xs text-red-500 mt-1">
                {contentForm.formState.errors.text.message as string}
              </p>
            )}
          </div>
        )}

        {/* GUEST_CARD */}
        {selectedType === "GUEST_CARD" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                  Prénom
                </Label>
                <Input
                  id="firstName"
                  placeholder="Jean"
                  className="rounded-[2px] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  {...contentForm.register("firstName")}
                />
                {contentForm.formState.errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">
                    {contentForm.formState.errors.firstName.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                  Nom
                </Label>
                <Input
                  id="lastName"
                  placeholder="Dupont"
                  className="rounded-[2px] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  {...contentForm.register("lastName")}
                />
                {contentForm.formState.errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">
                    {contentForm.formState.errors.lastName.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="table" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                Numéro de table
              </Label>
              <Input
                id="table"
                placeholder="Table 12"
                className="rounded-[2px] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                {...contentForm.register("table")}
              />
              {contentForm.formState.errors.table && (
                <p className="text-xs text-red-500 mt-1">
                  {contentForm.formState.errors.table.message as string}
                </p>
              )}
            </div>
          </div>
        )}

        {/* WHATSAPP */}
        {selectedType === "WHATSAPP" && (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                Numéro WhatsApp
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+33612345678"
                className="rounded-[2px] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                {...contentForm.register("phone")}
              />
              {contentForm.formState.errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {contentForm.formState.errors.phone.message as string}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <Label htmlFor="message" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                Message (optionnel)
              </Label>
              <Textarea
                id="message"
                placeholder="Message pré-rempli..."
                rows={3}
                className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                {...contentForm.register("message")}
              />
            </div>
          </div>
        )}

        {/* SOCIAL */}
        {selectedType === "SOCIAL" && (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="platform" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                Réseau social
              </Label>
              <Select
                onValueChange={(value) => contentForm.setValue("platform", value)}
              >
                <SelectTrigger className="rounded-md border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Sélectionnez un réseau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
              {contentForm.formState.errors.platform && (
                <p className="text-xs text-red-500 mt-1">
                  {contentForm.formState.errors.platform.message as string}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                Nom d'utilisateur
              </Label>
              <Input
                id="username"
                placeholder="@username"
                className="rounded-[2px] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                {...contentForm.register("username")}
              />
              {contentForm.formState.errors.username && (
                <p className="text-xs text-red-500 mt-1">
                  {contentForm.formState.errors.username.message as string}
                </p>
              )}
            </div>
          </div>
        )}

        {/* WIFI utilise le template "wifi" avec son propre formulaire, pas de formulaire ici */}

        {/* VCARD */}
        {selectedType === "VCARD" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="vcardFirstName" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                  Prénom
                </Label>
                <Input
                  id="vcardFirstName"
                  placeholder="Jean"
                  className="rounded-[2px] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  {...contentForm.register("firstName")}
                />
                {contentForm.formState.errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">
                    {contentForm.formState.errors.firstName.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="vcardLastName" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                  Nom
                </Label>
                <Input
                  id="vcardLastName"
                  placeholder="Dupont"
                  className="rounded-[2px] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  {...contentForm.register("lastName")}
                />
                {contentForm.formState.errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">
                    {contentForm.formState.errors.lastName.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="organization" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                Entreprise
              </Label>
              <Input
                id="organization"
                placeholder="Nom de l'entreprise"
                className="rounded-[2px] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                {...contentForm.register("organization")}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="jobTitle" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                Poste
              </Label>
              <Input
                id="jobTitle"
                placeholder="Directeur"
                className="rounded-[2px] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                {...contentForm.register("title")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@example.com"
                  className="rounded-[2px] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  {...contentForm.register("email")}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+33612345678"
                  className="rounded-[2px] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  {...contentForm.register("phone")}
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="website" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                Site web
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                className="rounded-[2px] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                {...contentForm.register("website")}
              />
            </div>
          </div>
        )}

        {/* PLAYLIST */}
        {selectedType === "PLAYLIST" && (
          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="playlistTitle" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                Titre de la playlist
              </Label>
              <Input
                id="playlistTitle"
                placeholder="Ma playlist"
                className="rounded-[2px] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                {...contentForm.register("title")}
              />
              {contentForm.formState.errors.title && (
                <p className="text-xs text-red-500 mt-1">
                  {contentForm.formState.errors.title.message as string}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <Label htmlFor="playlistUrl" className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                URL (optionnel)
              </Label>
              <Input
                id="playlistUrl"
                type="url"
                placeholder="https://spotify.com/playlist/..."
                className="rounded-[2px] border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                {...contentForm.register("url")}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderStep1 = () => {
    // Obtenir le template correspondant au type sélectionné
    const templateType = selectedType ? getTemplateForQRType(selectedType) : null
    const TemplateComponent = templateType ? getTemplateComponent(templateType) : null
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Colonne gauche : Types de QR + Formulaire */}
        <div className="space-y-6 order-2 lg:order-1 flex flex-col h-full min-h-0">
          {/* Section sélection de type */}
          <div className="flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              1. Type et contenu
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedType ? "Remplissez les informations ci-dessous" : "Sélectionnez le type de contenu"}
            </p>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pr-2 drawer-scrollbar space-y-6">
            {/* Grille de sélection des types */}
            {!selectedType ? (
              <div className="grid grid-cols-3 gap-4">
                {QR_TYPES.map((type) => {
                  const hasTemplate = getTemplateForQRType(type.id) !== null
                  return (
                    <Card
                      key={type.id}
                      className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                        selectedType === type.id
                          ? "ring-2 ring-primary shadow-lg"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => handleTypeSelect(type.id)}
                    >
                      <CardContent className="p-4 flex flex-col items-center justify-center space-y-2 h-full">
                        <div
                          className={`p-3 rounded-lg bg-gradient-to-br ${type.color} text-white shadow-md`}
                        >
                          {type.icon}
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-sm text-gray-900 dark:text-white">
                            {type.label}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {type.description}
                          </p>
                        </div>
                        {hasTemplate && (
                          <Badge className="mt-1 bg-green-500 text-white text-xs">
                            📱 Template
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : selectedType ? (
              /* Formulaire de contenu avec design amélioré */
              <FormSection
                icon={(() => {
                  const type = QR_TYPES.find(t => t.id === selectedType)
                  // Mapping des types aux icônes Lucide
                  const iconMap: Record<string, typeof FileText> = {
                    "URL": Link,
                    "PDF": FileText,
                    "IMAGE": ImageIcon,
                    "VIDEO": Video,
                    "TEXT": Type,
                    "GUEST_CARD": User,
                    "WHATSAPP": MessageCircle,
                    "SOCIAL": Share2,
                    "MENU": Utensils,
                    "WIFI": Wifi,
                    "PROGRAM": Calendar,
                    "VCARD": User,
                    "COUPON": CreditCard,
                    "PLAYLIST": Music,
                    "GALLERY": Image,
                    "FEEDBACK": MessageSquare,
                    "LIVE_STREAM": Radio,
                    "EVENTBRITE": Ticket,
                  }
                  return iconMap[selectedType || ""] || FileText
                })()}
                title={QR_TYPES.find(t => t.id === selectedType)?.label || "Contenu"}
                description={`Renseignez les informations pour ${QR_TYPES.find(t => t.id === selectedType)?.label?.toLowerCase() || "ce type de QR code"}.`}
                collapsible={false}
              >
                {renderContentForm()}
              </FormSection>
            ) : null}
          </div>
        </div>

        {/* Colonne droite : Preview mobile avec template */}
        <div className="order-1 lg:order-2 flex items-start justify-center lg:sticky lg:top-0">
          {selectedType && TemplateComponent ? (
            <PhoneMockup width={280} height={560}>
              <TemplateComponent />
            </PhoneMockup>
          ) : (
            <div className="relative w-[280px] h-[560px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                {/* Barre de statut */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gray-900 flex items-center justify-between px-6 text-white text-xs font-medium z-10">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2 border border-white rounded-sm">
                      <div className="w-full h-full bg-white rounded-sm"></div>
                    </div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-6 h-3 border border-white rounded-sm">
                      <div className="w-4/5 h-full bg-white rounded-sm"></div>
                    </div>
                  </div>
                </div>
                
                {/* Contenu de l'écran */}
                <div className="pt-8 h-full overflow-hidden">
                  <div className="h-full flex items-center justify-center p-6">
                    <div className="text-center text-gray-400">
                      <QrCode className="h-24 w-24 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Sélectionnez un type de QR code</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // renderStep2 supprimé - fusionné avec renderStep1
  // renderStep3 supprimé - remplacé par QRAppearanceStep
  // Code orphelin supprimé (anciens champs de formulaire)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={`w-full sm:max-w-[90vw] lg:max-w-[90vw] p-0 flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 [&>button]:hidden overflow-hidden transition-all duration-300`}
      >
        {/* En-tête - masqué seulement à l'étape 4 car elle a son propre header */}
        {step !== 4 && (
        <div className="relative flex-shrink-0 px-6 py-5 bg-gradient-to-r from-primary/5 via-primary/3 to-accent/5 border-b border-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-accent/20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg">
                  <QrCode className="h-5 w-5 text-white" />
                </div>
                <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Générateur QR
                </SheetTitle>
              </div>
              <SheetDescription className="text-sm text-gray-600 dark:text-gray-400 ml-12">
                {step === 2 ? "2. Ajoutez du contenu à votre code QR" : `Étape ${step} sur ${totalSteps}`}
              </SheetDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-9 w-9 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        )}

        {/* Contenu scrollable */}
        <div className={`flex-1 min-h-0 ${step === 3 ? 'overflow-hidden p-0' : 'overflow-y-auto px-6 py-6 drawer-scrollbar'}`}>
          {step === 1 && renderStep1()}
          {step === 2 && selectedType && (
            <div className="h-full">
              {/* TemplateBuilder pour la personnalisation */}
              <TemplateBuilder 
                onNext={() => {
                  try {
                    // Préparer les données pour l'étape d'apparence
                    // Utiliser NEXT_PUBLIC_APP_URL si disponible, sinon nettoyer window.location.origin
                    let baseUrl = 'http://localhost:3000'
                    if (typeof window !== 'undefined') {
                      if (process.env.NEXT_PUBLIC_APP_URL) {
                        baseUrl = process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
                      } else {
                        // Nettoyer window.location.origin pour enlever les chemins incorrects
                        const origin = window.location.origin
                        baseUrl = origin.split('/dashboard')[0].split('/api')[0].replace(/\/$/, '')
                      }
                    }
                    const qrCodeId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                    const qrUrl = `${baseUrl}/qr/${qrCodeId}`
                    
                    // Mettre à jour les états
                    setQrCodeData(qrUrl)
                    setStep(3)
                  } catch (error) {
                    console.error('Erreur lors du passage à l\'étape 3:', error)
                    toast.error("Erreur", {
                      description: "Impossible de passer à l'étape suivante",
                    })
                  }
                }}
              />
            </div>
          )}
          {step === 3 && (
                qrCodeData && qrCodeData !== "{}" ? (
                  <QRAppearanceStep
                    qrData={qrCodeData}
                    onBack={() => {
                      // Revenir à l'étape template
                      setStep(2)
                    }}
                    onCreate={async (qrCodeImage, config) => {
                      try {
                        setAppearanceConfig(config)
                        await handleSubmitWithAppearance(qrCodeImage, config)
                      } catch (error) {
                        console.error("Erreur dans onCreate:", error)
                        throw error // Re-lancer l'erreur pour que handleCreate puisse la gérer
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full p-6">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-gray-500">Préparation de l'étape d'apparence...</p>
                      <p className="text-sm text-gray-400 mt-2">Génération de l'URL du QR code</p>
                    </div>
                  </div>
                )
              )}
        </div>

        {/* Footer avec navigation - pas à l'étape 4 */}
        {step !== 4 && step !== 3 && (
          <div className="relative flex-shrink-0 border-t border-primary/10 px-6 py-5 bg-gradient-to-r from-white via-primary/5 to-accent/5 dark:from-gray-900 dark:via-primary/10 dark:to-accent/10 backdrop-blur-sm">
            <div className="flex gap-3 relative z-10">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 h-11"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Précédent
                </Button>
              )}
              {step < totalSteps && (
                <Button
                  onClick={handleNext}
                  className="flex-1 h-11 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl"
                >
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

