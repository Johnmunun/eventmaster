/**
 * Drawer de création de dossier pour les QR codes
 * Permet d'organiser les QR codes en catégories
 * Design amélioré avec gradients et animations
 */
"use client"

import { useState } from "react"
import { X, Save, Folder, Sparkles, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface CreateFolderDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFolderCreated?: () => void
}

const colors = [
  { name: "Violet", value: "purple", class: "bg-purple-500", gradient: "from-purple-400 to-purple-600" },
  { name: "Bleu", value: "blue", class: "bg-blue-500", gradient: "from-blue-400 to-blue-600" },
  { name: "Vert", value: "green", class: "bg-green-500", gradient: "from-green-400 to-green-600" },
  { name: "Orange", value: "orange", class: "bg-orange-500", gradient: "from-orange-400 to-orange-600" },
  { name: "Rouge", value: "red", class: "bg-red-500", gradient: "from-red-400 to-red-600" },
  { name: "Rose", value: "pink", class: "bg-pink-500", gradient: "from-pink-400 to-pink-600" },
]

export function CreateFolderDrawer({ open, onOpenChange, onFolderCreated }: CreateFolderDrawerProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    color: "purple",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isSubmitting) {
      setFormData({ name: "", color: "purple" })
    }
    onOpenChange(newOpen)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || !formData.name.trim()) return

    setIsSubmitting(true)
    const loadingToast = toast.loading("Processus en cours...", {
      description: "Création du dossier en cours",
    })

    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          color: formData.color,
        }),
      })

      const data = await response.json()
      toast.dismiss(loadingToast)

      if (!response.ok || !data.success) {
        const errorMessage = data.error || "Une erreur est survenue lors de la création du dossier"
        toast.error("Erreur", {
          description: errorMessage,
          duration: 5000,
        })
        return
      }

      toast.success("Dossier créé ! 📁", {
        description: `"${data.folder.name}" a été créé avec succès`,
        duration: 4000,
      })

      handleOpenChange(false)
      if (onFolderCreated) {
        onFolderCreated()
      }
      router.refresh()

    } catch (error) {
      toast.dismiss(loadingToast)
      console.error("Erreur lors de la création du dossier:", error)
      toast.error("Erreur de connexion", {
        description: "Impossible de se connecter au serveur. Veuillez réessayer.",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedColor = colors.find(c => c.value === formData.color) || colors[0]

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] p-0 flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 [&>button]:hidden overflow-hidden"
      >
        {/* En-tête */}
        <div className="relative flex-shrink-0 px-6 py-5 bg-gradient-to-r from-primary/5 via-primary/3 to-accent/5 border-b border-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-accent/20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg">
                  <Folder className="h-5 w-5 text-white" />
                </div>
                <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Nouveau dossier
                </SheetTitle>
              </div>
              <SheetDescription className="text-sm text-gray-600 dark:text-gray-400 ml-12">
                Organisez vos QR codes en catégories
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
          <form id="create-folder-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Nom du dossier */}
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
                <Label htmlFor="folder-name" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Nom du dossier *
                </Label>
                <Input
                  id="folder-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Mariages, Concerts, Formations..."
                  className="h-11 text-sm border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Couleur */}
            <div className="space-y-4 p-5 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-accent/10 hover:border-accent/20 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-accent/10">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Couleur
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {colors.map((color) => {
                  const isSelected = formData.color === color.value
                  return (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      disabled={isSubmitting}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 group ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-105'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/30 hover:bg-gray-50 dark:hover:bg-gray-800'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className={`w-8 h-6 rounded-lg bg-gradient-to-r ${color.gradient} shadow-md group-hover:scale-110 transition-transform`} />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white flex-1 text-left">
                        {color.name}
                      </span>
                      {isSelected && (
                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Aperçu */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 border-2 border-primary/10 shadow-lg">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wider">
                Aperçu du dossier
              </p>
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-md">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${selectedColor.gradient} border-2 border-white dark:border-gray-800 shadow-lg`}>
                  <Folder className="h-8 w-8 text-white drop-shadow-md" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg text-gray-900 dark:text-white">
                    {formData.name || "Nom du dossier"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    0 QR code
                  </p>
                </div>
              </div>
            </div>
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
              form="create-folder-form"
              className="flex-1 h-11 text-sm font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isSubmitting || !formData.name.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Créer le dossier
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
