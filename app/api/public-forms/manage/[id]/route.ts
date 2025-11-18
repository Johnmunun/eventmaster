import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { Prisma } from "@prisma/client"

const updateFormSchema = z.object({
  isActive: z.boolean().optional(),
  title: z.string().max(200, "Le titre est trop long").optional(),
  description: z.string().max(1000, "La description est trop longue").optional(),
})

// PATCH - Mettre à jour un formulaire public (activer/désactiver, modifier)
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
    const formId = resolvedParams.id

    // Vérifier que le formulaire existe et appartient à l'utilisateur
    const existingForm = await db.publicForm.findFirst({
      where: {
        id: formId,
        userId: userId,
      }
    })

    if (!existingForm) {
      return NextResponse.json(
        { success: false, error: "Formulaire non trouvé ou non autorisé" },
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
    const validatedData = updateFormSchema.parse(body)

    // Préparer les données de mise à jour
    const updateData: any = {}
    
    if (validatedData.isActive !== undefined) {
      updateData.isActive = validatedData.isActive
    }
    if (validatedData.title !== undefined) {
      updateData.title = validatedData.title.trim() || null
    }
    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description.trim() || null
    }

    // Mettre à jour le formulaire
    const updatedForm = await db.publicForm.update({
      where: { id: formId },
      data: updateData,
      include: {
        event: {
          select: {
            id: true,
            name: true,
            date: true,
          }
        }
      }
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
    const publicUrl = `${baseUrl}/form/${updatedForm.token}`

    return NextResponse.json({
      success: true,
      message: "Formulaire mis à jour avec succès",
      form: {
        id: updatedForm.id,
        token: updatedForm.token,
        publicUrl,
        title: updatedForm.title,
        description: updatedForm.description,
        isActive: updatedForm.isActive,
        maxSubmissions: updatedForm.maxSubmissions,
        currentSubmissions: updatedForm.currentSubmissions,
        expiresAt: updatedForm.expiresAt?.toISOString() || null,
        event: updatedForm.event,
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

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P1001') {
        return NextResponse.json(
          { success: false, error: "Impossible de se connecter à la base de données" },
          { status: 503 }
        )
      }
    }

    console.error("Erreur lors de la mise à jour du formulaire:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de la mise à jour du formulaire" },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un formulaire public
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
    const formId = resolvedParams.id

    // Vérifier que le formulaire existe et appartient à l'utilisateur
    const existingForm = await db.publicForm.findFirst({
      where: {
        id: formId,
        userId: userId,
      }
    })

    if (!existingForm) {
      return NextResponse.json(
        { success: false, error: "Formulaire non trouvé ou non autorisé" },
        { status: 404 }
      )
    }

    // Supprimer le formulaire (cascade supprimera aussi les soumissions)
    await db.publicForm.delete({
      where: { id: formId }
    })

    return NextResponse.json({
      success: true,
      message: "Formulaire supprimé avec succès"
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la suppression du formulaire:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de la suppression du formulaire" },
      { status: 500 }
    )
  }
}



