import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { Prisma } from "@prisma/client"

const updateFolderSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(50, "Le nom est trop long").optional(),
  color: z.string().min(1, "La couleur est requise").optional(),
})

// PATCH - Modifier un dossier
export async function PATCH(
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

    const userId = session.user.id
    const resolvedParams = await params
    const folderId = resolvedParams.id

    // Vérifier que le dossier existe et appartient à l'utilisateur
    const existingFolder = await db.folder.findFirst({
      where: {
        id: folderId,
        userId: userId,
      }
    })

    if (!existingFolder) {
      return NextResponse.json(
        { success: false, error: "Dossier non trouvé ou non autorisé" },
        { status: 404 }
      )
    }

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
    const validatedData = updateFolderSchema.parse(body)

    // Préparer les données de mise à jour
    const updateData: any = {}
    
    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name.trim()
    }
    if (validatedData.color !== undefined) {
      updateData.color = validatedData.color
    }

    // Mettre à jour le dossier
    const updatedFolder = await db.folder.update({
      where: { id: folderId },
      data: updateData,
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
      message: "Dossier modifié avec succès",
      folder: {
        id: updatedFolder.id,
        name: updatedFolder.name,
        color: updatedFolder.color,
        count: updatedFolder._count.qrCodes,
      }
    }, { status: 200 })

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

    console.error("Erreur lors de la modification du dossier:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de la modification du dossier" },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un dossier
export async function DELETE(
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

    const userId = session.user.id
    const resolvedParams = await params
    const folderId = resolvedParams.id

    // Vérifier que le dossier existe et appartient à l'utilisateur
    const existingFolder = await db.folder.findFirst({
      where: {
        id: folderId,
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

    if (!existingFolder) {
      return NextResponse.json(
        { success: false, error: "Dossier non trouvé ou non autorisé" },
        { status: 404 }
      )
    }

    // Supprimer le dossier (les QR codes seront déplacés vers null grâce à onDelete: SetNull)
    await db.folder.delete({
      where: { id: folderId }
    })

    return NextResponse.json({
      success: true,
      message: "Dossier supprimé avec succès"
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la suppression du dossier:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de la suppression du dossier" },
      { status: 500 }
    )
  }
}


