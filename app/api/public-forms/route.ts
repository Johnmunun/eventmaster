import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { Prisma } from "@prisma/client"
import { generateSecureToken } from "@/lib/security"

const createFormSchema = z.object({
  eventId: z.string().min(1, "L'événement est requis"),
  title: z.string().max(200, "Le titre est trop long").optional(),
  description: z.string().max(1000, "La description est trop longue").optional(),
  maxSubmissions: z.number().int().positive().optional(),
  expiresAt: z.string().datetime().optional(),
  allowDuplicateEmail: z.boolean().default(false),
  requireEmail: z.boolean().default(true),
  requirePhone: z.boolean().default(false),
})

// POST - Créer un formulaire public
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
    const validatedData = createFormSchema.parse(body)

    // Vérifier que l'événement appartient à l'utilisateur
    const event = await db.event.findFirst({
      where: {
        id: validatedData.eventId,
        userId: userId,
      }
    })

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Événement non trouvé ou non autorisé" },
        { status: 404 }
      )
    }

    // Générer un token sécurisé unique
    let token: string
    let isUnique = false
    let attempts = 0
    const maxAttempts = 10

    while (!isUnique && attempts < maxAttempts) {
      token = generateSecureToken()
      const existing = await db.publicForm.findUnique({
        where: { token }
      })
      if (!existing) {
        isUnique = true
      }
      attempts++
    }

    if (!isUnique) {
      return NextResponse.json(
        { success: false, error: "Impossible de générer un token unique. Veuillez réessayer." },
        { status: 500 }
      )
    }

    // Créer le formulaire
    const form = await db.publicForm.create({
      data: {
        token: token!,
        eventId: validatedData.eventId,
        userId: userId,
        title: validatedData.title,
        description: validatedData.description,
        maxSubmissions: validatedData.maxSubmissions,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        allowDuplicateEmail: validatedData.allowDuplicateEmail,
        requireEmail: validatedData.requireEmail,
        requirePhone: validatedData.requirePhone,
        isActive: true,
        currentSubmissions: 0,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    // Générer l'URL publique
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
    const publicUrl = `${baseUrl}/form/${form.token}`

    return NextResponse.json({
      success: true,
      message: "Formulaire créé avec succès",
      form: {
        id: form.id,
        token: form.token,
        publicUrl,
        title: form.title,
        description: form.description,
        isActive: form.isActive,
        maxSubmissions: form.maxSubmissions,
        currentSubmissions: form.currentSubmissions,
        expiresAt: form.expiresAt?.toISOString() || null,
        event: form.event,
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
      if (error.code === 'P2002') {
        return NextResponse.json(
          { success: false, error: "Un formulaire avec ce token existe déjà" },
          { status: 409 }
        )
      }
      if (error.code === 'P1001') {
        return NextResponse.json(
          { success: false, error: "Impossible de se connecter à la base de données" },
          { status: 503 }
        )
      }
    }

    console.error("Erreur lors de la création du formulaire:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de la création du formulaire" },
      { status: 500 }
    )
  }
}

// GET - Récupérer les formulaires de l'utilisateur
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
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')

    const where: Prisma.PublicFormWhereInput = {
      userId,
    }

    if (eventId) {
      where.eventId = eventId
    }

    const forms = await db.publicForm.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            name: true,
            date: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin

    const formattedForms = forms.map(form => ({
      id: form.id,
      token: form.token,
      publicUrl: `${baseUrl}/form/${form.token}`,
      title: form.title,
      description: form.description,
      isActive: form.isActive,
      maxSubmissions: form.maxSubmissions,
      currentSubmissions: form.currentSubmissions,
      expiresAt: form.expiresAt?.toISOString() || null,
      createdAt: form.createdAt.toISOString(),
      event: form.event,
    }))

    return NextResponse.json({
      success: true,
      forms: formattedForms
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la récupération des formulaires:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}

