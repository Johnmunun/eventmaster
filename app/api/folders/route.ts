import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { Prisma } from "@prisma/client"

const createFolderSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(50, "Le nom est trop long"),
  color: z.string().min(1, "La couleur est requise"),
})

// POST - Créer un dossier
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Parser le body
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: "Format de requête invalide" },
        { status: 400 }
      )
    }

    // Validation
    const validatedData = createFolderSchema.parse(body)

    // Créer le dossier
    const folder = await db.folder.create({
      data: {
        name: validatedData.name.trim(),
        color: validatedData.color,
        userId: userId,
      },
      include: {
        _count: {
          select: {
            qrCodes: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "Dossier créé avec succès",
      folder: {
        id: folder.id,
        name: folder.name,
        color: folder.color,
        count: folder._count.qrCodes,
        createdAt: folder.createdAt.toISOString(),
      }
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.errors[0].message,
          details: error.errors 
        },
        { status: 400 }
      )
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P1001') {
        return NextResponse.json(
          { success: false, error: "Impossible de se connecter à la base de données" },
          { status: 503 }
        )
      }
    }

    console.error("Erreur lors de la création du dossier:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de la création du dossier" },
      { status: 500 }
    )
  }
}

// GET - Récupérer les dossiers de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    const folders = await db.folder.findMany({
      where: {
        userId,
      },
      include: {
        _count: {
          select: {
            qrCodes: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedFolders = folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      color: folder.color,
      count: folder._count.qrCodes,
      createdAt: folder.createdAt.toISOString(),
    }))

    return NextResponse.json({
      success: true,
      folders: formattedFolders
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la récupération des dossiers:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}



