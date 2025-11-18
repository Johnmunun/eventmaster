import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { Prisma } from "@prisma/client"

const createEventSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(20, "Le nom ne peut pas dépasser 20 caractères"),
  type: z.string().min(1, "Le type est requis"),
  date: z.string().min(1, "La date est requise"),
  time: z.string().min(1, "L'heure est requise"),
  location: z.string().optional(),
  description: z.string().max(1000, "La description est trop longue").optional(),
})

// GET - Récupérer les événements avec recherche, filtres et pagination
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
    const limit = parseInt(searchParams.get("limit") || "12")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const type = searchParams.get("type") || ""
    const sortBy = searchParams.get("sortBy") || "date"
    const sortOrder = searchParams.get("sortOrder") || "asc"

    // Validation des paramètres
    const pageNumber = Math.max(1, page)
    const limitNumber = Math.min(50, Math.max(1, limit)) // Limite entre 1 et 50
    const skip = (pageNumber - 1) * limitNumber

    // Construire les conditions de filtrage
    const where: Prisma.EventWhereInput = {
      userId,
    }

    // Filtre par recherche (nom, lieu, description)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        { location: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
      ]
    }

    // Filtre par statut
    if (status && ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'].includes(status)) {
      where.status = status as any
    }

    // Filtre par type
    if (type) {
      where.type = { contains: type, mode: 'insensitive' as Prisma.QueryMode }
    }

    // Construire l'ordre de tri
    const orderBy: Prisma.EventOrderByWithRelationInput = {}
    if (sortBy === 'date') {
      orderBy.date = sortOrder === 'desc' ? 'desc' : 'asc'
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder === 'desc' ? 'desc' : 'asc'
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder === 'desc' ? 'desc' : 'asc'
    } else {
      orderBy.date = 'asc' // Par défaut
    }

    // Requêtes en parallèle pour optimiser les performances
    const [events, totalCount] = await Promise.all([
      // Récupérer les événements avec pagination
      db.event.findMany({
        where,
        orderBy,
        skip,
        take: limitNumber,
        include: {
          _count: {
            select: {
              guests: true,
              qrCodes: true,
            }
          }
        }
      }),
      // Compter le total pour la pagination
      db.event.count({ where })
    ])

    // Formater les événements
    const formattedEvents = events.map(event => {
      const eventDate = new Date(event.date)
      const now = new Date()
      
      // Déterminer le statut réel si nécessaire
      let actualStatus = event.status
      if (event.status === 'UPCOMING' && eventDate <= now) {
        actualStatus = 'ONGOING'
      }

      return {
        id: event.id,
        name: event.name,
        type: event.type,
        date: event.date.toISOString(),
        location: event.location,
        description: event.description,
        status: actualStatus,
        guestsCount: event._count.guests,
        qrCodesCount: event._count.qrCodes,
        createdAt: event.createdAt.toISOString(),
      }
    })

    // Calculer les informations de pagination
    const totalPages = Math.ceil(totalCount / limitNumber)
    const hasNextPage = pageNumber < totalPages
    const hasPreviousPage = pageNumber > 1

    return NextResponse.json({
      success: true,
      events: formattedEvents,
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
        type,
        sortBy,
        sortOrder,
      }
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error)
    
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
      { success: false, error: "Une erreur est survenue lors de la récupération des événements" },
      { status: 500 }
    )
  }
}

// POST - Créer un nouvel événement
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
    const validatedData = createEventSchema.parse(body)

    // Combiner date et heure
    const dateTimeString = `${validatedData.date}T${validatedData.time}`
    const eventDate = new Date(dateTimeString)

    // Vérifier que la date est dans le futur (optionnel, mais recommandé)
    if (eventDate < new Date()) {
      return NextResponse.json(
        { success: false, error: "La date de l'événement doit être dans le futur" },
        { status: 400 }
      )
    }

    // Créer l'événement
    const event = await db.event.create({
      data: {
        name: validatedData.name.trim(),
        type: validatedData.type,
        date: eventDate,
        location: validatedData.location?.trim() || null,
        description: validatedData.description?.trim() || null,
        status: 'UPCOMING',
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        type: true,
        date: true,
        location: true,
        status: true,
        createdAt: true,
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: "Événement créé avec succès",
        event,
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
      
      if (error.code === 'P2002') {
        return NextResponse.json(
          { success: false, error: "Un événement similaire existe déjà" },
          { status: 409 }
        )
      }
    }

    // Gestion des erreurs Prisma de connexion
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { success: false, error: "Erreur de connexion à la base de données" },
        { status: 503 }
      )
    }

    // Erreur générique
    console.error("Erreur lors de la création de l'événement:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de la création de l'événement" },
      { status: 500 }
    )
  }
}
