/**
 * Composant pour afficher et gérer les formulaires publics
 */
"use client"

import { useState, useEffect } from "react"
import { Share2, Copy, CheckCircle2, XCircle, MoreVertical, Eye, EyeOff, Trash2, Link, Calendar, Users, Clock, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { SkeletonCard } from "@/components/skeletons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  createdAt: string
  event: {
    id: string
    name: string
    date: string
  }
}

interface PublicFormsListProps {
  eventId?: string
  onFormCreated?: () => void
}

export function PublicFormsList({ eventId, onFormCreated }: PublicFormsListProps) {
  const [forms, setForms] = useState<PublicForm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchForms()
  }, [eventId])

  useEffect(() => {
    // Écouter l'événement de création de formulaire
    const handleFormCreated = () => {
      fetchForms()
    }
    
    window.addEventListener('publicFormCreated', handleFormCreated)
    
    return () => {
      window.removeEventListener('publicFormCreated', handleFormCreated)
    }
  }, [])

  const fetchForms = async () => {
    setIsLoading(true)
    try {
      const url = eventId ? `/api/public-forms?eventId=${eventId}` : '/api/public-forms'
      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setForms(data.forms)
      } else {
        toast.error("Erreur", {
          description: data.error || "Impossible de charger les formulaires",
        })
      }
    } catch (error) {
      console.error("Erreur lors du chargement des formulaires:", error)
      toast.error("Erreur", {
        description: "Une erreur est survenue lors du chargement des formulaires",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFormStatus = async (formId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/public-forms/manage/${formId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error("Erreur", {
          description: data.error || "Impossible de modifier le statut du formulaire",
        })
        return
      }

      toast.success("Statut modifié", {
        description: `Le formulaire est maintenant ${!currentStatus ? 'actif' : 'inactif'}`,
      })

      fetchForms()
    } catch (error) {
      console.error("Erreur lors de la modification du statut:", error)
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la modification",
      })
    }
  }

  const deleteForm = async (formId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce formulaire ? Cette action est irréversible.")) {
      return
    }

    try {
      const response = await fetch(`/api/public-forms/manage/${formId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error("Erreur", {
          description: data.error || "Impossible de supprimer le formulaire",
        })
        return
      }

      toast.success("Formulaire supprimé", {
        description: "Le formulaire a été supprimé avec succès",
      })

      fetchForms()
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la suppression",
      })
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (forms.length === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="p-12 text-center">
          <Share2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Aucun formulaire public
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Créez votre premier formulaire public pour permettre à vos invités de s'inscrire eux-mêmes
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Formulaires publics</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {forms.length} formulaire{forms.length > 1 ? 's' : ''} créé{forms.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {forms.map((form) => {
          const expired = isExpired(form.expiresAt)
          const isLimitReached = form.maxSubmissions && form.currentSubmissions >= form.maxSubmissions

          return (
            <Card
              key={form.id}
              className={`border-2 transition-all hover:shadow-lg ${
                form.isActive && !expired && !isLimitReached
                  ? 'border-primary/20 bg-gradient-to-br from-white to-primary/5'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-1 truncate">
                      {form.title || form.event.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-xs">
                      <Calendar className="h-3 w-3" />
                      {formatDate(form.event.date)}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => toggleFormStatus(form.id, form.isActive)}
                      >
                        {form.isActive ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Désactiver
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Activer
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => copyToClipboard(form.publicUrl)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copier le lien
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => deleteForm(form.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Statut et badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className={
                      form.isActive && !expired && !isLimitReached
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    }
                  >
                    {form.isActive && !expired && !isLimitReached ? 'Actif' : 'Inactif'}
                  </Badge>
                  {expired && (
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Expiré
                    </Badge>
                  )}
                  {isLimitReached && (
                    <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                      Limite atteinte
                    </Badge>
                  )}
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Soumissions</p>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-primary" />
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {form.currentSubmissions}
                        {form.maxSubmissions && ` / ${form.maxSubmissions}`}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Créé le</p>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-accent" />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {formatDate(form.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {form.expiresAt && (
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Expire le {formatDateTime(form.expiresAt)}
                    </p>
                  </div>
                )}

                {/* Lien du formulaire */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    Lien du formulaire
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={form.publicUrl}
                      readOnly
                      className="flex-1 font-mono text-xs bg-gray-50 dark:bg-gray-900 h-8"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(form.publicUrl)}
                      className="h-8 w-8 flex-shrink-0"
                    >
                      {copiedUrl === form.publicUrl ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Actions rapides */}
                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => shareOnWhatsApp(form.publicUrl, form.title || form.event.name)}
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => copyToClipboard(form.publicUrl)}
                  >
                    <Link className="h-3 w-3 mr-1" />
                    Copier
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

