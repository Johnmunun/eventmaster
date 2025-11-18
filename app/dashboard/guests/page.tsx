/**
 * Page de gestion des invités
 * Liste, ajout, modification et suppression des invités
 * Avec recherche intelligente, filtres et pagination
 */
"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Users, Mail, Phone, Search, Filter, CheckCircle, XCircle, ChevronLeft, ChevronRight, X, Calendar, UserCheck, UserX, Clock, MoreVertical, Share2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddGuestDrawer } from "@/components/dashboard/guests/add-guest-drawer"
import { EditGuestDrawer } from "@/components/dashboard/guests/edit-guest-drawer"
import { CreatePublicFormDrawer } from "@/components/dashboard/guests/create-public-form-drawer"
import { PublicFormsList } from "@/components/dashboard/guests/public-forms-list"
import { SkeletonTable, SkeletonCard } from "@/components/skeletons"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Guest {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string | null
  phone: string | null
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "ATTENDED"
  confirmedAt: string | null
  scannedAt: string | null
  hasScanned: boolean
  event: {
    id: string
    name: string
    date: string
  }
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

interface GuestStats {
  total: number
  confirmed: number
  pending: number
  cancelled: number
  attended: number
}

export default function GuestsPage() {
  const router = useRouter()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isPublicFormOpen, setIsPublicFormOpen] = useState(false)
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null)
  const [selectedGuests, setSelectedGuests] = useState<string[]>([])
  
  // États pour les données
  const [guests, setGuests] = useState<Guest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<GuestStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  
  // États pour la recherche et les filtres
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [eventFilter, setEventFilter] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  
  // États pour les événements (pour le filtre)
  const [events, setEvents] = useState<Array<{ id: string; name: string }>>([])

  // Debounce pour la recherche (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Charger les événements
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events/list")
        const data = await response.json()
        if (data.success) {
          setEvents(data.events)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des événements:", error)
      }
    }
    fetchEvents()
  }, [])

  // Fonction pour charger les invités
  const fetchGuests = useCallback(async () => {
    setIsLoading(true)
    
    try {
      const params = new URLSearchParams()
      params.set("page", currentPage.toString())
      params.set("limit", "20")
      
      if (debouncedSearch) {
        params.set("search", debouncedSearch)
      }
      if (statusFilter) {
        params.set("status", statusFilter)
      }
      if (eventFilter) {
        params.set("eventId", eventFilter)
      }
      if (sortBy) {
        params.set("sortBy", sortBy)
      }
      if (sortOrder) {
        params.set("sortOrder", sortOrder)
      }

      const response = await fetch(`/api/guests?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setGuests(data.guests)
        setPagination(data.pagination)
      } else {
        toast.error("Erreur", {
          description: data.error || "Impossible de charger les invités",
        })
      }
    } catch (error) {
      console.error("Erreur lors du chargement des invités:", error)
      toast.error("Erreur", {
        description: "Une erreur est survenue lors du chargement des invités",
      })
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, debouncedSearch, statusFilter, eventFilter, sortBy, sortOrder])

  // Charger les statistiques
  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true)
    try {
      const response = await fetch("/api/guests/stats")
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error)
    } finally {
      setIsLoadingStats(false)
    }
  }, [])

  // Charger les données
  useEffect(() => {
    fetchGuests()
    fetchStats()
  }, [fetchGuests, fetchStats])

  // Rafraîchir après ajout d'un invité
  useEffect(() => {
    if (!isAddOpen) {
      fetchGuests()
      fetchStats()
    }
  }, [isAddOpen, fetchGuests, fetchStats])

  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Confirmé</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">En attente</Badge>
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Annulé</Badge>
      case "ATTENDED":
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Présent</Badge>
      default:
        return null
    }
  }

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter("")
    setEventFilter("")
    setSortBy("createdAt")
    setSortOrder("desc")
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery || statusFilter || eventFilter || sortBy !== "createdAt" || sortOrder !== "desc"

  // Fonction pour modifier un invité
  const handleEditGuest = (guestId: string) => {
    setSelectedGuestId(guestId)
    setIsEditOpen(true)
  }

  // Fonction pour supprimer un invité
  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet invité ?")) {
      return
    }

    try {
      const response = await fetch(`/api/guests/${guestId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error("Erreur", {
          description: data.error || "Impossible de supprimer l'invité",
        })
        return
      }

      toast.success("Invité supprimé", {
        description: "L'invité a été supprimé avec succès",
      })

      fetchGuests()
      fetchStats()
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la suppression",
      })
    }
  }

  // Fonction pour envoyer des invitations
  const handleSendInvitation = async (guestIds: string[]) => {
    if (guestIds.length === 0) {
      toast.error("Erreur", {
        description: "Veuillez sélectionner au moins un invité",
      })
      return
    }

    // Vérifier que les invités sélectionnés ont un email
    const guestsWithEmail = guests.filter(g => guestIds.includes(g.id) && g.email)
    
    if (guestsWithEmail.length === 0) {
      toast.error("Erreur", {
        description: "Aucun des invités sélectionnés n'a d'adresse email",
      })
      return
    }

    // Pour l'instant, on simule l'envoi
    // Dans un vrai projet, vous ouvririez un drawer pour saisir le sujet et le message
    const subject = `Invitation à ${guestsWithEmail[0]?.event.name || "l'événement"}`
    const message = `Bonjour,\n\nVous êtes invité(e) à notre événement.\n\nNous espérons vous voir bientôt !`

    try {
      const response = await fetch("/api/guests/send-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestIds: guestsWithEmail.map(g => g.id),
          subject,
          message,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error("Erreur", {
          description: data.error || "Impossible d'envoyer les invitations",
        })
        return
      }

      toast.success("Invitations envoyées", {
        description: `${data.results.successful} invitation(s) envoyée(s) avec succès`,
      })
    } catch (error) {
      console.error("Erreur lors de l'envoi des invitations:", error)
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de l'envoi des invitations",
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invités</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {stats ? `${stats.total} invité${stats.total > 1 ? 's' : ''}` : "Gérez votre liste d'invités"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsPublicFormOpen(true)} 
            className="gap-2 border-2 hover:border-primary/40"
          >
            <Share2 className="h-4 w-4" />
            Formulaire public
          </Button>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un invité
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      {isLoadingStats ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-2 border-primary/10 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 hover:shadow-lg transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total invités</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200/50 bg-gradient-to-br from-white to-green-50/50 dark:from-gray-900 dark:to-green-900/20 hover:shadow-lg transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Confirmés</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.confirmed}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-yellow-200/50 bg-gradient-to-br from-white to-yellow-50/50 dark:from-gray-900 dark:to-yellow-900/20 hover:shadow-lg transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200/50 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/20 hover:shadow-lg transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Présents</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.attended}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recherche et filtres */}
      <Card className="border-2 border-primary/10 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Ligne 1: Recherche */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, email ou téléphone..."
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
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmé</SelectItem>
                  <SelectItem value="CANCELLED">Annulé</SelectItem>
                  <SelectItem value="ATTENDED">Présent</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtre par événement */}
              <Select value={eventFilter || "all"} onValueChange={(value) => setEventFilter(value === "all" ? "" : value)}>
                <SelectTrigger className="w-[200px] border-2">
                  <SelectValue placeholder="Tous les événements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les événements</SelectItem>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Tri */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px] border-2">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date d'ajout</SelectItem>
                  <SelectItem value="name">Nom</SelectItem>
                  <SelectItem value="status">Statut</SelectItem>
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

      {/* Table des invités */}
      {isLoading ? (
        <SkeletonTable rows={10} columns={7} />
      ) : guests.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Aucun invité trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {hasActiveFilters 
                ? "Essayez de modifier vos filtres de recherche"
                : "Commencez par ajouter votre premier invité"}
            </p>
            {!hasActiveFilters && (
              <Button onClick={() => setIsAddOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un invité
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-2 border-primary/10 overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                    <TableHead className="font-semibold">Nom complet</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Téléphone</TableHead>
                    <TableHead className="font-semibold">Événement</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                    <TableHead className="font-semibold">Check-in</TableHead>
                    <TableHead className="font-semibold w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guests.map((guest) => {
                    const eventDate = new Date(guest.event.date)
                    const formattedDate = eventDate.toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                    })

                    return (
                      <TableRow key={guest.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                              {guest.firstName[0]}{guest.lastName[0]}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {guest.fullName}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Ajouté le {new Date(guest.createdAt).toLocaleDateString("fr-FR")}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {guest.email ? (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="truncate max-w-[200px]">{guest.email}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Non renseigné</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {guest.phone ? (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                              <span>{guest.phone}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Non renseigné</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                            <div>
                              <div className="font-medium text-sm text-gray-900 dark:text-white">
                                {guest.event.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {formattedDate}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(guest.status)}</TableCell>
                        <TableCell>
                          {guest.hasScanned ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                              <span className="text-xs text-gray-500">
                                {guest.scannedAt ? new Date(guest.scannedAt).toLocaleDateString("fr-FR") : ""}
                              </span>
                            </div>
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-400" />
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedGuestId(guest.id)
                                  setIsEditOpen(true)
                                }}
                              >
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleSendInvitation([guest.id])}
                                disabled={!guest.email}
                              >
                                Envoyer invitation
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteGuest(guest.id)}
                              >
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Card className="border-2 border-primary/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Page {pagination.page} sur {pagination.totalPages} • {pagination.total} invité{pagination.total > 1 ? 's' : ''}
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

      {/* Liste des formulaires publics */}
      <PublicFormsList />

      <AddGuestDrawer open={isAddOpen} onOpenChange={setIsAddOpen} />
      <EditGuestDrawer
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open)
          if (!open) {
            setSelectedGuestId(null)
          }
        }}
        guestId={selectedGuestId}
      />
      <CreatePublicFormDrawer open={isPublicFormOpen} onOpenChange={setIsPublicFormOpen} />
    </div>
  )
}
