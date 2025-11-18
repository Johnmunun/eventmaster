"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Chrome, Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { BonusPopup } from "@/components/bonus-popup"

export function SignupForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showBonusPopup, setShowBonusPopup] = useState(false)
  const [bonusCredits, setBonusCredits] = useState(0)
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number
    feedback: string[]
  }>({ score: 0, feedback: [] })

  // Fonction de validation du mot de passe
  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push("Au moins 8 caractères")
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Au moins une majuscule")
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Au moins une minuscule")
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Au moins un chiffre")
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("Au moins un caractère spécial (!@#$%^&*)")
    }

    // Vérifier les mots de passe courants/faibles
    const commonPasswords = [
      "password", "12345678", "password123", "admin123", "qwerty123",
      "azerty123", "motdepasse", "123456789", "password1", "welcome123"
    ]
    
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      errors.push("Mot de passe trop commun")
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Calculer la force du mot de passe en temps réel
  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength({ score: 0, feedback: [] })
      return
    }

    const validation = validatePassword(password)
    const score = 5 - validation.errors.length
    setPasswordStrength({ score: Math.max(0, score), feedback: validation.errors })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validation de la correspondance des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      toast.error("Erreur de validation", {
        description: "Les mots de passe ne correspondent pas",
      })
      return
    }

    // Validation de la force du mot de passe
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      const errorMessage = `Mot de passe faible. Requis : ${passwordValidation.errors.join(", ")}`
      setError(errorMessage)
      toast.error("Mot de passe trop faible", {
        description: passwordValidation.errors.join(". "),
        duration: 5000,
      })
      return
    }
    
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Une erreur est survenue")
        toast.error("Erreur d'inscription", {
          description: data.error || "Une erreur est survenue",
        })
        return
      }

      // Afficher le popup de bonus
      if (data.bonusCredits) {
        setBonusCredits(data.bonusCredits)
        setShowBonusPopup(true)
      }

      toast.success("Compte créé avec succès", {
        description: `Vous avez reçu ${data.bonusCredits || 10} crédits de bienvenue ! 🎉`,
        duration: 3000,
      })

      // Connecter automatiquement l'utilisateur après l'inscription
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.ok) {
        // Attendre un peu pour laisser le popup s'afficher
        setTimeout(() => {
          setShowBonusPopup(false)
          router.push("/dashboard")
          router.refresh()
        }, 3000)
      }
    } catch (error) {
      setError("Une erreur est survenue")
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de l'inscription",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de l'inscription Google",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-3xl font-bold text-foreground">Créer un compte</h2>
        <p className="text-muted-foreground">
          Commencez votre essai gratuit de 14 jours
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-12 text-base border-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
        onClick={handleGoogleSignup}
        disabled={isLoading}
      >
        <Chrome className="mr-2 h-5 w-5" />
        S'inscrire avec Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground font-medium">Ou avec email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium">Nom complet</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              placeholder="Jean Dupont"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="pl-10 h-12 border-2 focus:border-primary"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Adresse email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-10 h-12 border-2 focus:border-primary"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value })
                calculatePasswordStrength(e.target.value)
              }}
              className="pl-10 pr-10 h-12 border-2 focus:border-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {/* Indicateur de force du mot de passe */}
          {formData.password && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      level <= passwordStrength.score
                        ? level <= 2
                          ? "bg-red-500"
                          : level <= 3
                          ? "bg-orange-500"
                          : "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              {passwordStrength.feedback.length > 0 && (
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p className="font-medium text-amber-600">Requis :</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {passwordStrength.feedback.map((feedback, index) => (
                      <li key={index} className="text-amber-600">{feedback}</li>
                    ))}
                  </ul>
                </div>
              )}
              {passwordStrength.score === 5 && (
                <p className="text-xs text-green-600 font-medium">✓ Mot de passe fort</p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmer le mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="pl-10 pr-10 h-12 border-2 focus:border-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, acceptTerms: checked as boolean })
            }
            className="mt-1 border-2"
          />
          <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
            J'accepte les{" "}
            <Link href="/conditions" className="text-primary hover:text-primary/80 font-semibold">
              conditions d'utilisation
            </Link>{" "}
            et la{" "}
            <Link href="/confidentialite" className="text-primary hover:text-primary/80 font-semibold">
              politique de confidentialité
            </Link>
          </label>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all" 
          disabled={isLoading || !formData.acceptTerms}
        >
          {isLoading ? "Création du compte..." : "Créer mon compte"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Vous avez déjà un compte ?{" "}
        <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
          Se connecter
        </Link>
      </p>

      {/* Popup de bonus */}
      <BonusPopup
        open={showBonusPopup}
        onClose={() => {
          setShowBonusPopup(false)
          router.push("/dashboard")
          router.refresh()
        }}
        credits={bonusCredits}
      />
    </div>
  )
}
