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

    // Récupérer les événements à venir (limite 5)
    const upcomingEvents = await db.event.findMany({
      where: {
        userId,
        date: { gte: now },
        status: { in: ['UPCOMING', 'ONGOING'] }
      },
      include: {
        _count: {
          select: {
            guests: true
          }
        },
        guests: {
          select: {
            status: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      },
      take: 5
    })

    // Formater les événements avec les statistiques
    const formattedEvents = upcomingEvents.map(event => {
      const totalGuests = event._count.guests
      const confirmedGuests = event.guests.filter(g => g.status === 'CONFIRMED').length
      const progress = totalGuests > 0 ? Math.round((confirmedGuests / totalGuests) * 100) : 0
      
      // Formater la date
      const eventDate = new Date(event.date)
      const dateStr = eventDate.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
      const timeStr = eventDate.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })

      // Déterminer le statut
      let statusText = "Planifié"
      if (event.status === 'ONGOING') {
        statusText = "En cours"
      } else if (event.date <= new Date(Date.now() + 24 * 60 * 60 * 1000)) {
        statusText = "Bientôt"
      }

      return {
        id: event.id,
        name: event.name,
        date: dateStr,
        time: timeStr,
        location: event.location || "Non spécifié",
        guests: totalGuests,
        confirmed: confirmedGuests,
        status: statusText,
        progress
      }
    })

    return NextResponse.json({
      success: true,
      events: formattedEvents
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}

