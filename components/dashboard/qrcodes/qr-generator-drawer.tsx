/**
 * Générateur QR dynamique multi-étapes
 * Similaire à online-qr-generator.com
 * Supporte: URL, PDF, Images, Vidéo, Texte, Carte d'invité, WhatsApp, Réseaux sociaux
 */
"use client"

import { useState, useEffect, useCallback } from "react"
import { TemplateBuilder } from "@/components/qr-templates/template-builder"
import { useQRTemplateStore, TemplateType } from "@/lib/stores/qr-template-store"
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

const pdfSchema = z.object({
  pdfFile: z.instanceof(File, { message: "Un fichier PDF est requis" }),
})

const imageSchema = z.object({
  images: z.array(z.instanceof(File)).min(1, "Au moins une image est requise"),
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

const eventbriteSchema = z.object({
  url: z.string().url("URL invalide").min(1, "L'URL de l'événement est requise"),
})

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
  const [selectedType, setSelectedType] = useState<QRType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [useTemplateSystem, setUseTemplateSystem] = useState(false)
  const [qrPreview, setQrPreview] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [folders, setFolders] = useState<Array<{ id: string; name: string }>>([])
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

  // Formulaires par étape
  const contentForm = useForm<any>({
    resolver: zodResolver(
      selectedType === "URL" ? urlSchema :
      selectedType === "PDF" ? pdfSchema :
      selectedType === "IMAGE" ? imageSchema :
      selectedType === "VIDEO" ? videoSchema :
      selectedType === "TEXT" ? textSchema :
      selectedType === "GUEST_CARD" ? guestCardSchema :
      selectedType === "WHATSAPP" ? whatsappSchema :
      selectedType === "SOCIAL" ? socialSchema :
      selectedType === "MENU" ? menuSchema :
      selectedType === "WIFI" ? wifiSchema :
      selectedType === "PROGRAM" ? programSchema :
      selectedType === "VCARD" ? vcardSchema :
      selectedType === "COUPON" ? couponSchema :
      selectedType === "PLAYLIST" ? playlistSchema :
      selectedType === "GALLERY" ? gallerySchema :
      selectedType === "FEEDBACK" ? feedbackSchema :
      selectedType === "LIVE_STREAM" ? liveStreamSchema :
      selectedType === "EMAIL" ? emailSchema :
      selectedType === "SMS" ? smsSchema :
      selectedType === "LOCATION" ? locationSchema :
      selectedType === "PHONE" ? phoneSchema :
      selectedType === "BITCOIN" ? bitcoinSchema :
      selectedType === "EVENTBRITE" ? eventbriteSchema :
      z.object({})
    ),
  })

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
      setSelectedType(null)
      setQrPreview(null)
      setLogoPreview(null)
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

    if (!qrData) return

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

    console.log("Génération preview avec:", { color, backgroundColor, pixelShape, hasLogo: !!logoPreview })

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

      const result = await response.json()
      if (result.success) {
        setQrPreview(result.imageUrl)
      }
    } catch (error) {
      console.error("Erreur lors de la génération de la preview:", error)
    }
  }, [selectedType, contentForm, customizationForm, logoPreview])

  // Surveiller tous les changements pour preview dynamique
  const watchedContent = contentForm.watch()
  const watchedCustom = customizationForm.watch()

  // Générer la preview en temps réel quand les données changent (étape 3)
  useEffect(() => {
    if (step === 3 && selectedType) {
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

  const handleTypeSelect = (type: QRType) => {
    setSelectedType(type)
    
    // Vérifier si un template existe pour ce type
    const templateType = getTemplateForQRType(type)
    if (templateType) {
      // Basculer automatiquement vers le mode template
      setUseTemplateSystem(true)
      setTemplateType(templateType)
    } else {
      // Mode classique
      setUseTemplateSystem(false)
      setTemplateType(null)
    }
    
    // Initialiser les valeurs par défaut selon le type
    const defaultValues: any = {}
    if (type === "MENU") {
      defaultValues.items = [{ name: "", description: "", price: "", allergens: "" }]
    } else if (type === "PROGRAM") {
      defaultValues.events = [{ time: "", title: "", description: "", location: "" }]
    } else if (type === "FEEDBACK") {
      defaultValues.questions = [{ question: "", type: "rating" }]
    }
    contentForm.reset(defaultValues)
  }

  const handleNext = async () => {
    if (step === 1) {
      if (!selectedType) {
        toast.error("Veuillez sélectionner un type de QR code")
        return
      }
      setStep(2)
    } else if (step === 2) {
      const isValid = await contentForm.trigger()
      if (isValid) {
        setStep(3)
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    const isContentValid = await contentForm.trigger()
    const isCustomValid = await customizationForm.trigger()

    if (!isContentValid || !isCustomValid) {
      toast.error("Veuillez remplir tous les champs requis")
      return
    }

    setIsSubmitting(true)

    try {
      const contentData = contentForm.getValues()
      const customData = customizationForm.getValues()

      // Préparer les données selon le type
      let qrData = ""
      const formData = new FormData()

      switch (selectedType) {
        case "URL":
          qrData = contentData.url
          break
        case "PDF":
          formData.append("pdfFile", contentData.pdfFile)
          qrData = "PDF_FILE" // Sera remplacé par l'URL après upload
          break
        case "IMAGE":
          contentData.images.forEach((img: File) => {
            formData.append("images", img)
          })
          qrData = "IMAGES_FILES" // Sera remplacé par l'URL après upload
          break
        case "VIDEO":
          qrData = contentData.videoUrl
          break
        case "TEXT":
          qrData = contentData.text
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
          // Pour le menu, on encode les données JSON et on génère une URL
          qrData = JSON.stringify({
            type: "menu",
            title: contentData.title,
            items: contentData.items || [],
          })
          break
        case "WIFI":
          // Format Wi-Fi: WIFI:T:WPA2;S:SSID;P:Password;;
          const security = contentData.security || "WPA2"
          const ssid = contentData.ssid || ""
          const password = contentData.password || ""
          qrData = `WIFI:T:${security};S:${ssid};P:${password};;`
          break
        case "PROGRAM":
          // Pour le programme, on encode les données JSON
          qrData = JSON.stringify({
            type: "program",
            title: contentData.title,
            events: contentData.events || [],
          })
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
          // Pour le coupon, on encode les données JSON
          qrData = JSON.stringify({
            type: "coupon",
            code: contentData.code,
            discount: contentData.discount,
            discountType: contentData.type,
            expiresAt: contentData.expiresAt,
            description: contentData.description,
          })
          break
        case "PLAYLIST":
          qrData = contentData.url || ""
          break
        case "GALLERY":
          // Pour la galerie, on encode les données JSON
          qrData = JSON.stringify({
            type: "gallery",
            title: contentData.title,
            allowUpload: contentData.allowUpload,
          })
          break
        case "FEEDBACK":
          // Pour le feedback, on encode les données JSON
          qrData = JSON.stringify({
            type: "feedback",
            title: contentData.title,
            questions: contentData.questions || [],
          })
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

      // Ajouter les données de personnalisation
      formData.append("type", selectedType!)
      formData.append("name", customData.name)
      formData.append("data", qrData)
      formData.append("color", customData.color)
      formData.append("backgroundColor", customData.backgroundColor)
      formData.append("pixelShape", customData.pixelShape)
      if (customData.folderId) {
        formData.append("folderId", customData.folderId)
      }
      if (customData.logoFile) {
        formData.append("logoFile", customData.logoFile)
      }

      const response = await fetch("/api/qrcodes/generate", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        toast.success("QR code généré avec succès!", {
          description: "Votre QR code a été créé et sauvegardé",
        })
        onQRCodeCreated?.()
        onOpenChange(false)
      } else {
        toast.error("Erreur", {
          description: result.error || "Impossible de générer le QR code",
        })
      }
    } catch (error) {
      console.error("Erreur:", error)
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la génération",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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

  const renderStep1 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Colonne gauche : Types de QR */}
      <div className="space-y-6 order-2 lg:order-1 flex flex-col h-full min-h-0">
        <div className="flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            1. Choisissez le type de QR code
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sélectionnez le type de contenu que vous souhaitez encoder
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-2 drawer-scrollbar">
          <div className="grid grid-cols-3 gap-4 pb-4">
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
                {selectedType === type.id && (
                  <Badge className="mt-2 bg-primary text-white">
                    <Check className="h-3 w-3 mr-1" />
                    Sélectionné
                  </Badge>
                )}
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
        </div>
      </div>

      {/* Colonne droite : Preview mobile */}
      <div className="order-1 lg:order-2 flex items-start justify-center lg:sticky lg:top-0">
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
              {selectedType ? (
                renderLandingPage()
              ) : (
                <div className="h-full flex items-center justify-center p-6">
                  <div className="text-center text-gray-400">
                    <QrCode className="h-24 w-24 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Sélectionnez un type de QR code</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full"></div>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => {
    if (!selectedType) return null

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne gauche : Formulaire */}
        <div className="space-y-6 order-2 lg:order-1">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              2. Remplissez les informations
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedType === "URL" && "Entrez l'URL à encoder dans le QR code"}
              {selectedType === "PDF" && "Téléchargez votre fichier PDF (max 5Mo)"}
              {selectedType === "IMAGE" && "Téléchargez une ou plusieurs images (max 5Mo chacune)"}
              {selectedType === "VIDEO" && "Entrez l'URL de la vidéo (YouTube, Vimeo, etc.)"}
              {selectedType === "TEXT" && "Entrez le texte à encoder"}
              {selectedType === "GUEST_CARD" && "Remplissez les informations de la carte d'invité"}
              {selectedType === "WHATSAPP" && "Entrez le numéro WhatsApp et optionnellement un message"}
              {selectedType === "SOCIAL" && "Sélectionnez le réseau social et entrez le nom d'utilisateur"}
              {selectedType === "MENU" && "Créez le menu du repas avec les plats et leurs informations"}
              {selectedType === "WIFI" && "Configurez les informations de connexion Wi-Fi"}
              {selectedType === "PROGRAM" && "Créez le programme de l'événement avec la timeline"}
              {selectedType === "VCARD" && "Remplissez les informations de votre carte de visite"}
              {selectedType === "COUPON" && "Créez un code promo ou une réduction"}
              {selectedType === "PLAYLIST" && "Partagez votre playlist musicale"}
              {selectedType === "GALLERY" && "Créez une galerie photo pour l'événement"}
              {selectedType === "FEEDBACK" && "Créez un formulaire de satisfaction"}
              {selectedType === "LIVE_STREAM" && "Configurez le lien de diffusion en direct"}
            </p>
          </div>

          <div className="space-y-4">
          {selectedType === "URL" && (
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                {...contentForm.register("url")}
              />
              {contentForm.formState.errors.url && (
                <p className="text-sm text-red-500 mt-1">
                  {contentForm.formState.errors.url.message as string}
                </p>
              )}
            </div>
          )}

          {selectedType === "PDF" && (
            <div>
              <Label htmlFor="pdfFile">Fichier PDF</Label>
              <div className="mt-2">
                <Input
                  id="pdfFile"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error("Le fichier est trop volumineux (max 5Mo)")
                        return
                      }
                      contentForm.setValue("pdfFile", file)
                    }
                  }}
                />
              </div>
              {contentForm.formState.errors.pdfFile && (
                <p className="text-sm text-red-500 mt-1">
                  {contentForm.formState.errors.pdfFile.message as string}
                </p>
              )}
            </div>
          )}

          {selectedType === "IMAGE" && (
            <div>
              <Label htmlFor="images">Images</Label>
              <div className="mt-2">
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    const validFiles = files.filter((file) => {
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error(`${file.name} est trop volumineux (max 5Mo)`)
                        return false
                      }
                      return true
                    })
                    contentForm.setValue("images", validFiles)
                  }}
                />
              </div>
              {contentForm.formState.errors.images && (
                <p className="text-sm text-red-500 mt-1">
                  {contentForm.formState.errors.images.message as string}
                </p>
              )}
            </div>
          )}

          {selectedType === "VIDEO" && (
            <div>
              <Label htmlFor="videoUrl">URL de la vidéo</Label>
              <Input
                id="videoUrl"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                {...contentForm.register("videoUrl")}
              />
              {contentForm.formState.errors.videoUrl && (
                <p className="text-sm text-red-500 mt-1">
                  {contentForm.formState.errors.videoUrl.message as string}
                </p>
              )}
            </div>
          )}

          {selectedType === "TEXT" && (
            <div>
              <Label htmlFor="text">Texte</Label>
              <Textarea
                id="text"
                placeholder="Entrez votre texte ici..."
                rows={6}
                {...contentForm.register("text")}
              />
              {contentForm.formState.errors.text && (
                <p className="text-sm text-red-500 mt-1">
                  {contentForm.formState.errors.text.message as string}
                </p>
              )}
            </div>
          )}

          {selectedType === "GUEST_CARD" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  placeholder="Jean"
                  {...contentForm.register("firstName")}
                />
                {contentForm.formState.errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.firstName.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  placeholder="Dupont"
                  {...contentForm.register("lastName")}
                />
                {contentForm.formState.errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.lastName.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="table">Numéro de table</Label>
                <Input
                  id="table"
                  placeholder="Table 12"
                  {...contentForm.register("table")}
                />
                {contentForm.formState.errors.table && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.table.message as string}
                  </p>
                )}
              </div>
            </div>
          )}

          {selectedType === "WHATSAPP" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Numéro WhatsApp</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+33612345678"
                  {...contentForm.register("phone")}
                />
                {contentForm.formState.errors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.phone.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="message">Message (optionnel)</Label>
                <Textarea
                  id="message"
                  placeholder="Message pré-rempli..."
                  rows={3}
                  {...contentForm.register("message")}
                />
              </div>
            </div>
          )}

          {selectedType === "SOCIAL" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="platform">Réseau social</Label>
                <Select
                  onValueChange={(value) => contentForm.setValue("platform", value)}
                >
                  <SelectTrigger>
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
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.platform.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  placeholder="@username"
                  {...contentForm.register("username")}
                />
                {contentForm.formState.errors.username && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.username.message as string}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Formulaires événementiels */}
          {selectedType === "MENU" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="menuTitle">Titre du menu</Label>
                <Input
                  id="menuTitle"
                  placeholder="Menu du repas"
                  {...contentForm.register("title")}
                />
                {contentForm.formState.errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.title.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label>Plats du menu</Label>
                <p className="text-xs text-gray-500 mb-2">Ajoutez au moins un plat</p>
                <div className="space-y-3">
                  {contentForm.watch("items")?.map((_: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Plat {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const items = contentForm.getValues("items") || []
                            items.splice(index, 1)
                            contentForm.setValue("items", items)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Nom du plat"
                        {...contentForm.register(`items.${index}.name`)}
                      />
                      <Textarea
                        placeholder="Description (optionnel)"
                        rows={2}
                        {...contentForm.register(`items.${index}.description`)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Prix (optionnel)"
                          {...contentForm.register(`items.${index}.price`)}
                        />
                        <Input
                          placeholder="Allergènes (optionnel)"
                          {...contentForm.register(`items.${index}.allergens`)}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const items = contentForm.getValues("items") || []
                      contentForm.setValue("items", [...items, { name: "", description: "", price: "", allergens: "" }])
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un plat
                  </Button>
                </div>
                {contentForm.formState.errors.items && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.items.message as string}
                  </p>
                )}
              </div>
            </div>
          )}

          {selectedType === "WIFI" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="ssid">Nom du réseau (SSID)</Label>
                <Input
                  id="ssid"
                  placeholder="NomDuReseau"
                  {...contentForm.register("ssid")}
                />
                {contentForm.formState.errors.ssid && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.ssid.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="MotDePasse123"
                  {...contentForm.register("password")}
                />
                {contentForm.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.password.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="security">Type de sécurité</Label>
                <Select
                  onValueChange={(value) => contentForm.setValue("security", value)}
                  defaultValue="WPA2"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA</SelectItem>
                    <SelectItem value="WPA2">WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">Aucun mot de passe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {selectedType === "PROGRAM" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="programTitle">Titre du programme</Label>
                <Input
                  id="programTitle"
                  placeholder="Programme de l'événement"
                  {...contentForm.register("title")}
                />
                {contentForm.formState.errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.title.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label>Événements du programme</Label>
                <p className="text-xs text-gray-500 mb-2">Ajoutez au moins un événement</p>
                <div className="space-y-3">
                  {contentForm.watch("events")?.map((_: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Événement {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const events = contentForm.getValues("events") || []
                            events.splice(index, 1)
                            contentForm.setValue("events", events)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="time"
                          placeholder="Heure"
                          {...contentForm.register(`events.${index}.time`)}
                        />
                        <Input
                          placeholder="Lieu (optionnel)"
                          {...contentForm.register(`events.${index}.location`)}
                        />
                      </div>
                      <Input
                        placeholder="Titre de l'événement"
                        {...contentForm.register(`events.${index}.title`)}
                      />
                      <Textarea
                        placeholder="Description (optionnel)"
                        rows={2}
                        {...contentForm.register(`events.${index}.description`)}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const events = contentForm.getValues("events") || []
                      contentForm.setValue("events", [...events, { time: "", title: "", description: "", location: "" }])
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un événement
                  </Button>
                </div>
                {contentForm.formState.errors.events && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.events.message as string}
                  </p>
                )}
              </div>
            </div>
          )}

          {selectedType === "VCARD" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vcardFirstName">Prénom</Label>
                  <Input
                    id="vcardFirstName"
                    placeholder="Jean"
                    {...contentForm.register("firstName")}
                  />
                  {contentForm.formState.errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">
                      {contentForm.formState.errors.firstName.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="vcardLastName">Nom</Label>
                  <Input
                    id="vcardLastName"
                    placeholder="Dupont"
                    {...contentForm.register("lastName")}
                  />
                  {contentForm.formState.errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">
                      {contentForm.formState.errors.lastName.message as string}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="organization">Entreprise</Label>
                <Input
                  id="organization"
                  placeholder="Nom de l'entreprise"
                  {...contentForm.register("organization")}
                />
              </div>
              <div>
                <Label htmlFor="vcardTitle">Poste</Label>
                <Input
                  id="vcardTitle"
                  placeholder="Directeur"
                  {...contentForm.register("title")}
                />
              </div>
              <div>
                <Label htmlFor="vcardEmail">Email</Label>
                <Input
                  id="vcardEmail"
                  type="email"
                  placeholder="jean.dupont@example.com"
                  {...contentForm.register("email")}
                />
              </div>
              <div>
                <Label htmlFor="vcardPhone">Téléphone</Label>
                <Input
                  id="vcardPhone"
                  type="tel"
                  placeholder="+33612345678"
                  {...contentForm.register("phone")}
                />
              </div>
              <div>
                <Label htmlFor="website">Site web</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  {...contentForm.register("website")}
                />
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  placeholder="123 Rue Example, Paris"
                  {...contentForm.register("address")}
                />
              </div>
            </div>
          )}

          {selectedType === "COUPON" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="couponCode">Code promo</Label>
                <Input
                  id="couponCode"
                  placeholder="PROMO2024"
                  {...contentForm.register("code")}
                />
                {contentForm.formState.errors.code && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.code.message as string}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount">Réduction</Label>
                  <Input
                    id="discount"
                    placeholder="10"
                    {...contentForm.register("discount")}
                  />
                  {contentForm.formState.errors.discount && (
                    <p className="text-sm text-red-500 mt-1">
                      {contentForm.formState.errors.discount.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="discountType">Type</Label>
                  <Select
                    onValueChange={(value) => contentForm.setValue("type", value)}
                    defaultValue="percentage"
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                      <SelectItem value="amount">Montant (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="couponExpires">Date d'expiration (optionnel)</Label>
                <Input
                  id="couponExpires"
                  type="date"
                  {...contentForm.register("expiresAt")}
                />
              </div>
              <div>
                <Label htmlFor="couponDescription">Description</Label>
                <Textarea
                  id="couponDescription"
                  placeholder="Conditions d'utilisation..."
                  rows={3}
                  {...contentForm.register("description")}
                />
              </div>
            </div>
          )}

          {selectedType === "PLAYLIST" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="playlistTitle">Titre de la playlist</Label>
                <Input
                  id="playlistTitle"
                  placeholder="Ma playlist"
                  {...contentForm.register("title")}
                />
                {contentForm.formState.errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.title.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="playlistPlatform">Plateforme</Label>
                <Select
                  onValueChange={(value) => contentForm.setValue("platform", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une plateforme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spotify">Spotify</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="apple">Apple Music</SelectItem>
                    <SelectItem value="custom">Lien personnalisé</SelectItem>
                  </SelectContent>
                </Select>
                {contentForm.formState.errors.platform && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.platform.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="playlistUrl">URL de la playlist</Label>
                <Input
                  id="playlistUrl"
                  type="url"
                  placeholder="https://open.spotify.com/playlist/..."
                  {...contentForm.register("url")}
                />
              </div>
            </div>
          )}

          {selectedType === "GALLERY" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="galleryTitle">Titre de la galerie</Label>
                <Input
                  id="galleryTitle"
                  placeholder="Galerie photo de l'événement"
                  {...contentForm.register("title")}
                />
                {contentForm.formState.errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.title.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="galleryImages">Images (optionnel)</Label>
                <Input
                  id="galleryImages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    contentForm.setValue("images", files)
                  }}
                />
              </div>
            </div>
          )}

          {selectedType === "LIVE_STREAM" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="streamTitle">Titre du stream</Label>
                <Input
                  id="streamTitle"
                  placeholder="Diffusion en direct"
                  {...contentForm.register("title")}
                />
                {contentForm.formState.errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.title.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="streamPlatform">Plateforme</Label>
                <Select
                  onValueChange={(value) => contentForm.setValue("platform", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une plateforme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube Live</SelectItem>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="teams">Microsoft Teams</SelectItem>
                    <SelectItem value="custom">Lien personnalisé</SelectItem>
                  </SelectContent>
                </Select>
                {contentForm.formState.errors.platform && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.platform.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="streamUrl">URL du stream</Label>
                <Input
                  id="streamUrl"
                  type="url"
                  placeholder="https://youtube.com/live/..."
                  {...contentForm.register("url")}
                />
                {contentForm.formState.errors.url && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.url.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="streamInstructions">Instructions (optionnel)</Label>
                <Textarea
                  id="streamInstructions"
                  placeholder="Comment se connecter..."
                  rows={3}
                  {...contentForm.register("instructions")}
                />
              </div>
            </div>
          )}

          {selectedType === "FEEDBACK" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="feedbackTitle">Titre du formulaire</Label>
                <Input
                  id="feedbackTitle"
                  placeholder="Formulaire de satisfaction"
                  {...contentForm.register("title")}
                />
                {contentForm.formState.errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.title.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label>Questions</Label>
                <p className="text-xs text-gray-500 mb-2">Ajoutez au moins une question</p>
                <div className="space-y-3">
                  {contentForm.watch("questions")?.map((_: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Question {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const questions = contentForm.getValues("questions") || []
                            questions.splice(index, 1)
                            contentForm.setValue("questions", questions)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Votre question"
                        {...contentForm.register(`questions.${index}.question`)}
                      />
                      <Select
                        onValueChange={(value) => contentForm.setValue(`questions.${index}.type`, value)}
                        defaultValue="rating"
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rating">Note (étoiles)</SelectItem>
                          <SelectItem value="text">Texte libre</SelectItem>
                          <SelectItem value="choice">Choix multiple</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const questions = contentForm.getValues("questions") || []
                      contentForm.setValue("questions", [...questions, { question: "", type: "rating" }])
                    }}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une question
                  </Button>
                </div>
                {contentForm.formState.errors.questions && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.questions.message as string}
                  </p>
                )}
              </div>
            </div>
          )}

          {selectedType === "EMAIL" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@example.com"
                  {...contentForm.register("email")}
                />
                {contentForm.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.email.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="emailSubject">Sujet (optionnel)</Label>
                <Input
                  id="emailSubject"
                  placeholder="Sujet de l'email"
                  {...contentForm.register("subject")}
                />
              </div>
              <div>
                <Label htmlFor="emailBody">Message (optionnel)</Label>
                <Textarea
                  id="emailBody"
                  placeholder="Corps de l'email"
                  rows={3}
                  {...contentForm.register("body")}
                />
              </div>
            </div>
          )}

          {selectedType === "SMS" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="smsPhone">Numéro de téléphone</Label>
                <Input
                  id="smsPhone"
                  type="tel"
                  placeholder="+33612345678"
                  {...contentForm.register("phone")}
                />
                {contentForm.formState.errors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.phone.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="smsMessage">Message (optionnel)</Label>
                <Textarea
                  id="smsMessage"
                  placeholder="Votre message"
                  rows={3}
                  {...contentForm.register("message")}
                />
              </div>
            </div>
          )}

          {selectedType === "LOCATION" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="text"
                    placeholder="48.8566"
                    {...contentForm.register("latitude")}
                  />
                  {contentForm.formState.errors.latitude && (
                    <p className="text-sm text-red-500 mt-1">
                      {contentForm.formState.errors.latitude.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="text"
                    placeholder="2.3522"
                    {...contentForm.register("longitude")}
                  />
                  {contentForm.formState.errors.longitude && (
                    <p className="text-sm text-red-500 mt-1">
                      {contentForm.formState.errors.longitude.message as string}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="locationName">Nom du lieu (optionnel)</Label>
                <Input
                  id="locationName"
                  placeholder="Tour Eiffel"
                  {...contentForm.register("name")}
                />
              </div>
            </div>
          )}

          {selectedType === "PHONE" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+33612345678"
                  {...contentForm.register("phone")}
                />
                {contentForm.formState.errors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.phone.message as string}
                  </p>
                )}
              </div>
            </div>
          )}

          {selectedType === "BITCOIN" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="bitcoinAddress">Adresse Bitcoin</Label>
                <Input
                  id="bitcoinAddress"
                  placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                  {...contentForm.register("address")}
                />
                {contentForm.formState.errors.address && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.address.message as string}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="bitcoinAmount">Montant (optionnel)</Label>
                <Input
                  id="bitcoinAmount"
                  type="number"
                  step="0.00000001"
                  placeholder="0.001"
                  {...contentForm.register("amount")}
                />
              </div>
              <div>
                <Label htmlFor="bitcoinLabel">Label (optionnel)</Label>
                <Input
                  id="bitcoinLabel"
                  placeholder="Paiement"
                  {...contentForm.register("label")}
                />
              </div>
              <div>
                <Label htmlFor="bitcoinMessage">Message (optionnel)</Label>
                <Textarea
                  id="bitcoinMessage"
                  placeholder="Message pour le paiement"
                  rows={2}
                  {...contentForm.register("message")}
                />
              </div>
            </div>
          )}

          {selectedType === "EVENTBRITE" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="eventbriteUrl">URL de l'événement</Label>
                <Input
                  id="eventbriteUrl"
                  type="url"
                  placeholder="https://eventbrite.com/e/..."
                  {...contentForm.register("url")}
                />
                {contentForm.formState.errors.url && (
                  <p className="text-sm text-red-500 mt-1">
                    {contentForm.formState.errors.url.message as string}
                  </p>
                )}
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Colonne droite : Preview mobile */}
        <div className="order-1 lg:order-2 flex items-center justify-center">
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
              
              {/* Contenu de l'écran - Landing page personnalisée */}
              <div className="pt-8 h-full overflow-hidden">
                {renderLandingPage()}
              </div>
            </div>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full"></div>
          </div>
        </div>
      </div>
    )
  }

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Personnalisez l'apparence
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choisissez les couleurs, ajoutez un logo et personnalisez les formes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne gauche : Options */}
        <div className="space-y-6 order-2 lg:order-1">
          <div>
            <Label htmlFor="name">Nom du QR code</Label>
            <Input
              id="name"
              placeholder="Mon QR code"
              {...customizationForm.register("name")}
            />
            {customizationForm.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {customizationForm.formState.errors.name.message as string}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="folderId">Dossier (optionnel)</Label>
            <Select
              onValueChange={(value) => customizationForm.setValue("folderId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Aucun dossier" />
              </SelectTrigger>
              <SelectContent>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="color">Couleur du QR</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="color"
                  type="color"
                  className="w-16 h-10 cursor-pointer"
                  value={customizationForm.watch("color") || "#000000"}
                  onChange={(e) => {
                    const newColor = e.target.value
                    customizationForm.setValue("color", newColor)
                    // Mise à jour automatique de la preview
                    setTimeout(() => generatePreview(), 100)
                  }}
                />
                <Input
                  type="text"
                  placeholder="#000000"
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  value={customizationForm.watch("color") || "#000000"}
                  onChange={(e) => {
                    const newColor = e.target.value
                    customizationForm.setValue("color", newColor)
                    // Mise à jour automatique de la preview
                    setTimeout(() => generatePreview(), 300)
                  }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="backgroundColor">Couleur de fond</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  className="w-16 h-10 cursor-pointer"
                  value={customizationForm.watch("backgroundColor") || "#FFFFFF"}
                  onChange={(e) => {
                    const newColor = e.target.value
                    customizationForm.setValue("backgroundColor", newColor)
                    // Mise à jour automatique de la preview
                    setTimeout(() => generatePreview(), 100)
                  }}
                />
                <Input
                  type="text"
                  placeholder="#FFFFFF"
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  value={customizationForm.watch("backgroundColor") || "#FFFFFF"}
                  onChange={(e) => {
                    const newColor = e.target.value
                    customizationForm.setValue("backgroundColor", newColor)
                    // Mise à jour automatique de la preview
                    setTimeout(() => generatePreview(), 300)
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="logoFile">Logo au centre (optionnel, max 5Mo)</Label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Le logo sera uploadé uniquement lors de la validation finale
            </p>
            <Input
              id="logoFile"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleLogoUpload(file)
                  // Mise à jour automatique de la preview avec le logo (prévisualisation locale uniquement)
                  setTimeout(() => generatePreview(), 200)
                } else {
                  setLogoPreview(null)
                  customizationForm.setValue("logoFile", undefined)
                  // Mise à jour automatique de la preview sans logo
                  setTimeout(() => generatePreview(), 200)
                }
              }}
            />
            {logoPreview && (
              <div className="mt-2 p-2 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Aperçu du logo (prévisualisation locale) :</p>
                <img 
                  src={logoPreview} 
                  alt="Logo preview" 
                  className="w-16 h-16 object-contain rounded"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-xs"
                  onClick={() => {
                    setLogoPreview(null)
                    customizationForm.setValue("logoFile", undefined)
                    const input = document.getElementById("logoFile") as HTMLInputElement
                    if (input) input.value = ""
                    // Mise à jour automatique de la preview sans logo
                    setTimeout(() => generatePreview(), 200)
                  }}
                >
                  <X className="h-3 w-3 mr-1" />
                  Supprimer
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label>Forme des pixels</Label>
            <div className="flex gap-2 mt-2">
              {(["square", "round", "mixed"] as const).map((shape) => (
                <Button
                  key={shape}
                  type="button"
                  variant={
                    customizationForm.watch("pixelShape") === shape
                      ? "default"
                      : "outline"
                  }
                  onClick={() => {
                    customizationForm.setValue("pixelShape", shape)
                    // Mise à jour automatique de la preview
                    setTimeout(() => generatePreview(), 100)
                  }}
                  className="flex-1"
                >
                  {shape === "square" && <Square className="h-4 w-4 mr-2" />}
                  {shape === "round" && <Circle className="h-4 w-4 mr-2" />}
                  {shape === "mixed" && <Shapes className="h-4 w-4 mr-2" />}
                  {shape === "square" && "Carré"}
                  {shape === "round" && "Rond"}
                  {shape === "mixed" && "Mixte"}
                </Button>
              ))}
            </div>
          </div>

          {/* Personnalisation de la landing page */}
          <div className="pt-6 border-t">
            <h4 className="text-md font-semibold mb-4">Personnaliser la page de destination</h4>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="landingBgColor">Couleur de fond</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="landingBgColor"
                      type="color"
                      className="w-16 h-10 cursor-pointer"
                      value={landingPageConfig.backgroundColor}
                      onChange={(e) => {
                        setLandingPageConfig({ ...landingPageConfig, backgroundColor: e.target.value })
                      }}
                    />
                    <Input
                      type="text"
                      value={landingPageConfig.backgroundColor}
                      onChange={(e) => {
                        setLandingPageConfig({ ...landingPageConfig, backgroundColor: e.target.value })
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="landingTextColor">Couleur du texte</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="landingTextColor"
                      type="color"
                      className="w-16 h-10 cursor-pointer"
                      value={landingPageConfig.textColor}
                      onChange={(e) => {
                        setLandingPageConfig({ ...landingPageConfig, textColor: e.target.value })
                      }}
                    />
                    <Input
                      type="text"
                      value={landingPageConfig.textColor}
                      onChange={(e) => {
                        setLandingPageConfig({ ...landingPageConfig, textColor: e.target.value })
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="landingName">Nom</Label>
                <Input
                  id="landingName"
                  placeholder="John Carlson"
                  value={landingPageConfig.name}
                  onChange={(e) => {
                    setLandingPageConfig({ ...landingPageConfig, name: e.target.value })
                  }}
                />
              </div>

              <div>
                <Label htmlFor="landingTitle">Titre</Label>
                <Input
                  id="landingTitle"
                  placeholder="Gestionnaire de compte"
                  value={landingPageConfig.title}
                  onChange={(e) => {
                    setLandingPageConfig({ ...landingPageConfig, title: e.target.value })
                  }}
                />
              </div>

              <div>
                <Label htmlFor="landingDescription">Description</Label>
                <Textarea
                  id="landingDescription"
                  placeholder="En tant que gestionnaire de comptes..."
                  rows={3}
                  value={landingPageConfig.description}
                  onChange={(e) => {
                    setLandingPageConfig({ ...landingPageConfig, description: e.target.value })
                  }}
                />
              </div>

              <div>
                <Label>Informations à afficher</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showPhone"
                      checked={landingPageConfig.showPhone}
                      onChange={(e) => {
                        setLandingPageConfig({ ...landingPageConfig, showPhone: e.target.checked })
                      }}
                      className="rounded"
                    />
                    <Label htmlFor="showPhone" className="cursor-pointer">Téléphone</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showEmail"
                      checked={landingPageConfig.showEmail}
                      onChange={(e) => {
                        setLandingPageConfig({ ...landingPageConfig, showEmail: e.target.checked })
                      }}
                      className="rounded"
                    />
                    <Label htmlFor="showEmail" className="cursor-pointer">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showLocation"
                      checked={landingPageConfig.showLocation}
                      onChange={(e) => {
                        setLandingPageConfig({ ...landingPageConfig, showLocation: e.target.checked })
                      }}
                      className="rounded"
                    />
                    <Label htmlFor="showLocation" className="cursor-pointer">Localisation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showSocial"
                      checked={landingPageConfig.showSocial}
                      onChange={(e) => {
                        setLandingPageConfig({ ...landingPageConfig, showSocial: e.target.checked })
                      }}
                      className="rounded"
                    />
                    <Label htmlFor="showSocial" className="cursor-pointer">Réseaux sociaux</Label>
                  </div>
                </div>
              </div>

              {landingPageConfig.showPhone && (
                <div>
                  <Label htmlFor="landingPhone">Numéro de téléphone</Label>
                  <Input
                    id="landingPhone"
                    type="tel"
                    placeholder="555-100-1000"
                    value={landingPageConfig.phone}
                    onChange={(e) => {
                      setLandingPageConfig({ ...landingPageConfig, phone: e.target.value })
                    }}
                  />
                </div>
              )}

              {landingPageConfig.showEmail && (
                <div>
                  <Label htmlFor="landingEmail">Email</Label>
                  <Input
                    id="landingEmail"
                    type="email"
                    placeholder="john@example.com"
                    value={landingPageConfig.email}
                    onChange={(e) => {
                      setLandingPageConfig({ ...landingPageConfig, email: e.target.value })
                    }}
                  />
                </div>
              )}

              {landingPageConfig.showLocation && (
                <div>
                  <Label htmlFor="landingLocation">Localisation</Label>
                  <Input
                    id="landingLocation"
                    placeholder="Paris, France"
                    value={landingPageConfig.location}
                    onChange={(e) => {
                      setLandingPageConfig({ ...landingPageConfig, location: e.target.value })
                    }}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="landingProfileImage">Image de profil (optionnel)</Label>
                <Input
                  id="landingProfileImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        setLandingPageConfig({ 
                          ...landingPageConfig, 
                          profileImage: event.target?.result as string 
                        })
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Colonne droite : Preview avec téléphone */}
        <div className="order-1 lg:order-2">
          <Label>Aperçu mobile</Label>
          <div className="mt-2 flex items-center justify-center">
            {/* Téléphone mockup */}
            <div className="relative w-[280px] h-[560px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
              {/* Écran du téléphone */}
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
                
                {/* Contenu de l'écran - Landing page personnalisée */}
                <div className="pt-8 h-full overflow-hidden">
                  {renderLandingPage()}
                </div>
              </div>
              
              {/* Bouton home (iPhone) */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={`w-full sm:max-w-[90vw] lg:max-w-[90vw] p-0 flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 [&>button]:hidden overflow-hidden transition-all duration-300`}
      >
        {/* En-tête */}
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
                {useTemplateSystem ? 'Mode Template' : `Étape ${step} sur 3`}
              </SheetDescription>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUseTemplateSystem(!useTemplateSystem)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  useTemplateSystem
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {useTemplateSystem ? '📱 Templates' : '⚙️ Classique'}
              </button>
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

        {/* Contenu scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 drawer-scrollbar">
          {useTemplateSystem ? (
            <TemplateBuilder />
          ) : (
            <>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </>
          )}
        </div>

        {/* Footer avec navigation */}
        {!useTemplateSystem && (
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
              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  className="flex-1 h-11 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl"
                >
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 h-11 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Générer le QR code
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

