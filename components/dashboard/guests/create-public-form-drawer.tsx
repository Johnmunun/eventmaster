/**
 * Drawer pour créer un formulaire public de partage
 * Permet de générer un lien de formulaire pour un événement
 */
"use client"

import { useState, useEffect } from "react"
import { Share2, Calendar, Link, Copy, CheckCircle2, Loader2, X, Sparkles, MessageCircle, Settings } from 'lucide-react'
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
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type CreatePublicFormDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Event {
  id: string
  name: string
  date: string
}

interface PublicForm {
  id: string
  token: string
  publicUrl: string
  title: string | null
  description: string | null
  isActive: boolean
  maxSubmissions: number | null
  currentSubmissions: number
  expiresAt: string | null
  event: {
    id: string
    name: string
  }
}

export function CreatePublicFormDrawer({ open, onOpenChange }: CreatePublicFormDrawerProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingEvents, setIsLoadingEvents] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [createdForm, setCreatedForm] = useState<PublicForm | null>(null)

  const [formData, setFormData] = useState({
    eventId: "",
    title: "",
    description: "",
    maxSubmissions: "",
    expiresAt: "",
    allowDuplicateEmail: false,
    requireEmail: true,
    requirePhone: false,
  })

  // Charger les événements quand le drawer s'ouvre
  useEffect(() => {
    if (open) {
      fetchEvents()
      // Réinitialiser le formulaire
      setFormData({
        eventId: "",
        title: "",
        description: "",
        maxSubmissions: "",
        expiresAt: "",
        allowDuplicateEmail: false,
        requireEmail: true,
        requirePhone: false,
      })
      setCreatedForm(null)
      setCopiedUrl(null)
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
      toast.error("Erreur", { description: "Une erreur est survenue lors du chargement des événements" })
    } finally {
      setIsLoadingEvents(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isSubmitting) {
      setFormData({
        eventId: "",
        title: "",
        description: "",
        maxSubmissions: "",
        expiresAt: "",
        allowDuplicateEmail: false,
        requireEmail: true,
        requirePhone: false,
      })
      setCreatedForm(null)
      setCopiedUrl(null)
    }
    onOpenChange(newOpen)
  }

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || !formData.eventId) return

    setIsSubmitting(true)
    const loadingToast = toast.loading("Processus en cours...", {
      description: "Création du formulaire public en cours",
    })

    try {
      // Convertir expiresAt de datetime-local vers ISO si présent
      let expiresAtISO: string | undefined = undefined
      if (formData.expiresAt) {
        // datetime-local retourne "YYYY-MM-DDTHH:mm" sans timezone
        // On le convertit en ISO avec timezone locale
        const date = new Date(formData.expiresAt)
        if (!isNaN(date.getTime())) {
          expiresAtISO = date.toISOString()
        }
      }

      const response = await fetch("/api/public-forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: formData.eventId,
          title: formData.title.trim() || undefined,
          description: formData.description.trim() || undefined,
          maxSubmissions: formData.maxSubmissions ? parseInt(formData.maxSubmissions) : undefined,
          expiresAt: expiresAtISO,
          allowDuplicateEmail: formData.allowDuplicateEmail,
          requireEmail: formData.requireEmail,
          requirePhone: formData.requirePhone,
        }),
      })

      const data = await response.json()
      toast.dismiss(loadingToast)

      if (!response.ok || !data.success) {
        const errorMessage = data.error || "Une erreur est survenue lors de la création du formulaire"
        toast.error("Erreur", {
          description: errorMessage,
          duration: 5000,
        })
        return
      }

      toast.success("Formulaire créé ! 🎉", {
        description: "Votre formulaire public a été créé avec succès",
        duration: 4000,
      })

      setCreatedForm(data.form)
      router.refresh()
      // Déclencher un événement personnalisé pour rafraîchir la liste
      window.dispatchEvent(new CustomEvent('publicFormCreated'))

    } catch (error) {
      toast.dismiss(loadingToast)
      console.error("Erreur lors de la création du formulaire:", error)
      toast.error("Erreur de connexion", {
        description: "Impossible de se connecter au serveur. Veuillez réessayer.",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedUrl(text)
      toast.success("Lien copié !", {
        description: "Le lien a été copié dans le presse-papiers",
        duration: 2000,
      })
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de copier le lien",
      })
    }
  }

  const shareOnWhatsApp = (url: string, title: string) => {
    const message = encodeURIComponent(`Inscription à l'événement : ${title}\n\nRemplissez le formulaire ici : ${url}`)
    const whatsappUrl = `https://wa.me/?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[600px] p-0 flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 [&>button]:hidden overflow-hidden"
      >
        {/* En-tête */}
        <div className="relative flex-shrink-0 px-6 py-5 bg-gradient-to-r from-primary/5 via-primary/3 to-accent/5 border-b border-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-accent/20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg">
                  <Share2 className="h-5 w-5 text-white" />
                </div>
                <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {createdForm ? "Partager le formulaire" : "Créer un formulaire public"}
                </SheetTitle>
              </div>
              <SheetDescription className="text-sm text-gray-600 dark:text-gray-400 ml-12">
                {createdForm 
                  ? "Partagez ce lien avec vos invités pour qu'ils s'inscrivent"
                  : "Générez un lien de formulaire pour que vos invités s'inscrivent eux-mêmes"}
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
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 overscroll-contain">
          {createdForm ? (
            // Affichage du formulaire créé avec options de partage
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Formulaire créé avec succès !
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Partagez ce lien avec vos invités
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations du formulaire */}
              <div className="space-y-4 p-5 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-primary/10">
                <div>
                  <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 block">
                    Événement
                  </Label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">{createdForm.event.name}</span>
                  </div>
                </div>

                {createdForm.title && (
                  <div>
                    <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 block">
                      Titre du formulaire
                    </Label>
                    <p className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">{createdForm.title}</p>
                  </div>
                )}

                {/* Lien du formulaire */}
                <div>
                  <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 block">
                    Lien du formulaire
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={createdForm.publicUrl}
                      readOnly
                      className="flex-1 font-mono text-sm bg-gray-50 dark:bg-gray-900"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(createdForm.publicUrl)}
                      className="flex-shrink-0"
                    >
                      {copiedUrl === createdForm.publicUrl ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Soumissions</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {createdForm.currentSubmissions}
                      {createdForm.maxSubmissions && ` / ${createdForm.maxSubmissions}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Statut</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {createdForm.isActive ? "Actif" : "Inactif"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Options de partage */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Partager le formulaire
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Partager sur WhatsApp */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-2 border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20 transition-all"
                    onClick={() => shareOnWhatsApp(createdForm.publicUrl, createdForm.title || createdForm.event.name)}
                  >
                    <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                    Partager sur WhatsApp
                  </Button>

                  {/* Copier le lien */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-2 hover:border-primary/40 transition-all"
                    onClick={() => copyToClipboard(createdForm.publicUrl)}
                  >
                    {copiedUrl === createdForm.publicUrl ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                        Lien copié !
                      </>
                    ) : (
                      <>
                        <Link className="h-5 w-5 mr-2" />
                        Copier le lien
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Bouton pour créer un nouveau formulaire */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setCreatedForm(null)
                  setFormData({
                    eventId: "",
                    title: "",
                    description: "",
                    maxSubmissions: "",
                    expiresAt: "",
                    allowDuplicateEmail: false,
                    requireEmail: true,
                    requirePhone: false,
                  })
                }}
              >
                Créer un autre formulaire
              </Button>
            </div>
          ) : (
            // Formulaire de création
            <form id="create-public-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Sélection de l'événement */}
              <div className="space-y-4 p-5 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-primary/10 hover:border-primary/20 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Événement *
                  </h3>
                </div>
                <Select
                  value={formData.eventId}
                  onValueChange={(value) => updateField("eventId", value)}
                  disabled={isSubmitting || isLoadingEvents}
                  required
                >
                  <SelectTrigger className="h-11 text-sm border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">
                    <SelectValue placeholder={isLoadingEvents ? "Chargement..." : "Sélectionnez un événement"} />
                  </SelectTrigger>
                  <SelectContent>
                    {events.length === 0 ? (
                      <SelectItem value="no-events" disabled>
                        {isLoadingEvents ? "Chargement..." : "Aucun événement disponible"}
                      </SelectItem>
                    ) : (
                      events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          <div className="flex items-center gap-2">
                            <span>{event.name}</span>
                            <span className="text-xs text-gray-500">
                              ({formatEventDate(event.date)})
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Informations du formulaire */}
              <div className="space-y-4 p-5 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-accent/10 hover:border-accent/20 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-accent/10">
                    <Sparkles className="h-4 w-4 text-accent" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Informations du formulaire
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Titre (optionnel)
                  </Label>
                  <Input
                    id="title"
                    placeholder="Ex: Inscription au mariage"
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="h-11 text-sm border-2 focus:border-primary"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Description (optionnel)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Ajoutez une description pour vos invités..."
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={3}
                    className="text-sm border-2 focus:border-primary resize-none"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Paramètres avancés */}
              <div className="space-y-4 p-5 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Paramètres
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-semibold">Email requis</Label>
                      <p className="text-xs text-gray-500">Les invités doivent fournir un email</p>
                    </div>
                    <Switch
                      checked={formData.requireEmail}
                      onCheckedChange={(checked) => updateField("requireEmail", checked)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-semibold">Téléphone requis</Label>
                      <p className="text-xs text-gray-500">Les invités doivent fournir un téléphone</p>
                    </div>
                    <Switch
                      checked={formData.requirePhone}
                      onCheckedChange={(checked) => updateField("requirePhone", checked)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-semibold">Autoriser les doublons d'email</Label>
                      <p className="text-xs text-gray-500">Permettre plusieurs inscriptions avec le même email</p>
                    </div>
                    <Switch
                      checked={formData.allowDuplicateEmail}
                      onCheckedChange={(checked) => updateField("allowDuplicateEmail", checked)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    <Label htmlFor="maxSubmissions" className="text-sm font-semibold">
                      Limite de soumissions
                    </Label>
                    <Input
                      id="maxSubmissions"
                      type="number"
                      placeholder="Illimité"
                      value={formData.maxSubmissions}
                      onChange={(e) => updateField("maxSubmissions", e.target.value)}
                      className="h-11 text-sm border-2"
                      min="1"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiresAt" className="text-sm font-semibold">
                      Date d'expiration
                    </Label>
                    <Input
                      id="expiresAt"
                      type="datetime-local"
                      value={formData.expiresAt}
                      onChange={(e) => updateField("expiresAt", e.target.value)}
                      className="h-11 text-sm border-2"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!createdForm && (
          <div className="relative flex-shrink-0 border-t border-primary/10 px-6 py-5 bg-gradient-to-r from-white via-primary/5 to-accent/5 dark:from-gray-900 dark:via-primary/10 dark:to-accent/10 backdrop-blur-sm">
            <div className="flex gap-3 relative z-10">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="flex-1 h-11 text-sm font-semibold border-2"
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                form="create-public-form"
                className="flex-1 h-11 text-sm font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isSubmitting || isLoadingEvents || !formData.eventId}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Créer le formulaire
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

