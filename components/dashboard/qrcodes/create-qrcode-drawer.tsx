/**
 * Drawer pour créer et personnaliser un QR code
 * Design amélioré avec gradients, animations et génération réelle de QR codes
 */
"use client"

import { useState, useEffect } from "react"
import { QrCode, Palette, Download, Sparkles, X, Loader2, Image as ImageIcon, Folder, Calendar } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type CreateQRCodeDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Event {
  id: string
  name: string
  date: string
}

interface Folder {
  id: string
  name: string
  color: string
}

export function CreateQRCodeDrawer({ open, onOpenChange }: CreateQRCodeDrawerProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingEvents, setIsLoadingEvents] = useState(false)
  const [isLoadingFolders, setIsLoadingFolders] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    eventId: "",
    type: "CUSTOM",
    folderId: "",
    color: "#FF6B35",
    backgroundColor: "#FFFFFF",
    customUrl: "",
  })

  // Charger les événements et dossiers quand le drawer s'ouvre
  useEffect(() => {
    if (open) {
      fetchEvents()
      fetchFolders()
    }
  }, [open])

  const fetchEvents = async () => {
    setIsLoadingEvents(true)
    try {
      const response = await fetch("/api/events/list")
      const data = await response.json()
      if (data.success) {
        setEvents(data.events)
      } else {
        toast.error("Erreur", { description: "Impossible de charger les événements" })
      }
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error)
    } finally {
      setIsLoadingEvents(false)
    }
  }

  const fetchFolders = async () => {
    setIsLoadingFolders(true)
    try {
      const response = await fetch("/api/folders")
      const data = await response.json()
      if (data.success) {
        setFolders(data.folders)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des dossiers:", error)
    } finally {
      setIsLoadingFolders(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isSubmitting) {
      setFormData({
        name: "",
        eventId: "",
        type: "CUSTOM",
        folderId: "",
        color: "#FF6B35",
        backgroundColor: "#FFFFFF",
        customUrl: "",
      })
      setPreviewImage(null)
    }
    onOpenChange(newOpen)
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    // Validation
    if (!formData.name.trim()) {
      toast.error("Erreur de validation", {
        description: "Le nom du QR code est requis",
      })
      return
    }

    if (formData.type === "EVENT" && !formData.eventId) {
      toast.error("Erreur de validation", {
        description: "Veuillez sélectionner un événement",
      })
      return
    }

    if (formData.type === "CUSTOM" && !formData.customUrl.trim()) {
      toast.error("Erreur de validation", {
        description: "Veuillez saisir une URL personnalisée",
      })
      return
    }

    setIsSubmitting(true)
    const loadingToast = toast.loading("Génération en cours...", {
      description: "Création de votre QR code personnalisé",
    })

    try {
      const qrCodeData: any = {
        name: formData.name.trim(),
        type: formData.type,
        color: formData.color,
        backgroundColor: formData.backgroundColor,
      }

      if (formData.eventId) {
        qrCodeData.eventId = formData.eventId
      }

      if (formData.folderId) {
        qrCodeData.folderId = formData.folderId
      }

      if (formData.type === "CUSTOM" && formData.customUrl) {
        qrCodeData.data = {
          url: formData.customUrl.trim(),
        }
      }

      const response = await fetch("/api/qrcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(qrCodeData),
      })

      const data = await response.json()
      toast.dismiss(loadingToast)

      if (!response.ok || !data.success) {
        const errorMessage = data.error || "Une erreur est survenue lors de la génération du QR code"
        toast.error("Erreur", {
          description: errorMessage,
          duration: 5000,
        })
        return
      }

      toast.success("QR Code généré ! 🎉", {
        description: `"${data.qrCode.name}" a été créé avec succès`,
        duration: 4000,
      })

      handleOpenChange(false)
      router.refresh()

    } catch (error) {
      toast.dismiss(loadingToast)
      console.error("Erreur lors de la génération du QR code:", error)
      toast.error("Erreur de connexion", {
        description: "Impossible de se connecter au serveur. Veuillez réessayer.",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[600px] p-0 flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 [&>button]:hidden overflow-hidden"
      >
        {/* En-tête avec gradient */}
        <div className="relative flex-shrink-0 px-6 py-5 bg-gradient-to-r from-primary/5 via-primary/3 to-accent/5 border-b border-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-accent/20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg">
                  <QrCode className="h-5 w-5 text-white" />
                </div>
                <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Générer un QR Code
                </SheetTitle>
              </div>
              <SheetDescription className="text-sm text-gray-600 dark:text-gray-400 ml-12">
                Créez un QR code personnalisé avec des options de design avancées
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
          <form id="create-qrcode-form" onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="content" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                <TabsTrigger 
                  value="content" 
                  className="data-[state=active]:bg-white data-[state=active]:dark:bg-gray-900 data-[state=active]:shadow-md transition-all"
                >
                  Contenu
                </TabsTrigger>
                <TabsTrigger 
                  value="design" 
                  className="data-[state=active]:bg-white data-[state=active]:dark:bg-gray-900 data-[state=active]:shadow-md transition-all"
                >
                  Design
                </TabsTrigger>
              </TabsList>

              {/* Onglet Contenu */}
              <TabsContent value="content" className="space-y-6 mt-6">
                {/* Section Informations */}
                <div className="space-y-4 p-5 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-primary/10 hover:border-primary/20 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                      Informations
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qr-name" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Nom du QR Code *
                    </Label>
                    <Input
                      id="qr-name"
                      placeholder="Ex: QR Mariage Sophie"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="h-11 text-sm border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qr-type" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Type de QR Code *
                    </Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => updateField("type", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="h-11 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CUSTOM">🔗 Personnalisé (URL)</SelectItem>
                        <SelectItem value="EVENT">📅 Événement</SelectItem>
                        <SelectItem value="GUEST">👤 Invité</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.type === "EVENT" && (
                    <div className="space-y-2">
                      <Label htmlFor="qr-event" className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        Événement associé *
                      </Label>
                      {isLoadingEvents ? (
                        <div className="h-11 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />
                      ) : (
                        <Select 
                          value={formData.eventId} 
                          onValueChange={(value) => updateField("eventId", value)}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="h-11 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Sélectionnez un événement" />
                          </SelectTrigger>
                          <SelectContent>
                            {events.map((event) => (
                              <SelectItem key={event.id} value={event.id}>
                                {event.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  )}

                  {formData.type === "CUSTOM" && (
                    <div className="space-y-2">
                      <Label htmlFor="qr-url" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        URL personnalisée *
                      </Label>
                      <Input
                        id="qr-url"
                        type="url"
                        placeholder="https://example.com"
                        value={formData.customUrl}
                        onChange={(e) => updateField("customUrl", e.target.value)}
                        className="h-11 text-sm border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        required={formData.type === "CUSTOM"}
                        disabled={isSubmitting}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="qr-folder" className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <Folder className="h-4 w-4 text-accent" />
                      Dossier (optionnel)
                    </Label>
                    {isLoadingFolders ? (
                      <div className="h-11 bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />
                    ) : (
                      <Select 
                        value={formData.folderId || "none"} 
                        onValueChange={(value) => updateField("folderId", value === "none" ? "" : value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="h-11 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Aucun dossier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Aucun dossier</SelectItem>
                          {folders.map((folder) => (
                            <SelectItem key={folder.id} value={folder.id}>
                              {folder.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Onglet Design */}
              <TabsContent value="design" className="space-y-6 mt-6">
                {/* Aperçu du QR code */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 border-2 border-primary/10 shadow-lg">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wider">
                    Aperçu
                  </p>
                  <div className="aspect-square bg-white dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center shadow-inner">
                    {previewImage ? (
                      <img src={previewImage} alt="QR Code Preview" className="w-full h-full object-contain p-4" />
                    ) : (
                      <QrCode className="h-48 w-48 text-gray-300 dark:text-gray-600" />
                    )}
                  </div>
                </div>

                <div className="space-y-4 p-5 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-accent/10 hover:border-accent/20 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-accent/10">
                      <Palette className="h-4 w-4 text-accent" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                      Personnalisation
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qr-color" className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <Palette className="h-4 w-4 text-primary" />
                      Couleur principale
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        id="qr-color"
                        type="color"
                        value={formData.color}
                        onChange={(e) => updateField("color", e.target.value)}
                        className="w-20 h-11 cursor-pointer border-2 rounded-lg"
                        disabled={isSubmitting}
                      />
                      <Input
                        value={formData.color}
                        onChange={(e) => updateField("color", e.target.value)}
                        placeholder="#FF6B35"
                        className="flex-1 h-11 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono text-sm"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qr-bg-color" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Couleur de fond
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        id="qr-bg-color"
                        type="color"
                        value={formData.backgroundColor}
                        onChange={(e) => updateField("backgroundColor", e.target.value)}
                        className="w-20 h-11 cursor-pointer border-2 rounded-lg"
                        disabled={isSubmitting}
                      />
                      <Input
                        value={formData.backgroundColor}
                        onChange={(e) => updateField("backgroundColor", e.target.value)}
                        placeholder="#FFFFFF"
                        className="flex-1 h-11 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono text-sm"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </div>

        {/* Footer */}
        <div className="relative flex-shrink-0 border-t border-primary/10 px-6 py-5 bg-gradient-to-r from-white via-primary/5 to-accent/5 dark:from-gray-900 dark:via-primary/10 dark:to-accent/10 backdrop-blur-sm">
          <div className="flex gap-3 relative z-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="flex-1 h-11 text-sm font-semibold border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              form="create-qrcode-form"
              className="flex-1 h-11 text-sm font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isSubmitting || !formData.name.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Générer
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
