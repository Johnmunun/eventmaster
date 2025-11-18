/**
 * Page de gestion des événements
 * Permet de créer, modifier, supprimer et visualiser tous les événements
 * Avec recherche intelligente, filtres et pagination
 */
"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Calendar, MapPin, Users, Clock, MoreVertical, Search, Filter, ChevronLeft, ChevronRight, X, Loader2, Heart, Music, Presentation, GraduationCap, Building2, Sparkles, QrCode } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateEventDrawer } from "@/components/dashboard/events/create-event-drawer"
import { SkeletonCard } from "@/components/skeletons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Types pour les événements
interface Event {
  id: string
  name: string
  type: string
  date: string
  location: string | null
  description: string | null
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED"
  guestsCount: number
  qrCodesCount: number
  createdAt: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export default function EventsPage() {
  const router = useRouter()
  
  // États pour le drawer
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  
  // États pour les données
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  
  // États pour la recherche et les filtres
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [typeFilter, setTypeFilter] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  
  // Debounce pour la recherche (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1) // Réinitialiser à la page 1 lors d'une nouvelle recherche
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fonction pour charger les événements
  const fetchEvents = useCallback(async () => {
    setIsLoading(true)
    
    try {
      const params = new URLSearchParams()
      params.set("page", currentPage.toString())
      params.set("limit", "12")
      
      if (debouncedSearch) {
        params.set("search", debouncedSearch)
      }
      if (statusFilter) {
        params.set("status", statusFilter)
      }
      if (typeFilter) {
        params.set("type", typeFilter)
      }
      if (sortBy) {
        params.set("sortBy", sortBy)
      }
      if (sortOrder) {
        params.set("sortOrder", sortOrder)
      }

      const response = await fetch(`/api/events?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setEvents(data.events)
        setPagination(data.pagination)
      } else {
        toast.error("Erreur", {
          description: data.error || "Impossible de charger les événements",
        })
      }
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error)
      toast.error("Erreur", {
        description: "Une erreur est survenue lors du chargement des événements",
      })
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, debouncedSearch, statusFilter, typeFilter, sortBy, sortOrder])

  // Charger les événements quand les filtres changent
  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Rafraîchir après création d'un événement
  useEffect(() => {
    if (!isCreateOpen) {
      fetchEvents()
    }
  }, [isCreateOpen, fetchEvents])

  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "ONGOING":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "COMPLETED":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
      case "CANCELLED":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  // Fonction pour traduire le statut en français
  const translateStatus = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "À venir"
      case "ONGOING":
        return "En cours"
      case "COMPLETED":
        return "Terminé"
      case "CANCELLED":
        return "Annulé"
      default:
        return status
    }
  }

  // Fonction pour traduire le type en français
  const translateType = (type: string) => {
    const typeMap: Record<string, string> = {
      wedding: "Mariage",
      concert: "Concert",
      conference: "Conférence",
      formation: "Formation",
      corporate: "Événement d'entreprise",
      other: "Autre",
    }
    return typeMap[type] || type
  }

  // Fonction pour obtenir l'icône selon le type d'événement
  const getEventIcon = (type: string) => {
    const iconMap: Record<string, { icon: any, color: string, bgColor: string }> = {
      wedding: { 
        icon: Heart, 
        color: "text-pink-600 dark:text-pink-400",
        bgColor: "bg-pink-100 dark:bg-pink-900/30"
      },
      concert: { 
        icon: Music, 
        color: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-100 dark:bg-purple-900/30"
      },
      conference: { 
        icon: Presentation, 
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/30"
      },
      formation: { 
        icon: GraduationCap, 
        color: "text-indigo-600 dark:text-indigo-400",
        bgColor: "bg-indigo-100 dark:bg-indigo-900/30"
      },
      corporate: { 
        icon: Building2, 
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-100 dark:bg-orange-900/30"
      },
      other: { 
        icon: Sparkles, 
        color: "text-primary dark:text-primary",
        bgColor: "bg-primary/10 dark:bg-primary/20"
      },
    }
    return iconMap[type] || iconMap.other
  }

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter("")
    setTypeFilter("")
    setSortBy("date")
    setSortOrder("asc")
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery || statusFilter || typeFilter || sortBy !== "date" || sortOrder !== "asc"

  return (
    <div className="p-6 space-y-6">
      {/* En-tête de la page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Événements</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {pagination ? `${pagination.total} événement${pagination.total > 1 ? 's' : ''}` : "Gérez tous vos événements en un seul endroit"}
          </p>
        </div>
        {/* Bouton pour ouvrir le drawer de création */}
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Créer un événement
        </Button>
      </div>

      {/* Barre de recherche et filtres */}
      <Card className="border-2 border-primary/10 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Ligne 1: Recherche */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                  placeholder="Rechercher par nom, lieu ou description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Ligne 2: Filtres */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Filtre par statut */}
              <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
                <SelectTrigger className="w-[180px] border-2">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="UPCOMING">À venir</SelectItem>
                  <SelectItem value="ONGOING">En cours</SelectItem>
                  <SelectItem value="COMPLETED">Terminé</SelectItem>
                  <SelectItem value="CANCELLED">Annulé</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtre par type */}
              <Select value={typeFilter || "all"} onValueChange={(value) => setTypeFilter(value === "all" ? "" : value)}>
                <SelectTrigger className="w-[180px] border-2">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="wedding">Mariage</SelectItem>
                  <SelectItem value="concert">Concert</SelectItem>
                  <SelectItem value="conference">Conférence</SelectItem>
                  <SelectItem value="formation">Formation</SelectItem>
                  <SelectItem value="corporate">Événement d'entreprise</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>

              {/* Tri */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px] border-2">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Nom</SelectItem>
                  <SelectItem value="createdAt">Date de création</SelectItem>
                </SelectContent>
              </Select>

              {/* Ordre de tri */}
              <Button
                variant="outline"
                size="icon"
                className="border-2"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>

              {/* Réinitialiser les filtres */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="gap-2 border-2"
                >
                  <X className="h-4 w-4" />
                  Réinitialiser
            </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grille des événements */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Aucun événement trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {hasActiveFilters 
                ? "Essayez de modifier vos filtres de recherche"
                : "Commencez par créer votre premier événement"}
            </p>
            {!hasActiveFilters && (
              <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Créer un événement
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const eventDate = new Date(event.date)
              const formattedDate = eventDate.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
              const formattedTime = eventDate.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })

              const eventIcon = getEventIcon(event.type)
              const IconComponent = eventIcon.icon

              return (
                <Card 
                  key={event.id} 
                  className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary/20 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 relative overflow-hidden"
                >
                  {/* Effet de brillance au hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between gap-3">
                      {/* Icône du type d'événement */}
                      <div className={`relative p-3 rounded-xl ${eventIcon.bgColor} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        {/* Glow effect */}
                        <div className={`absolute inset-0 ${eventIcon.bgColor} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                        <IconComponent className={`relative h-6 w-6 ${eventIcon.color} drop-shadow-sm`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg mb-2 truncate group-hover:text-primary transition-colors">
                          {event.name}
                        </CardTitle>
                  <Badge className={getStatusColor(event.status)}>
                    {translateStatus(event.status)}
                  </Badge>
                </div>
                      
                {/* Menu d'actions pour chaque événement */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Modifier</DropdownMenuItem>
                    <DropdownMenuItem>Dupliquer</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
                  <CardContent className="space-y-3 relative z-10">
              {/* Informations de l'événement */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 group/item">
                      <div className="p-1.5 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors">
                        <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                      </div>
                      <span className="font-medium">{formattedDate} à {formattedTime}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 group/item">
                        <div className="p-1.5 rounded-lg bg-accent/10 group-hover/item:bg-accent/20 transition-colors">
                          <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
                        </div>
                        <span className="truncate font-medium">{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm pt-2">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 group/item">
                        <div className="p-1.5 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors">
                          <Users className="h-4 w-4 text-primary flex-shrink-0" />
                        </div>
                        <span className="font-semibold">{event.guestsCount} invité{event.guestsCount > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    {event.qrCodesCount > 0 && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-accent/10">
                          <QrCode className="h-4 w-4 text-accent" />
                        </div>
                        <Badge variant="outline" className="text-xs font-semibold">
                          {event.qrCodesCount} QR code{event.qrCodesCount > 1 ? 's' : ''}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
              </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Card className="border-2 border-primary/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Page {pagination.page} sur {pagination.totalPages} • {pagination.total} événement{pagination.total > 1 ? 's' : ''}
              </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={!pagination.hasPreviousPage || isLoading}
                      className="gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={!pagination.hasNextPage || isLoading}
                      className="gap-2"
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4" />
                    </Button>
              </div>
              </div>
            </CardContent>
          </Card>
          )}
        </>
      )}

      {/* Drawer pour créer un nouvel événement */}
      <CreateEventDrawer open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  )
}
