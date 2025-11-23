/**
 * Page de gestion des QR codes
 * Permet de générer, personnaliser et gérer tous les QR codes
 * Avec système de dossiers pour organiser les QR codes
 * Recherche intelligente, filtres et compteurs en temps réel
 */
"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, QrCode, Download, Eye, MoreVertical, Search, Palette, Folder, FolderPlus, ChevronRight, Trash2, Edit2, Sparkles, Filter, X, Calendar, ScanLine, Globe, CheckSquare, Square } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateQRCodeDrawer } from "@/components/dashboard/qrcodes/create-qrcode-drawer"
import { CreateFolderDrawer } from "@/components/dashboard/qrcodes/create-folder-drawer"
import { QRPreviewDrawer } from "@/components/dashboard/qrcodes/qr-preview-drawer"
import { QRGeneratorDrawer } from "@/components/dashboard/qrcodes/qr-generator-drawer"
import { SkeletonCard, SkeletonTable, SkeletonFolderCard } from "@/components/skeletons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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

type QRCodeItem = {
  id: string
  code: string
  name: string
  type: "EVENT" | "GUEST" | "CUSTOM"
  scanned: boolean
  scannedAt: string | null
  createdAt: string
  imageUrl?: string
  imageKitFileId?: string | null
  event: {
    id: string
    name: string
    date: string
  } | null
  folder: {
    id: string
    name: string
    color: string
  } | null
  guest: {
    id: string
    firstName: string
    lastName: string
  } | null
}

type FolderItem = {
  id: string
  name: string
  count: number
  color: string
  createdAt: string
}

export default function QRCodesPage() {
  const router = useRouter()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewQRCodeId, setPreviewQRCodeId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>("")
  const [eventFilter, setEventFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("active")
  const [sortBy, setSortBy] = useState<string>("recent")
  const [quantity, setQuantity] = useState<string>("10")
  const [selectedQRCodes, setSelectedQRCodes] = useState<Set<string>>(new Set())
  
  // États pour les données
  const [folders, setFolders] = useState<FolderItem[]>([])
  const [isLoadingFolders, setIsLoadingFolders] = useState(true)
  const [qrcodes, setQrcodes] = useState<QRCodeItem[]>([])
  const [isLoadingQrcodes, setIsLoadingQrcodes] = useState(true)
  const [events, setEvents] = useState<Array<{ id: string; name: string }>>([])

  // Debounce pour la recherche
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchQuery])

  const fetchFolders = useCallback(async () => {
    setIsLoadingFolders(true)
    try {
      const response = await fetch("/api/folders")
      const data = await response.json()
      if (data.success) {
        // Charger le nombre réel de QR codes pour chaque dossier
        const foldersWithCount = await Promise.all(
          data.folders.map(async (folder: FolderItem) => {
            const qrResponse = await fetch(`/api/qrcodes?folderId=${folder.id}`)
            const qrData = await qrResponse.json()
            return {
              ...folder,
              count: qrData.success ? qrData.qrCodes.length : 0,
            }
          })
        )
        setFolders(foldersWithCount)
      } else {
        toast.error("Erreur", { description: "Impossible de charger les dossiers" })
      }
    } catch (error) {
      console.error("Erreur lors du chargement des dossiers:", error)
      toast.error("Erreur", { description: "Une erreur est survenue lors du chargement des dossiers" })
    } finally {
      setIsLoadingFolders(false)
    }
  }, [])

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch("/api/events/list")
      const data = await response.json()
      if (data.success) {
        setEvents(data.events)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error)
    }
  }, [])

  const fetchQRCodes = useCallback(async () => {
    setIsLoadingQrcodes(true)
    try {
      const params = new URLSearchParams()
      if (selectedFolder) {
        params.set("folderId", selectedFolder)
      }
      if (eventFilter) {
        params.set("eventId", eventFilter)
      }

      const response = await fetch(`/api/qrcodes?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        let filteredQRCodes = data.qrCodes

        // Filtre par type
        if (typeFilter) {
          filteredQRCodes = filteredQRCodes.filter((qr: QRCodeItem) => qr.type === typeFilter)
        }

        // Filtre par recherche
        if (debouncedSearch) {
          const searchLower = debouncedSearch.toLowerCase()
          filteredQRCodes = filteredQRCodes.filter((qr: QRCodeItem) => {
            const nameMatch = qr.name.toLowerCase().includes(searchLower)
            const eventMatch = qr.event?.name.toLowerCase().includes(searchLower)
            const guestMatch = qr.guest ? `${qr.guest.firstName} ${qr.guest.lastName}`.toLowerCase().includes(searchLower) : false
            const codeMatch = qr.code.toLowerCase().includes(searchLower)
            return nameMatch || eventMatch || guestMatch || codeMatch
          })
        }

        // Filtre par statut
        if (statusFilter && statusFilter !== "all") {
          filteredQRCodes = filteredQRCodes.filter((qr: QRCodeItem) => {
            if (statusFilter === "active") return true // Tous les QR codes sont actifs par défaut
            if (statusFilter === "scanned") return qr.scanned
            if (statusFilter === "unscanned") return !qr.scanned
            return true
          })
        }

        // Tri
        filteredQRCodes.sort((a: QRCodeItem, b: QRCodeItem) => {
          switch (sortBy) {
            case "recent":
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            case "oldest":
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            case "name":
              return a.name.localeCompare(b.name)
            case "scans":
              const aScans = (a as any).scanCount || 0
              const bScans = (b as any).scanCount || 0
              return bScans - aScans
            default:
              return 0
          }
        })

        // Limiter la quantité
        const limit = parseInt(quantity) || 10
        filteredQRCodes = filteredQRCodes.slice(0, limit)

        setQrcodes(filteredQRCodes)
      } else {
        toast.error("Erreur", { description: "Impossible de charger les QR codes" })
      }
    } catch (error) {
      console.error("Erreur lors du chargement des QR codes:", error)
      toast.error("Erreur", { description: "Une erreur est survenue lors du chargement des QR codes" })
    } finally {
      setIsLoadingQrcodes(false)
    }
  }, [selectedFolder, debouncedSearch, typeFilter, eventFilter, statusFilter, sortBy, quantity])

  // Charger les dossiers
  useEffect(() => {
    fetchFolders()
    fetchEvents()
  }, [fetchFolders, fetchEvents])

  // Charger les QR codes quand les filtres changent
  useEffect(() => {
    fetchQRCodes()
  }, [selectedFolder, debouncedSearch, typeFilter, eventFilter, statusFilter, sortBy, quantity, fetchQRCodes])

  // Rafraîchissement automatique en temps réel (toutes les 30 secondes)
  // Désactivé par défaut pour éviter les rafraîchissements intempestifs
  // Décommentez pour activer le rafraîchissement automatique
  /*
  useEffect(() => {
    // Ne rafraîchir que si on n'est pas en train de charger
    if (isLoadingQrcodes) return
    
    const interval = setInterval(() => {
      fetchQRCodes()
    }, 30000) // Rafraîchir toutes les 30 secondes

    return () => clearInterval(interval)
  }, [fetchQRCodes, isLoadingQrcodes])
  */

  // Rafraîchir les dossiers après création/modification
  useEffect(() => {
    if (!isCreateFolderOpen && !isCreateOpen) {
      fetchFolders()
      fetchQRCodes()
    }
  }, [isCreateFolderOpen, isCreateOpen, fetchFolders, fetchQRCodes])

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce dossier ? Les QR codes qu'il contient ne seront pas supprimés.")) {
      return
    }

    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error("Erreur", {
          description: data.error || "Impossible de supprimer le dossier",
        })
        return
      }

      toast.success("Dossier supprimé", {
        description: "Le dossier a été supprimé avec succès",
      })

      fetchFolders()
      if (selectedFolder === folderId) {
        setSelectedFolder(null)
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la suppression",
      })
    }
  }

  const handleDeleteQRCode = async (qrId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce QR code ?")) {
      return
    }

    try {
      const response = await fetch(`/api/qrcodes/${qrId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error("Erreur", {
          description: data.error || "Impossible de supprimer le QR code",
        })
        return
      }

      toast.success("QR Code supprimé", {
        description: "Le QR code a été supprimé avec succès",
      })

      fetchQRCodes()
      fetchFolders() // Mettre à jour les compteurs
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la suppression",
      })
    }
  }

  const handleDeleteMultipleQRCodes = async () => {
    if (selectedQRCodes.size === 0) {
      return
    }

    const count = selectedQRCodes.size
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${count} QR code(s) ? Cette action est irréversible.`)) {
      return
    }

    try {
      const ids = Array.from(selectedQRCodes).join(',')
      const response = await fetch(`/api/qrcodes?ids=${ids}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        toast.error("Erreur", {
          description: data.error || "Impossible de supprimer les QR codes",
        })
        return
      }

      toast.success("QR Codes supprimés", {
        description: `${data.deletedCount || count} QR code(s) supprimé(s) avec succès`,
      })

      // Réinitialiser la sélection et recharger les QR codes
      setSelectedQRCodes(new Set())
      fetchQRCodes()
      fetchFolders() // Mettre à jour les compteurs
    } catch (error) {
      console.error("Erreur lors de la suppression multiple:", error)
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la suppression",
      })
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "GUEST":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      case "EVENT":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "CUSTOM":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "URL":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "PDF":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "IMAGE":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      case "VIDEO":
        return "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
      case "TEXT":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "GUEST_CARD":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      case "WHATSAPP":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      case "SOCIAL":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
      case "MENU":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      case "WIFI":
        return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400"
      case "PROGRAM":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
      case "VCARD":
        return "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
      case "COUPON":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "PLAYLIST":
        return "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
      case "GALLERY":
        return "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400"
      case "FEEDBACK":
        return "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400"
      case "LIVE_STREAM":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "GUEST":
        return "Invité"
      case "EVENT":
        return "Événement"
      case "CUSTOM":
        return "Personnalisé"
      case "URL":
        return "URL"
      case "PDF":
        return "PDF"
      case "IMAGE":
        return "Images"
      case "VIDEO":
        return "Vidéo"
      case "TEXT":
        return "Texte"
      case "GUEST_CARD":
        return "Carte d'invité"
      case "WHATSAPP":
        return "WhatsApp"
      case "SOCIAL":
        return "Réseaux sociaux"
      case "MENU":
        return "Menu"
      case "WIFI":
        return "Wi-Fi"
      case "PROGRAM":
        return "Programme"
      case "VCARD":
        return "vCard"
      case "COUPON":
        return "Coupon"
      case "PLAYLIST":
        return "Playlist"
      case "GALLERY":
        return "Galerie"
      case "FEEDBACK":
        return "Feedback"
      case "LIVE_STREAM":
        return "Live Stream"
      default:
        return type
    }
  }

  const getFolderColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string; icon: string }> = {
      purple: {
        bg: "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40",
        text: "text-purple-700 dark:text-purple-300",
        border: "border-purple-300 dark:border-purple-700",
        icon: "text-purple-600 dark:text-purple-400",
      },
      blue: {
        bg: "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-300 dark:border-blue-700",
        icon: "text-blue-600 dark:text-blue-400",
      },
      green: {
        bg: "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40",
        text: "text-green-700 dark:text-green-300",
        border: "border-green-300 dark:border-green-700",
        icon: "text-green-600 dark:text-green-400",
      },
      orange: {
        bg: "bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40",
        text: "text-orange-700 dark:text-orange-300",
        border: "border-orange-300 dark:border-orange-700",
        icon: "text-orange-600 dark:text-orange-400",
      },
      red: {
        bg: "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40",
        text: "text-red-700 dark:text-red-300",
        border: "border-red-300 dark:border-red-700",
        icon: "text-red-600 dark:text-red-400",
      },
      pink: {
        bg: "bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/40 dark:to-pink-800/40",
        text: "text-pink-700 dark:text-pink-300",
        border: "border-pink-300 dark:border-pink-700",
        icon: "text-pink-600 dark:text-pink-400",
      },
    }
    return colorMap[color] || colorMap.purple
  }

  const resetFilters = () => {
    setSearchQuery("")
    setTypeFilter("")
    setEventFilter("")
    setSelectedFolder(null)
  }

  const hasActiveFilters = searchQuery || typeFilter || eventFilter || selectedFolder

  // Compter les QR codes totaux
  const totalQRCodes = qrcodes.length

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* En-tête */}
      <div className="space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Mes codes QR</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsCreateFolderOpen(true)} 
            className="gap-2 border-2 border-gray-300 dark:border-gray-600 hover:border-primary/50 rounded-xl h-11 w-full sm:w-auto bg-white dark:bg-gray-900"
          >
            <FolderPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Nouveau dossier</span>
            <span className="sm:hidden">Dossier</span>
          </Button>
          <Button 
            onClick={() => setIsGeneratorOpen(true)} 
            className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg rounded-xl h-11 w-full sm:w-auto"
          >
            <QrCode className="h-4 w-4" />
            <span className="hidden sm:inline">Générer un QR Code</span>
            <span className="sm:hidden">Nouveau QR</span>
          </Button>
        </div>
      </div>

      {/* Section Dossiers */}
      <div>
        <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Folder className="h-5 w-5 text-primary" />
          Mes dossiers
        </h2>
        {isLoadingFolders ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonFolderCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* Tous les QR codes */}
            <Card
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 rounded-2xl ${
                !selectedFolder 
                  ? 'ring-2 ring-primary shadow-lg shadow-primary/20 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary/30 bg-white dark:bg-gray-900'
              }`}
              onClick={() => setSelectedFolder(null)}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                  <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-md ${
                    !selectedFolder ? 'ring-2 ring-primary/30' : ''
                  }`}>
                    <QrCode className={`h-6 w-6 sm:h-7 sm:w-7 ${!selectedFolder ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`} />
                  </div>
                  <div className="w-full px-1">
                    <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white break-words">Tous</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{totalQRCodes} QR code{totalQRCodes > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dossiers */}
            {folders.map((folder) => {
              const colors = getFolderColorClasses(folder.color)
              const isSelected = selectedFolder === folder.id
              
              return (
                <Card
                  key={folder.id}
                  className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 relative overflow-hidden rounded-2xl ${
                    isSelected
                      ? `ring-2 ring-primary shadow-lg shadow-primary/20 border-primary/30 ${colors.bg}`
                      : `border-gray-200 dark:border-gray-700 hover:border-primary/30 bg-white dark:bg-gray-900`
                  }`}
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  {/* Effet de brillance au survol */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full" />
                  
                  <CardContent className="p-4 sm:p-5 relative z-10">
                    <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                      <div className={`p-3 sm:p-4 rounded-xl ${colors.bg} border-2 ${colors.border} shadow-md group-hover:scale-110 transition-transform duration-300 relative`}>
                        <div className={`absolute inset-0 ${colors.bg} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                        <Folder className={`h-6 w-6 sm:h-7 sm:w-7 ${colors.icon} relative z-10 drop-shadow-sm`} />
                      </div>
                      <div className="w-full px-1 min-w-0">
                        <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white break-words line-clamp-2">
                          {folder.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {folder.count} QR code{folder.count > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    
                    {/* Menu d'actions au survol */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Renommer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteFolder(folder.id)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Fil d'Ariane */}
      {selectedFolder && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 px-1">
          <button 
            onClick={() => setSelectedFolder(null)} 
            className="hover:text-primary transition-colors font-medium"
          >
            Tous les QR codes
          </button>
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
          <span className="font-semibold text-gray-900 dark:text-white truncate">
            {folders.find(f => f.id === selectedFolder)?.name}
          </span>
        </div>
      )}

      {/* Barre de recherche et filtres - Style inspiré de QRgenerator.ai */}
      <div className="space-y-3">
        {/* Barre de recherche principale - Style mobile uniquement */}
        <div className="relative md:hidden">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 z-10" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-16 h-12 border border-gray-200 dark:border-gray-700 rounded-2xl text-base bg-gray-50 dark:bg-gray-800 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-gray-900 transition-all"
          />
          {/* Bouton filtre circulaire violet à droite - Mobile uniquement */}
          <Button
            variant="default"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-white shadow-md"
            onClick={() => {
              // Toggle pour afficher/masquer les filtres avancés
              const filtersCard = document.getElementById('advanced-filters')
              if (filtersCard) {
                filtersCard.classList.toggle('hidden')
              }
            }}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Barre de recherche desktop - Style original */}
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-14 h-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-base bg-white dark:bg-gray-900 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
          {/* Bouton filtre circulaire à droite - Desktop */}
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-primary/50 bg-white dark:bg-gray-900"
            onClick={() => {
              // Toggle pour afficher/masquer les filtres avancés
              const filtersCard = document.getElementById('advanced-filters')
              if (filtersCard) {
                filtersCard.classList.toggle('hidden')
              }
            }}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Filtres avancés (masqués par défaut sur mobile, affichables via le bouton filtre) */}
        <Card 
          id="advanced-filters"
          className="hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl shadow-sm md:block"
        >
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3 items-center">
              {/* Statut du code QR */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[160px] border border-gray-300 dark:border-gray-600 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="scanned">Scanné</SelectItem>
                  <SelectItem value="unscanned">Non scanné</SelectItem>
                </SelectContent>
              </Select>

              {/* Types de codes QR */}
              <Select value={typeFilter || "all"} onValueChange={(value) => setTypeFilter(value === "all" ? "" : value)}>
                <SelectTrigger className="w-full sm:w-[180px] border border-gray-300 dark:border-gray-600 rounded-lg">
                  <SelectValue placeholder="Types de codes QR" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="EVENT">Événement</SelectItem>
                  <SelectItem value="GUEST">Invité</SelectItem>
                  <SelectItem value="CUSTOM">Personnalisé</SelectItem>
                  <SelectItem value="URL">URL</SelectItem>
                  <SelectItem value="MENU">Menu</SelectItem>
                  <SelectItem value="WIFI">Wi-Fi</SelectItem>
                  <SelectItem value="PROGRAM">Programme</SelectItem>
                  <SelectItem value="VCARD">vCard</SelectItem>
                  <SelectItem value="COUPON">Coupon</SelectItem>
                  <SelectItem value="PLAYLIST">Playlist</SelectItem>
                  <SelectItem value="GALLERY">Galerie</SelectItem>
                  <SelectItem value="FEEDBACK">Feedback</SelectItem>
                  <SelectItem value="LIVE_STREAM">Live Stream</SelectItem>
                </SelectContent>
              </Select>

              {/* Trier par */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[160px] border border-gray-300 dark:border-gray-600 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Le plus récent</SelectItem>
                  <SelectItem value="oldest">Le plus ancien</SelectItem>
                  <SelectItem value="name">Nom (A-Z)</SelectItem>
                  <SelectItem value="scans">Plus de scans</SelectItem>
                </SelectContent>
              </Select>

              {/* Quantité */}
              <Select value={quantity} onValueChange={setQuantity}>
                <SelectTrigger className="w-full sm:w-[100px] border border-gray-300 dark:border-gray-600 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checkbox Tout sélectionner et Suppression multiple */}
      {qrcodes.length > 0 && (
        <div className="flex items-center justify-between gap-3 py-3 px-1">
          <button
            onClick={() => {
              if (selectedQRCodes.size === qrcodes.length) {
                setSelectedQRCodes(new Set())
              } else {
                setSelectedQRCodes(new Set(qrcodes.map(qr => qr.id)))
              }
            }}
            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
          >
            {selectedQRCodes.size === qrcodes.length ? (
              <CheckSquare className="h-5 w-5 text-primary" />
            ) : (
              <Square className="h-5 w-5 text-gray-400" />
            )}
            <span className="font-medium">Tout sélectionner</span>
          </button>
          
          {selectedQRCodes.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteMultipleQRCodes}
              className="h-9 px-4 rounded-lg"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer ({selectedQRCodes.size})
            </Button>
          )}
        </div>
      )}

      {/* Grille des QR codes */}
      {isLoadingQrcodes ? (
        <div className="space-y-3 md:space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : qrcodes.length === 0 ? (
        <Card className="border-2 border-dashed rounded-2xl">
          <CardContent className="p-8 md:p-12 text-center">
            <QrCode className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Aucun QR code trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {hasActiveFilters
                ? "Essayez de modifier vos filtres de recherche"
                : "Commencez par générer votre premier QR code"}
            </p>
            {!hasActiveFilters && (
              <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Générer un QR Code
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {qrcodes.map((qr) => {
            const qrData = qr as any
            // Utiliser scanCount si disponible, sinon utiliser scanned (1 ou 0)
            const scanCount = qrData.scanCount !== undefined ? qrData.scanCount : (qr.scanned ? 1 : 0)
            const url = qrData.url || ""
            const updatedAt = qrData.updatedAt || qr.createdAt
            
            return (
              <Card 
                key={qr.id} 
                className="group hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm"
              >
                <CardContent className="p-4 md:p-5">
                  {/* Layout mobile-first : vertical sur mobile, horizontal sur desktop */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Section gauche : Checkbox + Miniature */}
                    <div className="flex items-start gap-3 md:gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => {
                          const newSelected = new Set(selectedQRCodes)
                          if (newSelected.has(qr.id)) {
                            newSelected.delete(qr.id)
                          } else {
                            newSelected.add(qr.id)
                          }
                          setSelectedQRCodes(newSelected)
                        }}
                        className="mt-1 flex-shrink-0"
                      >
                        {selectedQRCodes.has(qr.id) ? (
                          <CheckSquare className="h-5 w-5 text-primary" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400" />
                        )}
                      </button>

                      {/* Miniature QR Code */}
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                        {qr.imageUrl ? (
                          <img
                            src={qr.imageUrl}
                            alt={qr.name}
                            className="w-full h-full object-contain p-1.5 rounded-lg"
                          />
                        ) : (
                          <QrCode className="h-10 w-10 md:h-12 md:w-12 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Section centrale : Informations principales */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Titre et Type + Dossier sur la même ligne */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white">
                          {qr.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`${getTypeColor(qr.type)} text-xs px-2.5 py-0.5 rounded-full`}>
                            {getTypeLabel(qr.type)}
                          </Badge>
                          {qr.type === "URL" && (
                            <Badge variant="outline" className="text-xs px-2 py-0.5 rounded-full border-blue-300 text-blue-700 dark:text-blue-400">
                              QR statique
                            </Badge>
                          )}
                          {qr.folder && qr.folder.id && qr.folder.name ? (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                              <Folder className="h-3.5 w-3.5" />
                              <span className="truncate">{qr.folder.name}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-sm text-gray-400">
                              <Folder className="h-3.5 w-3.5" />
                              <span>Aucun dossier</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Métadonnées */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Modifié : {new Date(updatedAt).toLocaleDateString("fr-FR", { month: "long", day: "numeric", year: "numeric" })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Section droite : Actions en haut à droite */}
                    <div className="flex items-start justify-end gap-2 md:gap-3 flex-shrink-0 md:items-center">
                      {/* Bouton Télécharger */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-primary/30 text-primary hover:bg-primary hover:text-white h-9 px-3 md:px-4 rounded-lg transition-all"
                        onClick={async () => {
                          try {
                            const response = await fetch(`/api/qrcodes/${qr.id}/download`)
                            if (!response.ok) {
                              toast.error("Erreur", { description: "Impossible de télécharger le QR code" })
                              return
                            }
                            if (response.redirected) {
                              window.open(response.url, '_blank')
                            } else {
                              const blob = await response.blob()
                              const url = window.URL.createObjectURL(blob)
                              const a = document.createElement('a')
                              a.href = url
                              a.download = `${qr.name || 'qrcode'}.png`
                              document.body.appendChild(a)
                              a.click()
                              window.URL.revokeObjectURL(url)
                              document.body.removeChild(a)
                            }
                            toast.success("Téléchargement", { description: "Le QR code a été téléchargé" })
                          } catch (error) {
                            toast.error("Erreur", { description: "Une erreur est survenue" })
                          }
                        }}
                      >
                        <Download className="h-4 w-4 mr-1.5" />
                        <span className="hidden sm:inline">Télécharger</span>
                      </Button>
                      
                      {/* Menu Plus d'options */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-9 w-9 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-primary/50"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => {
                              setPreviewQRCodeId(qr.id)
                              setIsPreviewOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Palette className="h-4 w-4 mr-2" />
                            Personnaliser
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteQRCode(qr.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Drawers */}
      <CreateQRCodeDrawer 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen}
      />
      <CreateFolderDrawer 
        open={isCreateFolderOpen} 
        onOpenChange={setIsCreateFolderOpen}
        onFolderCreated={() => {
          fetchFolders()
        }}
      />
      <QRPreviewDrawer
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        qrCodeId={previewQRCodeId}
      />
      <QRGeneratorDrawer
        open={isGeneratorOpen}
        onOpenChange={setIsGeneratorOpen}
        onQRCodeCreated={() => {
          fetchQRCodes()
          setIsGeneratorOpen(false)
        }}
      />
    </div>
  )
}
