"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Calendar, Users, TrendingUp, Plus, Search, Filter, MoreVertical, Mail, MessageSquare, Download, Eye, LogOut, Settings, Bell, ChevronDown } from 'lucide-react'
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { signOut } from "next-auth/react"
import { toast } from "sonner"

export function DashboardContent() {
  const [searchQuery, setSearchQuery] = useState("")

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

  const stats = [
    {
      title: "Événements actifs",
      value: "12",
      change: "+2 ce mois",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "QR codes générés",
      value: "2,847",
      change: "+458 cette semaine",
      icon: QrCode,
      color: "text-primary",
      bgColor: "bg-orange-100",
    },
    {
      title: "Invitations envoyées",
      value: "8,542",
      change: "+1,203 aujourd'hui",
      icon: Mail,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Taux de participation",
      value: "68.5%",
      change: "+5.2% vs dernier mois",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  const recentEvents = [
    {
      id: 1,
      name: "Mariage Sophie & Thomas",
      date: "15 Juillet 2024",
      guests: 150,
      qrScanned: 142,
      status: "En cours",
    },
    {
      id: 2,
      name: "Concert Rock Festival 2024",
      date: "22 Août 2024",
      guests: 5000,
      qrScanned: 4823,
      status: "En cours",
    },
    {
      id: 3,
      name: "Formation Marketing Digital",
      date: "10 Septembre 2024",
      guests: 45,
      qrScanned: 43,
      status: "Planifié",
    },
    {
      id: 4,
      name: "Soirée d'entreprise TechCorp",
      date: "5 Octobre 2024",
      guests: 200,
      qrScanned: 0,
      status: "Planifié",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <QrCode className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">EventMaster</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                3
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                    JD
                  </div>
                  <span className="hidden md:inline">Jean Dupont</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  Profil
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        {/* Page Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Bienvenue, Jean ! Voici un aperçu de vos événements.
            </p>
          </div>
          <Button className="gap-2 w-full sm:w-auto">
            <Plus className="h-5 w-5" />
            Créer un événement
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Événements récents</CardTitle>
                <CardDescription>Gérez et suivez vos événements en un coup d'œil</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-[200px]"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{event.name}</h4>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.guests} invités
                      </div>
                      <div className="flex items-center gap-1">
                        <QrCode className="h-4 w-4" />
                        {event.qrScanned} scannés
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === "En cours"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {event.status}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Envoyer invitations
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Exporter données
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
