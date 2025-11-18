/**
 * Page publique pour le formulaire d'inscription
 * Sécurisée avec validation et rate limiting
 */
"use client"

import { useState, useEffect, use } from "react"
import { Calendar, MapPin, User, Mail, Phone, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface FormInfo {
  id: string
  title: string
  description: string | null
  requireEmail: boolean
  requirePhone: boolean
  event: {
    name: string
    date: string
    location: string | null
    description: string | null
  }
  maxSubmissions: number | null
  currentSubmissions: number
}

export default function PublicFormPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params)
  const [formInfo, setFormInfo] = useState<FormInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  // Charger les informations du formulaire
  useEffect(() => {
    const fetchFormInfo = async () => {
      try {
        const response = await fetch(`/api/public-forms/${resolvedParams.token}`)
        const data = await response.json()

        if (!response.ok || !data.success) {
          setError(data.error || "Formulaire non trouvé ou inaccessible")
          return
        }

        setFormInfo(data.form)
      } catch (error) {
        console.error("Erreur lors du chargement du formulaire:", error)
        setError("Une erreur est survenue lors du chargement du formulaire")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFormInfo()
  }, [resolvedParams.token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || !formInfo) return

    // Validation côté client
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("Erreur de validation", {
        description: "Le prénom et le nom sont requis",
      })
      return
    }

    if (formInfo.requireEmail && !formData.email.trim()) {
      toast.error("Erreur de validation", {
        description: "L'email est requis pour ce formulaire",
      })
      return
    }

    if (formInfo.requirePhone && !formData.phone.trim()) {
      toast.error("Erreur de validation", {
        description: "Le téléphone est requis pour ce formulaire",
      })
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/public-forms/${resolvedParams.token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim() || undefined,
          phone: formData.phone.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        const errorMessage = data.error || "Une erreur est survenue lors de l'enregistrement"
        setError(errorMessage)
        
        // Messages d'erreur spécifiques selon le code de statut
        if (response.status === 409) {
          toast.error("Inscription déjà existante", {
            description: errorMessage,
            duration: 6000,
          })
        } else if (response.status === 429) {
          toast.error("Trop de tentatives", {
            description: errorMessage,
            duration: 6000,
          })
        } else {
          toast.error("Erreur", {
            description: errorMessage,
            duration: 5000,
          })
        }
        return
      }

      setIsSubmitted(true)
      toast.success("Inscription réussie ! 🎉", {
        description: "Votre inscription a été enregistrée avec succès",
        duration: 5000,
      })

    } catch (error) {
      console.error("Erreur lors de la soumission:", error)
      setError("Une erreur est survenue. Veuillez réessayer.")
      toast.error("Erreur de connexion", {
        description: "Impossible de se connecter au serveur. Veuillez réessayer.",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Chargement du formulaire...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !formInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-red-200">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Erreur
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitted && formInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-green-200 bg-gradient-to-br from-white to-green-50/50">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="h-16 w-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Inscription réussie ! 🎉
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Merci {formData.firstName} ! Votre inscription a été enregistrée avec succès.
              </p>
            </div>
            <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Vous recevrez prochainement toutes les informations concernant l'événement.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!formInfo) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary/5 to-accent/5 dark:from-gray-900 dark:via-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* En-tête avec informations de l'événement */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5 dark:from-gray-900 dark:to-primary/10 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mb-4">
              <div className="h-16 w-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {formInfo.title || formInfo.event.name}
              </CardTitle>
              {formInfo.description && (
                <CardDescription className="mt-2 text-base">
                  {formInfo.description}
                </CardDescription>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
              <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatDate(formInfo.event.date)}
                </p>
              </div>
            </div>
            {formInfo.event.location && (
              <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formInfo.event.location}
                </p>
              </div>
            )}
            {formInfo.maxSubmissions && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
                {formInfo.currentSubmissions} / {formInfo.maxSubmissions} inscriptions
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formulaire */}
        <Card className="border-2 border-primary/20 bg-white dark:bg-gray-900 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Formulaire d'inscription
            </CardTitle>
            <CardDescription>
              Remplissez le formulaire ci-dessous pour vous inscrire à cet événement
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Prénom et Nom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold">
                    Prénom *
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Marie"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="h-11 border-2 focus:border-primary"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold">
                    Nom *
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="h-11 border-2 focus:border-primary"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Email {formInfo.requireEmail && "*"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="marie.dupont@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="h-11 border-2 focus:border-primary"
                  required={formInfo.requireEmail}
                  disabled={isSubmitting}
                />
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4 text-accent" />
                  Téléphone {formInfo.requirePhone && "*"}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="h-11 border-2 focus:border-accent"
                  required={formInfo.requirePhone}
                  disabled={isSubmitting}
                />
              </div>

              {/* Bouton de soumission */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    S'inscrire
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

