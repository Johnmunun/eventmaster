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
import { useRouter } from 'next/navigation'
import { signOut } from "next-auth/react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardMobileMenu } from "@/components/dashboard-mobile-menu"

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
      toast.success("Déconnexion réussie", {
        description: "Vous avez été déconnecté avec succès. À bientôt ! 👋",
        duration: 3000,
      })

      await new Promise(resolve => setTimeout(resolve, 500))

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
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
        {/* Mobile menu button - visible seulement sur mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <DashboardMobileMenu />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">
            {isLoading ? (
              <Skeleton className="h-5 w-32" />
            ) : (
              user?.name || user?.email?.split("@")[0] || "EventMaster"
            )}
          </h2>
        </div>

        {/* Desktop welcome message */}
        <div className="hidden md:flex items-center gap-4">
          {isLoading ? (
            <Skeleton className="h-6 w-48" />
          ) : (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bienvenue, {user?.name || user?.email?.split("@")[0] || "Utilisateur"}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Affichage des crédits IA restants */}
          {isLoading ? (
            <Skeleton className="hidden sm:block h-9 w-32 rounded-lg" />
          ) : (
            <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <div className="text-sm">
                <span className="font-bold text-gray-900 dark:text-white">
                  {user?.credits ?? 0}
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">crédits</span>
              </div>
            </div>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-3 space-y-3 max-h-[400px] overflow-y-auto">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Nouveau scan détecté</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Mariage Sophie & Thomas - Il y a 5 min</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Invitation confirmée</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Concert Rock Festival - Il y a 15 min</p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Rappel d'événement</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Formation Marketing Digital - Demain à 9h</p>
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
            <Skeleton className="h-9 w-40 rounded-lg hidden sm:block" />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 h-9 sm:h-10 px-2 sm:px-3">
                  {user?.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name || "Avatar"} 
                      className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                      {user?.initials || "U"}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium">
                      {user?.name || "Utilisateur"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
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
