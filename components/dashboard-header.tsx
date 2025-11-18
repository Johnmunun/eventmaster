"use client"

import { useEffect, useState } from "react"
import { Bell, ChevronDown, Settings, LogOut, User, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useRouter } from 'next/navigation'
import { signOut } from "next-auth/react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  credits: number
  role: string
  plan: string
  initials: string
}

export function DashboardHeader() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Charger les informations de l'utilisateur
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/user/profile")
        const data = await response.json()
        
        if (data.success && data.user) {
          setUser(data.user)
        } else {
          toast.error("Erreur", {
            description: "Impossible de charger votre profil",
          })
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error)
        toast.error("Erreur", {
          description: "Une erreur est survenue lors du chargement de votre profil",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleSignOut = async () => {
    try {
      // Afficher le toast avant la déconnexion
      toast.success("Déconnexion réussie", {
        description: "Vous avez été déconnecté avec succès. À bientôt ! 👋",
        duration: 3000,
      })

      // Petite pause pour que l'utilisateur voie le toast
      await new Promise(resolve => setTimeout(resolve, 500))

      // Tuer la session et rediriger
      await signOut({ 
        callbackUrl: "/login",
        redirect: true 
      })
    } catch (error) {
      toast.error("Erreur de déconnexion", {
        description: "Une erreur est survenue lors de la déconnexion. Veuillez réessayer.",
        duration: 4000,
      })
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {isLoading ? (
            <Skeleton className="h-6 w-48" />
          ) : (
            <h2 className="text-lg font-semibold text-gray-900">
              Bienvenue, {user?.name || user?.email?.split("@")[0] || "Utilisateur"}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Affichage des crédits IA restants */}
          {isLoading ? (
            <Skeleton className="hidden sm:block h-9 w-32 rounded-lg" />
          ) : (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <Zap className="h-4 w-4 text-yellow-600" />
              <div className="text-sm">
                <span className="font-bold text-gray-900">
                  {user?.credits ?? 0}
                </span>
                <span className="text-gray-600 ml-1">crédits</span>
              </div>
            </div>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-3 space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-gray-900">Nouveau scan détecté</p>
                  <p className="text-xs text-gray-600 mt-1">Mariage Sophie & Thomas - Il y a 5 min</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-sm font-medium text-gray-900">Invitation confirmée</p>
                  <p className="text-xs text-gray-600 mt-1">Concert Rock Festival - Il y a 15 min</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <p className="text-sm font-medium text-gray-900">Rappel d'événement</p>
                  <p className="text-xs text-gray-600 mt-1">Formation Marketing Digital - Demain à 9h</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary font-medium">
                Voir toutes les notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          {isLoading ? (
            <Skeleton className="h-9 w-40 rounded-lg" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  {user?.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name || "Avatar"} 
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold">
                      {user?.initials || "U"}
                    </div>
                  )}
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">
                      {user?.name || "Utilisateur"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.email}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
