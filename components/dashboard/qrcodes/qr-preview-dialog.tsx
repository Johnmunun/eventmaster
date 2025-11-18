/**
 * Drawer de prévisualisation d'un QR code
 * Affiche le QR code en grand avec toutes les informations
 */
"use client"

import { useState, useEffect } from "react"
import { X, Download, ExternalLink, Loader2, Calendar, Folder, User, QrCode as QrCodeIcon, Sparkles } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface QRPreviewDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  qrCodeId: string | null
}

interface QRCodePreview {
  id: string
  code: string
  name: string
  type: string
  url: string
  imageUrl: string
  color: string
  backgroundColor: string
  scanned: boolean
  scannedAt: string | null
  createdAt: string
  event: {
    id: string
    name: string
    date: string
    location: string | null
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
    email: string | null
  } | null
}

export function QRPreviewDrawer({ open, onOpenChange, qrCodeId }: QRPreviewDrawerProps) {
  const [qrCode, setQrCode] = useState<QRCodePreview | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    if (open && qrCodeId) {
      fetchQRCode()
    } else {
      setQrCode(null)
    }
  }, [open, qrCodeId])

  const fetchQRCode = async () => {
    if (!qrCodeId) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/qrcodes/${qrCodeId}/preview`)
      const data = await response.json()

      if (data.success) {
        setQrCode(data.qrCode)
      } else {
        toast.error("Erreur", {
          description: data.error || "Impossible de charger le QR code",
        })
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error)
      toast.error("Erreur", {
        description: "Une erreur est survenue lors du chargement",
      })
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!qrCodeId) return

    setIsDownloading(true)
    try {
      const response = await fetch(`/api/qrcodes/${qrCodeId}/download`)
      
      if (!response.ok) {
        const data = await response.json()
        toast.error("Erreur", {
          description: data.error || "Impossible de télécharger le QR code",
        })
        return
      }

      // Si c'est une redirection, ouvrir dans un nouvel onglet
      if (response.redirected) {
        window.open(response.url, '_blank')
        toast.success("Téléchargement", {
          description: "Le téléchargement a commencé",
        })
      } else {
        // Si c'est un fichier, le télécharger
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${qrCode?.name || 'qrcode'}.png`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast.success("Téléchargement", {
          description: "Le QR code a été téléchargé avec succès",
        })
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error)
      toast.error("Erreur", {
        description: "Une erreur est survenue lors du téléchargement",
      })
    } finally {
      setIsDownloading(false)
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
      default:
        return type
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
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[600px] p-0 flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 [&>button]:hidden overflow-hidden"
      >
        {/* En-tête avec gradient */}
        <div className="relative flex-shrink-0 px-6 py-5 bg-gradient-to-r from-primary/5 via-primary/3 to-accent/5 border-b border-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-accent/20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg">
                  <QrCodeIcon className="h-5 w-5 text-white" />
                </div>
                <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Prévisualisation
                </SheetTitle>
              </div>
              <SheetDescription className="text-sm text-gray-600 dark:text-gray-400 ml-12">
                Visualisez et téléchargez votre QR code
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-9 w-9 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6">

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="w-full aspect-square rounded-lg" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : qrCode ? (
            <div className="space-y-6">
              {/* Image du QR code */}
              <div className="relative">
                <div className="aspect-square bg-white dark:bg-gray-800 rounded-xl border-2 border-primary/10 p-8 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                  {qrCode.imageUrl ? (
                    <img
                      src={qrCode.imageUrl}
                      alt={qrCode.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <QrCodeIcon className="h-48 w-48 text-gray-300 dark:text-gray-600" />
                  )}
                </div>
              </div>

              {/* Informations */}
              <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 border-2 border-primary/10 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Informations
                  </h3>
                </div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {qrCode.name}
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={getTypeColor(qrCode.type)}>
                      {getTypeLabel(qrCode.type)}
                    </Badge>
                    {qrCode.scanned && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Scanné
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {qrCode.event && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Événement</p>
                      <p className="text-sm text-gray-900 dark:text-white">{qrCode.event.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(qrCode.event.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {qrCode.folder && (
                  <div className="flex items-start gap-2">
                    <Folder className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Dossier</p>
                      <p className="text-sm text-gray-900 dark:text-white">{qrCode.folder.name}</p>
                    </div>
                  </div>
                )}

                {qrCode.guest && (
                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Invité</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {qrCode.guest.firstName} {qrCode.guest.lastName}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <QrCodeIcon className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Code</p>
                    <p className="text-sm text-gray-900 dark:text-white font-mono">{qrCode.code}</p>
                  </div>
                </div>
              </div>

              {qrCode.url && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">URL encodée</p>
                  <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-mono flex-1 truncate">
                      {qrCode.url}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => window.open(qrCode.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Aucun QR code à afficher</p>
            </div>
          )}
        </div>

        {/* Footer avec actions */}
        {qrCode && (
          <div className="relative flex-shrink-0 border-t border-primary/10 px-6 py-5 bg-gradient-to-r from-white via-primary/5 to-accent/5 dark:from-gray-900 dark:via-primary/10 dark:to-accent/10 backdrop-blur-sm">
            <div className="flex gap-3 relative z-10">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 gap-2 h-11 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Téléchargement...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Télécharger
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-11 border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                Fermer
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

