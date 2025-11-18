/**
 * Drawer (panneau coulissant) pour créer un nouvel événement
 * Utilise Sheet de ShadCN UI pour une expérience utilisateur fluide
 * Design moderne et compact inspiré de Stripe/Linear/Notion
 */
"use client"

import { useState } from "react"
import { Calendar, MapPin, Users, Clock, Sparkles, X } from 'lucide-react'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
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

type CreateEventDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateEventDrawer({ open, onOpenChange }: CreateEventDrawerProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // État du formulaire
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    date: "",
    time: "",
    location: "",
    attendees: "",
    description: "",
  })

  // Réinitialiser le formulaire quand le drawer se ferme
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isSubmitting) {
      // Réinitialiser le formulaire seulement si on n'est pas en train de soumettre
      setFormData({
        name: "",
        type: "",
        date: "",
        time: "",
        location: "",
        attendees: "",
        description: "",
      })
    }
    onOpenChange(newOpen)
  }

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Empêcher les soumissions multiples
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    
    // Afficher le toast de chargement
    const loadingToast = toast.loading("Processus en cours...", {
      description: "Création de votre événement en cours",
    })

    try {
      // Préparer les données pour l'API
      const eventData = {
        name: formData.name,
        type: formData.type,
        date: formData.date,
        time: formData.time,
        location: formData.location || undefined,
        description: formData.description || undefined,
      }

      // Appeler l'API
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })

      const data = await response.json()

      // Fermer le toast de chargement
      toast.dismiss(loadingToast)

      if (!response.ok || !data.success) {
        // Gérer les erreurs spécifiques
        const errorMessage = data.error || "Une erreur est survenue lors de la création de l'événement"
        toast.error("Erreur", {
          description: errorMessage,
          duration: 5000,
        })
        return
      }

      // Succès
      toast.success("Événement créé ! 🎉", {
        description: `"${data.event.name}" a été créé avec succès`,
        duration: 4000,
      })

      // Fermer le drawer
      handleOpenChange(false)
      
      // Rafraîchir la page pour afficher le nouvel événement
      router.refresh()

    } catch (error) {
      // Fermer le toast de chargement
      toast.dismiss(loadingToast)
      
      // Gérer les erreurs réseau ou autres erreurs inattendues
      console.error("Erreur lors de la création de l'événement:", error)
      
      toast.error("Erreur de connexion", {
        description: "Impossible de se connecter au serveur. Veuillez réessayer.",
        duration: 5000,
      })
    } finally {
      // Toujours réinitialiser l'état de soumission
      setIsSubmitting(false)
    }
  }

  // Mise à jour des champs du formulaire
  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-[520px] p-0 flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 [&>button]:hidden"
      >
        {/* Header fixe avec gradient et effet de brillance */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-primary/5 via-primary/3 to-accent/5 border-b border-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-accent/20">
          {/* Effet de brillance animé */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Créer un événement
              </SheetTitle>
              </div>
              <SheetDescription className="text-sm text-gray-600 dark:text-gray-400 ml-12">
                Configurez rapidement votre nouvel événement
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

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form id="create-event-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Section: Informations générales */}
            <div className="space-y-4 p-5 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-primary/10 hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Informations générales
              </h3>
              </div>

              {/* Nom de l'événement */}
              <div className="space-y-2 group">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Nom de l'événement
                </Label>
                <div className="relative">
                <Input
                  id="name"
                  placeholder="Mariage Sophie & Marc"
                  value={formData.name}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value.length <= 20) {
                        updateField("name", value)
                      }
                    }}
                    maxLength={20}
                    className="h-11 text-sm border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 pl-4 pr-4 bg-white dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formData.name.length}/20 caractères
                    </span>
                    {formData.name.length >= 18 && (
                      <span className="text-xs text-amber-600 dark:text-amber-400">
                        Limite proche
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </div>

              {/* Type d'événement */}
              <div className="space-y-2 group">
                <Label htmlFor="type" className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Type d'événement
                </Label>
                <Select value={formData.type} onValueChange={(value) => updateField("type", value)} disabled={isSubmitting}>
                  <SelectTrigger className="h-11 text-sm border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">💒 Mariage</SelectItem>
                    <SelectItem value="concert">🎵 Concert</SelectItem>
                    <SelectItem value="conference">📊 Conférence</SelectItem>
                    <SelectItem value="formation">📚 Formation</SelectItem>
                    <SelectItem value="corporate">🏢 Événement d'entreprise</SelectItem>
                    <SelectItem value="other">🎯 Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Section: Détails pratiques */}
            <div className="space-y-4 p-5 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-accent/10 hover:border-accent/20 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-accent/10">
                  <Clock className="h-4 w-4 text-accent" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Détails pratiques
              </h3>
              </div>

              {/* Date et heure sur 2 colonnes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 group">
                  <Label htmlFor="date" className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Date
                  </Label>
                  <div className="relative">
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateField("date", e.target.value)}
                      className="h-11 text-sm border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                      disabled={isSubmitting}
                  />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <Label htmlFor="time" className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent" />
                    Heure
                  </Label>
                  <div className="relative">
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => updateField("time", e.target.value)}
                      className="h-11 text-sm border-2 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 bg-white dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                      disabled={isSubmitting}
                  />
                  </div>
                </div>
              </div>

              {/* Lieu */}
              <div className="space-y-2 group">
                <Label htmlFor="location" className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Lieu
                </Label>
                <div className="relative">
                <Input
                  id="location"
                  placeholder="Château de Versailles"
                  value={formData.location}
                  onChange={(e) => updateField("location", e.target.value)}
                    className="h-11 text-sm border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 pl-4 pr-4 bg-white dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                    disabled={isSubmitting}
                />
                </div>
              </div>

              {/* Nombre de participants */}
              <div className="space-y-2 group">
                <Label htmlFor="attendees" className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Users className="h-4 w-4 text-accent" />
                  Participants estimés
                </Label>
                <div className="relative">
                <Input
                  id="attendees"
                  type="number"
                  placeholder="150"
                  value={formData.attendees}
                  onChange={(e) => updateField("attendees", e.target.value)}
                    className="h-11 text-sm border-2 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 pl-4 pr-4 bg-white dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 p-5 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-primary/20 transition-all duration-300">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Description (optionnel)
              </Label>
              <Textarea
                id="description"
                placeholder="Ajoutez des détails sur votre événement..."
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={4}
                className="text-sm resize-none border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white dark:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              />
            </div>

            {/* Bouton d'assistance IA */}
            <Button 
              type="button" 
              variant="outline" 
              className="w-full gap-2 h-11 text-sm bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg hover:shadow-purple-200/50 dark:hover:shadow-purple-900/20 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
              Compléter avec l'IA
            </Button>
          </form>
        </div>

        {/* Footer fixe avec boutons d'action */}
        <div className="relative border-t border-primary/10 px-6 py-5 bg-gradient-to-r from-white via-primary/5 to-accent/5 dark:from-gray-900 dark:via-primary/10 dark:to-accent/10 backdrop-blur-sm">
          {/* Effet de brillance subtil */}
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
              form="create-event-form"
              className="flex-1 h-11 text-sm font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
              Créer l'événement
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
