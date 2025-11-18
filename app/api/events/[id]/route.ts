import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      )
    }

    const { id } = await params
    const userId = session.user.id

    const event = await db.event.findFirst({
      where: {
        id,
        userId, // S'assurer que l'événement appartient à l'utilisateur
      },
    })

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Événement non trouvé" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      event
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}


