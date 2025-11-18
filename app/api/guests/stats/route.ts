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

    // Requêtes optimisées en parallèle
    const [
      totalGuests,
      confirmedGuests,
      pendingGuests,
      cancelledGuests,
      attendedGuests,
    ] = await Promise.all([
      db.guest.count({ where: { userId } }),
      db.guest.count({ where: { userId, status: 'CONFIRMED' } }),
      db.guest.count({ where: { userId, status: 'PENDING' } }),
      db.guest.count({ where: { userId, status: 'CANCELLED' } }),
      db.guest.count({ where: { userId, status: 'ATTENDED' } }),
    ])

    return NextResponse.json({
      success: true,
      stats: {
        total: totalGuests,
        confirmed: confirmedGuests,
        pending: pendingGuests,
        cancelled: cancelledGuests,
        attended: attendedGuests,
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

