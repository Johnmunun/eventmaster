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
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    // Requêtes optimisées en parallèle avec select spécifiques
    const [
      totalEvents,
      ongoingEvents,
      totalQrCodes,
      totalGuests,
      confirmedGuests,
      attendedGuests,
      totalScans,
      eventsThisMonth,
      qrCodesThisWeek,
      guestsThisMonth,
      invitationsSent,
    ] = await Promise.all([
      // Total événements créés
      db.event.count({
        where: { userId }
      }),
      
      // Événements en cours (UPCOMING ou ONGOING)
      db.event.count({
        where: {
          userId,
          status: { in: ['UPCOMING', 'ONGOING'] }
        }
      }),
      
      // Total QR codes générés
      db.qrCode.count({
        where: { userId }
      }),
      
      // Total invités
      db.guest.count({
        where: { userId }
      }),
      
      // Invités confirmés
      db.guest.count({
        where: {
          userId,
          status: 'CONFIRMED'
        }
      }),
      
      // Invités présents
      db.guest.count({
        where: {
          userId,
          status: 'ATTENDED'
        }
      }),
      
      // Total scans (QR codes scannés)
      db.qrCode.count({
        where: {
          userId,
          scanned: true
        }
      }),
      
      // Événements créés ce mois
      db.event.count({
        where: {
          userId,
          createdAt: { gte: startOfMonth }
        }
      }),
      
      // QR codes générés cette semaine
      db.qrCode.count({
        where: {
          userId,
          createdAt: { gte: startOfWeek }
        }
      }),
      
      // Invités ajoutés ce mois
      db.guest.count({
        where: {
          userId,
          createdAt: { gte: startOfMonth }
        }
      }),
      
      // Invitations envoyées (guests avec email)
      db.guest.count({
        where: {
          userId,
          email: { not: null }
        }
      }),
    ])

    // Calculer les taux
    const confirmationRate = totalGuests > 0 
      ? ((confirmedGuests / totalGuests) * 100).toFixed(1)
      : "0.0"
    
    const attendanceRate = totalGuests > 0
      ? ((attendedGuests / totalGuests) * 100).toFixed(1)
      : "0.0"

    // Calculer les changements (simplifié - on pourrait comparer avec le mois précédent)
    const eventsChange = eventsThisMonth > 0 ? `+${eventsThisMonth} ce mois` : "Aucun ce mois"
    const qrCodesChange = qrCodesThisWeek > 0 ? `+${qrCodesThisWeek} cette semaine` : "Aucun cette semaine"
    const guestsChange = guestsThisMonth > 0 ? `+${guestsThisMonth} ce mois` : "Aucun ce mois"

    return NextResponse.json({
      success: true,
      stats: {
        totalEvents,
        ongoingEvents,
        totalQrCodes,
        totalGuests,
        confirmedGuests,
        attendedGuests,
        totalScans,
        confirmationRate: `${confirmationRate}%`,
        attendanceRate: `${attendanceRate}%`,
        invitationsSent,
        // Changements
        eventsChange,
        qrCodesChange,
        guestsChange,
        // Pour les calculs de tendances
        eventsThisMonth,
        qrCodesThisWeek,
        guestsThisMonth,
      }
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}

