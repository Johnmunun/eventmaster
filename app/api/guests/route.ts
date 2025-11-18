import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { Prisma } from "@prisma/client"

const createGuestSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis").max(50, "Le prénom est trop long"),
  lastName: z.string().min(1, "Le nom est requis").max(50, "Le nom est trop long"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().max(20, "Le numéro de téléphone est trop long").optional().or(z.literal("")),
  eventId: z.string().min(1, "L'événement est requis"),
})

// GET - Récupérer les invités avec recherche, filtres et pagination
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
    const { searchParams } = new URL(request.url)

    // Récupérer les paramètres de requête
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const eventId = searchParams.get("eventId") || ""
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Validation des paramètres
    const pageNumber = Math.max(1, page)
    const limitNumber = Math.min(100, Math.max(1, limit)) // Limite entre 1 et 100
    const skip = (pageNumber - 1) * limitNumber

    // Construire les conditions de filtrage
    const where: Prisma.GuestWhereInput = {
      userId,
    }

    // Filtre par recherche (prénom, nom, email, téléphone)
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        { lastName: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        { email: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        { phone: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
      ]
    }

    // Filtre par statut
    if (status && ['PENDING', 'CONFIRMED', 'CANCELLED', 'ATTENDED'].includes(status)) {
      where.status = status as any
    }

    // Filtre par événement
    if (eventId) {
      where.eventId = eventId
    }

    // Construire l'ordre de tri
    const orderBy: Prisma.GuestOrderByWithRelationInput = {}
    if (sortBy === 'name') {
      orderBy.firstName = sortOrder === 'desc' ? 'desc' : 'asc'
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder === 'desc' ? 'desc' : 'asc'
    } else if (sortBy === 'status') {
      orderBy.status = sortOrder === 'desc' ? 'desc' : 'asc'
    } else {
      orderBy.createdAt = 'desc' // Par défaut
    }

    // Requêtes en parallèle pour optimiser les performances
    const [guests, totalCount] = await Promise.all([
      // Récupérer les invités avec pagination
      db.guest.findMany({
        where,
        orderBy,
        skip,
        take: limitNumber,
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
      }),
      // Compter le total pour la pagination
      db.guest.count({ where })
    ])

    // Formater les invités
    const formattedGuests = guests.map(guest => {
      const fullName = `${guest.firstName} ${guest.lastName}`
      const hasScanned = guest.qrCode?.scanned || false
      const scannedAt = guest.qrCode?.scannedAt

      return {
        id: guest.id,
        firstName: guest.firstName,
        lastName: guest.lastName,
        fullName,
        email: guest.email,
        phone: guest.phone,
        status: guest.status,
        confirmedAt: guest.confirmedAt?.toISOString() || null,
        scannedAt: scannedAt?.toISOString() || null,
        hasScanned,
        event: {
          id: guest.event.id,
          name: guest.event.name,
          date: guest.event.date.toISOString(),
        },
        createdAt: guest.createdAt.toISOString(),
      }
    })

    // Calculer les informations de pagination
    const totalPages = Math.ceil(totalCount / limitNumber)
    const hasNextPage = pageNumber < totalPages
    const hasPreviousPage = pageNumber > 1

    return NextResponse.json({
      success: true,
      guests: formattedGuests,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
      filters: {
        search,
        status,
        eventId,
        sortBy,
        sortOrder,
      }
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la récupération des invités:", error)
    
    // Gestion des erreurs Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P1001') {
        return NextResponse.json(
          { success: false, error: "Impossible de se connecter à la base de données" },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de la récupération des invités" },
      { status: 500 }
    )
  }
}

// POST - Créer un nouvel invité
export async function POST(request: NextRequest) {
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

    // Vérifier que le body est valide
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { success: false, error: "Format de requête invalide" },
        { status: 400 }
      )
    }

    // Validation des données
    const validatedData = createGuestSchema.parse(body)

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

    // Vérifier si l'email existe déjà pour cet événement (optionnel)
    if (validatedData.email) {
      const existingGuest = await db.guest.findFirst({
        where: {
          eventId: validatedData.eventId,
          email: validatedData.email,
          userId: userId,
        }
      })

      if (existingGuest) {
        return NextResponse.json(
          { success: false, error: "Un invité avec cet email existe déjà pour cet événement" },
          { status: 409 }
        )
      }
    }

    // Créer l'invité
    const guest = await db.guest.create({
      data: {
        firstName: validatedData.firstName.trim(),
        lastName: validatedData.lastName.trim(),
        email: validatedData.email?.trim() || null,
        phone: validatedData.phone?.trim() || null,
        status: 'PENDING',
        eventId: validatedData.eventId,
        userId: userId,
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

    return NextResponse.json(
      {
        success: true,
        message: "Invité créé avec succès",
        guest: {
          id: guest.id,
          firstName: guest.firstName,
          lastName: guest.lastName,
          email: guest.email,
          phone: guest.phone,
          status: guest.status,
          event: guest.event,
        }
      },
      { status: 201 }
    )

  } catch (error) {
    // Gestion des erreurs de validation Zod
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

    // Gestion des erreurs Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P1001') {
        return NextResponse.json(
          { success: false, error: "Impossible de se connecter à la base de données" },
          { status: 503 }
        )
      }
    }

    // Erreur générique
    console.error("Erreur lors de la création de l'invité:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de la création de l'invité" },
      { status: 500 }
    )
  }
}

