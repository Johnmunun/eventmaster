"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Chrome, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { signIn } from "next-auth/react"
import { toast } from "sonner"

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email ou mot de passe incorrect")
        toast.error("Erreur de connexion", {
          description: "Email ou mot de passe incorrect",
        })
      } else if (result?.ok) {
        toast.success("Connexion réussie", {
          description: "Bienvenue sur votre tableau de bord ! 🎉",
          duration: 3000,
        })
        // Ajouter un paramètre pour indiquer que c'est une nouvelle connexion
        router.push("/dashboard?loggedIn=true")
        router.refresh()
      }
    } catch (error) {
      setError("Une erreur est survenue")
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la connexion",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard?loggedIn=true" })
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la connexion Google",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-3xl font-bold text-foreground">Bon retour !</h2>
        <p className="text-muted-foreground">
          Connectez-vous pour accéder à votre tableau de bord
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-12 text-base border-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <Chrome className="mr-2 h-5 w-5" />
        Continuer avec Google
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
          <Label htmlFor="email" className="text-sm font-medium">Adresse email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 border-2 focus:border-primary"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
            <Link
              href="/mot-de-passe-oublie"
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all" 
          disabled={isLoading}
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link href="/signup" className="text-primary hover:text-primary/80 font-semibold transition-colors">
          Créer un compte
        </Link>
      </p>
    </div>
  )
}
