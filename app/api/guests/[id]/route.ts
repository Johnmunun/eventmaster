import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { Prisma } from "@prisma/client"

const updateGuestSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis").max(50, "Le prénom est trop long").optional(),
  lastName: z.string().min(1, "Le nom est requis").max(50, "Le nom est trop long").optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().max(20, "Le numéro de téléphone est trop long").optional().or(z.literal("")),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "ATTENDED"]).optional(),
})

// GET - Récupérer un invité spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const guestId = params.id

    const guest = await db.guest.findFirst({
      where: {
        id: guestId,
        userId: userId,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            date: true,
          }
        },
        qrCode: {
          select: {
            id: true,
            scanned: true,
            scannedAt: true,
          }
        }
      }
    })

    if (!guest) {
      return NextResponse.json(
        { success: false, error: "Invité non trouvé" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      guest: {
        id: guest.id,
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
        phone: guest.phone,
        status: guest.status,
        confirmedAt: guest.confirmedAt?.toISOString() || null,
        scannedAt: guest.scannedAt?.toISOString() || null,
        hasScanned: guest.qrCode?.scanned || false,
        event: guest.event,
        createdAt: guest.createdAt.toISOString(),
      }
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la récupération de l'invité:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}

// PATCH - Modifier un invité
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const guestId = params.id

    // Vérifier que l'invité existe et appartient à l'utilisateur
    const existingGuest = await db.guest.findFirst({
      where: {
        id: guestId,
        userId: userId,
      }
    })

    if (!existingGuest) {
      return NextResponse.json(
        { success: false, error: "Invité non trouvé ou non autorisé" },
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
    const validatedData = updateGuestSchema.parse(body)

    // Vérifier si l'email existe déjà pour cet événement (si modifié)
    if (validatedData.email && validatedData.email !== existingGuest.email) {
      const emailExists = await db.guest.findFirst({
        where: {
          eventId: existingGuest.eventId,
          email: validatedData.email,
          userId: userId,
          id: { not: guestId }
        }
      })

      if (emailExists) {
        return NextResponse.json(
          { success: false, error: "Un invité avec cet email existe déjà pour cet événement" },
          { status: 409 }
        )
      }
    }

    // Préparer les données de mise à jour
    const updateData: any = {}
    
    if (validatedData.firstName !== undefined) {
      updateData.firstName = validatedData.firstName.trim()
    }
    if (validatedData.lastName !== undefined) {
      updateData.lastName = validatedData.lastName.trim()
    }
    if (validatedData.email !== undefined) {
      updateData.email = validatedData.email.trim() || null
    }
    if (validatedData.phone !== undefined) {
      updateData.phone = validatedData.phone.trim() || null
    }
    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status
      // Si le statut passe à CONFIRMED, mettre à jour confirmedAt
      if (validatedData.status === "CONFIRMED" && !existingGuest.confirmedAt) {
        updateData.confirmedAt = new Date()
      }
    }

    // Mettre à jour l'invité
    const updatedGuest = await db.guest.update({
      where: { id: guestId },
      data: updateData,
      include: {
        event: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "Invité modifié avec succès",
      guest: {
        id: updatedGuest.id,
        firstName: updatedGuest.firstName,
        lastName: updatedGuest.lastName,
        email: updatedGuest.email,
        phone: updatedGuest.phone,
        status: updatedGuest.status,
        event: updatedGuest.event,
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

    console.error("Erreur lors de la modification de l'invité:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de la modification de l'invité" },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un invité
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const guestId = params.id

    // Vérifier que l'invité existe et appartient à l'utilisateur
    const existingGuest = await db.guest.findFirst({
      where: {
        id: guestId,
        userId: userId,
      }
    })

    if (!existingGuest) {
      return NextResponse.json(
        { success: false, error: "Invité non trouvé ou non autorisé" },
        { status: 404 }
      )
    }

    // Supprimer l'invité (cascade supprimera aussi le QR code associé)
    await db.guest.delete({
      where: { id: guestId }
    })

    return NextResponse.json({
      success: true,
      message: "Invité supprimé avec succès"
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la suppression de l'invité:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de la suppression de l'invité" },
      { status: 500 }
    )
  }
}

