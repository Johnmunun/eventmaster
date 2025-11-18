import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { Prisma } from "@prisma/client"

const sendInvitationSchema = z.object({
  guestIds: z.array(z.string()).min(1, "Au moins un invité doit être sélectionné"),
  subject: z.string().min(1, "Le sujet est requis").max(200, "Le sujet est trop long"),
  message: z.string().min(1, "Le message est requis").max(5000, "Le message est trop long"),
})

// POST - Envoyer des invitations par email
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
    const validatedData = sendInvitationSchema.parse(body)

    // Vérifier que tous les invités appartiennent à l'utilisateur
    const guests = await db.guest.findMany({
      where: {
        id: { in: validatedData.guestIds },
        userId: userId,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            date: true,
            location: true,
          }
        }
      }
    })

    if (guests.length !== validatedData.guestIds.length) {
      return NextResponse.json(
        { success: false, error: "Certains invités n'ont pas été trouvés ou ne vous appartiennent pas" },
        { status: 403 }
      )
    }

    // Filtrer les invités qui ont un email
    const guestsWithEmail = guests.filter(guest => guest.email)

    if (guestsWithEmail.length === 0) {
      return NextResponse.json(
        { success: false, error: "Aucun invité n'a d'adresse email" },
        { status: 400 }
      )
    }

    // TODO: Intégrer un service d'email (Resend, SendGrid, etc.)
    // Pour l'instant, on simule l'envoi
    const emailResults = await Promise.allSettled(
      guestsWithEmail.map(async (guest) => {
        // Simuler l'envoi d'email
        // Dans un vrai projet, vous utiliseriez un service comme Resend:
        // await resend.emails.send({
        //   from: 'noreply@eventmaster.com',
        //   to: guest.email!,
        //   subject: validatedData.subject,
        //   html: generateEmailTemplate(guest, validatedData.message)
        // })

        // Pour l'instant, on retourne juste un succès simulé
        return {
          guestId: guest.id,
          email: guest.email,
          success: true,
        }
      })
    )

    const successful = emailResults.filter(r => r.status === 'fulfilled').length
    const failed = emailResults.filter(r => r.status === 'rejected').length

    return NextResponse.json({
      success: true,
      message: `${successful} invitation(s) envoyée(s) avec succès${failed > 0 ? `, ${failed} échec(s)` : ''}`,
      results: {
        total: guestsWithEmail.length,
        successful,
        failed,
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

    console.error("Erreur lors de l'envoi des invitations:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de l'envoi des invitations" },
      { status: 500 }
    )
  }
}

