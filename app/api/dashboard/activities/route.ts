import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const activities: any[] = []

    // Récupérer les scans récents (QR codes scannés)
    const recentScans = await db.qrCode.findMany({
      where: {
        userId,
        scanned: true,
        scannedAt: { not: null }
      },
      include: {
        event: {
          select: {
            name: true
          }
        },
        guest: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        scannedAt: 'desc'
      },
      take: 5
    })

    // Ajouter les scans aux activités
    recentScans.forEach(scan => {
      if (scan.scannedAt) {
        const timeAgo = getTimeAgo(scan.scannedAt)
        activities.push({
          id: `scan-${scan.id}`,
          action: "QR Code scanné",
          event: scan.event?.name || "Événement",
          user: scan.guest ? `${scan.guest.firstName} ${scan.guest.lastName}` : "Invité",
          time: timeAgo,
          type: "scan",
          timestamp: scan.scannedAt
        })
      }
    })

    // Récupérer les confirmations récentes
    const recentConfirmations = await db.guest.findMany({
      where: {
        userId,
        status: 'CONFIRMED',
        confirmedAt: { not: null }
      },
      include: {
        event: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        confirmedAt: 'desc'
      },
      take: 5
    })

    // Ajouter les confirmations aux activités
    recentConfirmations.forEach(guest => {
      if (guest.confirmedAt) {
        const timeAgo = getTimeAgo(guest.confirmedAt)
        activities.push({
          id: `confirmation-${guest.id}`,
          action: "Invitation confirmée",
          event: guest.event?.name || "Événement",
          user: `${guest.firstName} ${guest.lastName}`,
          time: timeAgo,
          type: "confirmation",
          timestamp: guest.confirmedAt
        })
      }
    })

    // Récupérer les nouveaux invités ajoutés récemment
    const recentGuests = await db.guest.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Derniers 7 jours
        }
      },
      include: {
        event: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })

    // Ajouter les nouveaux invités aux activités
    recentGuests.forEach(guest => {
      const timeAgo = getTimeAgo(guest.createdAt)
      activities.push({
        id: `guest-${guest.id}`,
        action: "Nouvel invité ajouté",
        event: guest.event?.name || "Événement",
        user: `${guest.firstName} ${guest.lastName}`,
        time: timeAgo,
        type: "guest",
        timestamp: guest.createdAt
      })
    })

    // Trier toutes les activités par timestamp (plus récentes en premier)
    activities.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      return dateB - dateA
    })

    // Limiter à 10 activités
    const limitedActivities = activities.slice(0, 10)

    return NextResponse.json({
      success: true,
      activities: limitedActivities
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la récupération des activités:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}

// Fonction utilitaire pour calculer le temps écoulé
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "À l'instant"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`
  } else {
    const weeks = Math.floor(diffInSeconds / 604800)
    return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`
  }
}

