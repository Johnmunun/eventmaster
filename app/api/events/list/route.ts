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

    // Récupérer tous les événements de l'utilisateur (pour les selects)
    const events = await db.event.findMany({
      where: {
        userId,
        status: { in: ['UPCOMING', 'ONGOING'] } // Seulement les événements à venir ou en cours
      },
      select: {
        id: true,
        name: true,
        date: true,
        status: true,
      },
      orderBy: {
        date: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      events
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}

