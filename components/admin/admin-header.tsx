/**
 * Header du Dashboard Admin
 * Affiche les alertes système, statistiques rapides et menu admin
 */

"use client"

import { Bell, ChevronDown, Settings, LogOut, User, Shield, AlertTriangle, Activity } from 'lucide-react'
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

export function AdminHeader() {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      // Afficher le toast avant la déconnexion
      toast.success("Déconnexion réussie", {
        description: "À bientôt !",
        duration: 2000,
      })

      // Tuer la session et rediriger
      await signOut({ 
        callbackUrl: "/login",
        redirect: true 
      })
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la déconnexion",
      })
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Titre et statistiques temps réel */}
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            Administration
          </h2>
          
          {/* Statistiques rapides */}
          <div className="hidden lg:flex items-center gap-4 ml-8">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
              <Activity className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-gray-900">1,247</span>
              <span className="text-xs text-gray-600">utilisateurs actifs</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-sm font-semibold text-gray-900">€12,450</span>
              <span className="text-xs text-gray-600">revenus aujourd'hui</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Alertes système */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  2
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
              <DropdownMenuLabel>Alertes Système</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-3 space-y-3 max-h-80 overflow-y-auto">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-900">Pic de charge serveur</p>
                      <p className="text-xs text-red-700 mt-1">CPU à 89% - Vérifier les ressources</p>
                      <p className="text-xs text-gray-500 mt-1">Il y a 3 min</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-orange-900">Transaction suspecte détectée</p>
                      <p className="text-xs text-orange-700 mt-1">Utilisateur ID: 2847 - Montant: €5,000</p>
                      <p className="text-xs text-gray-500 mt-1">Il y a 12 min</p>
                    </div>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-red-600 font-medium">
                Voir toutes les alertes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications admin */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
                  5
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
              <DropdownMenuLabel>Notifications Admin</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-3 space-y-3 max-h-80 overflow-y-auto">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-gray-900">Nouveau ticket support</p>
                  <p className="text-xs text-gray-600 mt-1">Utilisateur signale un problème de QR Code</p>
                  <p className="text-xs text-gray-500 mt-1">Il y a 2 min</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-sm font-medium text-gray-900">Nouveau paiement reçu</p>
                  <p className="text-xs text-gray-600 mt-1">Plan Premium - €20 par Sophie Martin</p>
                  <p className="text-xs text-gray-500 mt-1">Il y a 8 min</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-sm font-medium text-gray-900">Nouvelle inscription</p>
                  <p className="text-xs text-gray-600 mt-1">Thomas Dubois - Plan Standard</p>
                  <p className="text-xs text-gray-500 mt-1">Il y a 15 min</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary font-medium">
                Voir toutes les notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu Admin */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-semibold shadow-lg">
                  <Shield className="h-4 w-4" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium flex items-center gap-1">
                    Admin Principal
                    <Shield className="h-3 w-3 text-red-500" />
                  </div>
                  <div className="text-xs text-gray-500">admin@eventmaster.fr</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Compte Administrateur</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Mon profil admin
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Paramètres système
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion admin
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
