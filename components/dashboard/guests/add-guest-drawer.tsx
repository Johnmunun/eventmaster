/**
 * Drawer pour ajouter un nouvel invité
 * Design amélioré avec gradients et animations
 */
"use client"

import { useState, useEffect } from "react"
import { Users, Mail, Phone, Calendar, Sparkles, X, UserPlus, Loader2 } from 'lucide-react'
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
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type AddGuestDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Event {
  id: string
  name: string
  date: string
}

export function AddGuestDrawer({ open, onOpenChange }: AddGuestDrawerProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingEvents, setIsLoadingEvents] = useState(false)
  const [events, setEvents] = useState<Event[]>([])

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventId: "",
  })

  // Charger les événements quand le drawer s'ouvre
  useEffect(() => {
    if (open) {
      fetchEvents()
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
      // Réinitialiser le formulaire
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        eventId: "",
      })
    }
    onOpenChange(newOpen)
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    // Validation côté client
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("Erreur de validation", {
        description: "Le prénom et le nom sont requis",
      })
      return
    }

    if (!formData.eventId) {
      toast.error("Erreur de validation", {
        description: "Veuillez sélectionner un événement",
      })
      return
    }

    setIsSubmitting(true)
    const loadingToast = toast.loading("Processus en cours...", {
      description: "Ajout de l'invité en cours",
    })

    try {
      const response = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          eventId: formData.eventId,
        }),
      })

      const data = await response.json()
      toast.dismiss(loadingToast)

      if (!response.ok || !data.success) {
        const errorMessage = data.error || "Une erreur est survenue lors de l'ajout de l'invité"
        toast.error("Erreur", {
          description: errorMessage,
          duration: 5000,
        })
        return
      }

      toast.success("Invité ajouté ! 🎉", {
        description: `${data.guest.firstName} ${data.guest.lastName} a été ajouté avec succès`,
        duration: 4000,
      })

      handleOpenChange(false)
      router.refresh()

    } catch (error) {
      toast.dismiss(loadingToast)
      console.error("Erreur lors de l'ajout de l'invité:", error)
      toast.error("Erreur de connexion", {
        description: "Impossible de se connecter au serveur. Veuillez réessayer.",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[520px] p-0 flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 [&>button]:hidden"
      >
        {/* En-tête avec gradient */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-primary/5 via-primary/3 to-accent/5 border-b border-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-accent/20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg">
                  <UserPlus className="h-5 w-5 text-white" />
            </div>
                <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Ajouter un invité
          </SheetTitle>
              </div>
              <SheetDescription className="text-sm text-gray-600 dark:text-gray-400 ml-12">
                Ajoutez un nouvel invité à votre événement
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

        {/* Formulaire */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form id="add-guest-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Informations personnelles */}
            <div className="space-y-4 p-5 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-primary/10 hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Informations personnelles
                </h3>
              </div>

              {/* Prénom et Nom */}
          <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 group">
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Prénom *
              </Label>
                  <div className="relative">
              <Input
                id="firstName"
                placeholder="Marie"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                      className="h-11 text-sm border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 pl-4 pr-4 bg-white dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                required
                      disabled={isSubmitting}
              />
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
            </div>
                <div className="space-y-2 group">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Nom *
              </Label>
                  <div className="relative">
              <Input
                id="lastName"
                placeholder="Dupont"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                      className="h-11 text-sm border-2 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 pl-4 pr-4 bg-white dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                required
                      disabled={isSubmitting}
              />
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Coordonnées */}
            <div className="space-y-4 p-5 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-accent/10 hover:border-accent/20 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-accent/10">
                  <Mail className="h-4 w-4 text-accent" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Coordonnées
                </h3>
          </div>

          {/* Email */}
              <div className="space-y-2 group">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  Email (optionnel)
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="marie.dupont@email.com"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                    className="h-11 text-sm border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 pl-4 pr-4 bg-white dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
              />
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </div>

          {/* Téléphone */}
              <div className="space-y-2 group">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"
                >
                  <Phone className="h-4 w-4 text-accent" />
                  Téléphone (optionnel)
            </Label>
            <div className="relative">
              <Input
                id="phone"
                type="tel"
                placeholder="+33 6 12 34 56 78"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                    className="h-11 text-sm border-2 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 pl-4 pr-4 bg-white dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
              />
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
            </div>
          </div>

          {/* Événement */}
            <div className="space-y-2 p-5 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-primary/20 transition-all duration-300">
              <Label
                htmlFor="eventId"
                className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"
              >
                <Calendar className="h-4 w-4 text-primary" />
              Événement *
            </Label>
              <Select
                value={formData.eventId}
                onValueChange={(value) => updateField("eventId", value)}
                disabled={isSubmitting || isLoadingEvents}
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
          </form>
          </div>

        {/* Footer avec boutons */}
        <div className="relative border-t border-primary/10 px-6 py-5 bg-gradient-to-r from-white via-primary/5 to-accent/5 dark:from-gray-900 dark:via-primary/10 dark:to-accent/10 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
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
              form="add-guest-form"
              className="flex-1 h-11 text-sm font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isSubmitting || isLoadingEvents || events.length === 0}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Ajout...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
              Ajouter l'invité
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
