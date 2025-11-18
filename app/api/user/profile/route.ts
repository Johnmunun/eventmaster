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

    // Récupérer uniquement les champs nécessaires
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        credits: true,
        role: true,
        plan: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Utilisateur non trouvé" },
        { status: 404 }
      )
    }

    // Générer les initiales pour l'avatar
    const initials = user.name
      ? user.name
          .split(" ")
          .map(n => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : user.email[0].toUpperCase()

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        initials,
      }
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}

