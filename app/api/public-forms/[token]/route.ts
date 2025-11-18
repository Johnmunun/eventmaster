import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"
import { Prisma } from "@prisma/client"
import {
  getClientIP,
  isValidEmail,
  isValidPhone,
  sanitizeString,
  isBotUserAgent,
  checkRateLimit,
  validateToken,
} from "@/lib/security"

const submitFormSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis").max(50, "Le prénom est trop long"),
  lastName: z.string().min(1, "Le nom est requis").max(50, "Le nom est trop long"),
  email: z.string().email("Email invalide").optional(),
  phone: z.string().max(20, "Le numéro de téléphone est trop long").optional(),
})

// GET - Récupérer les informations d'un formulaire public (sans authentification)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const resolvedParams = await params
    const token = resolvedParams.token

    // Valider le format du token
    if (!validateToken(token)) {
      return NextResponse.json(
        { success: false, error: "Token invalide" },
        { status: 400 }
      )
    }

    // Récupérer le formulaire
    const form = await db.publicForm.findUnique({
      where: { token },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            date: true,
            location: true,
            description: true,
          }
        }
      }
    })

    if (!form) {
      return NextResponse.json(
        { success: false, error: "Formulaire non trouvé" },
        { status: 404 }
      )
    }

    // Vérifier si le formulaire est actif
    if (!form.isActive) {
      return NextResponse.json(
        { success: false, error: "Ce formulaire n'est plus actif" },
        { status: 403 }
      )
    }

    // Vérifier si le formulaire a expiré
    if (form.expiresAt && new Date(form.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: "Ce formulaire a expiré" },
        { status: 403 }
      )
    }

    // Vérifier si la limite de soumissions est atteinte
    if (form.maxSubmissions && form.currentSubmissions >= form.maxSubmissions) {
      return NextResponse.json(
        { success: false, error: "La limite de soumissions pour ce formulaire est atteinte" },
        { status: 403 }
      )
    }

    // Retourner les informations du formulaire (sans données sensibles)
    return NextResponse.json({
      success: true,
      form: {
        id: form.id,
        title: form.title || form.event.name,
        description: form.description,
        requireEmail: form.requireEmail,
        requirePhone: form.requirePhone,
        event: {
          name: form.event.name,
          date: form.event.date.toISOString(),
          location: form.event.location,
          description: form.event.description,
        },
        maxSubmissions: form.maxSubmissions,
        currentSubmissions: form.currentSubmissions,
      }
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la récupération du formulaire:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}

// POST - Soumettre un formulaire public (sans authentification)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const resolvedParams = await params
    const token = resolvedParams.token

    // Valider le format du token
    if (!validateToken(token)) {
      return NextResponse.json(
        { success: false, error: "Token invalide" },
        { status: 400 }
      )
    }

    // Récupérer les informations de sécurité
    const ip = getClientIP(request)
    const userAgent = request.headers.get('user-agent')

    // Vérifier le rate limiting (10 requêtes par minute par IP)
    const rateLimit = checkRateLimit(ip, 10, 60000)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Trop de requêtes. Veuillez réessayer plus tard.",
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetAt.toString(),
          }
        }
      )
    }

    // Détecter les bots
    if (isBotUserAgent(userAgent)) {
      return NextResponse.json(
        { success: false, error: "Accès refusé" },
        { status: 403 }
      )
    }

    // Récupérer le formulaire
    const form = await db.publicForm.findUnique({
      where: { token },
      include: {
        event: {
          select: {
            id: true,
            userId: true,
          }
        }
      }
    })

    if (!form) {
      return NextResponse.json(
        { success: false, error: "Formulaire non trouvé" },
        { status: 404 }
      )
    }

    // Vérifier si le formulaire est actif
    if (!form.isActive) {
      return NextResponse.json(
        { success: false, error: "Ce formulaire n'est plus actif" },
        { status: 403 }
      )
    }

    // Vérifier si le formulaire a expiré
    if (form.expiresAt && new Date(form.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: "Ce formulaire a expiré" },
        { status: 403 }
      )
    }

    // Vérifier si la limite de soumissions est atteinte
    if (form.maxSubmissions && form.currentSubmissions >= form.maxSubmissions) {
      return NextResponse.json(
        { success: false, error: "La limite de soumissions pour ce formulaire est atteinte" },
        { status: 403 }
      )
    }

    // Rate limiting spécifique par formulaire et IP (5 soumissions par minute par IP pour ce formulaire)
    const formRateLimit = checkRateLimit(`${ip}-form-${form.id}`, 5, 60000)
    if (!formRateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Trop de soumissions depuis cette adresse. Veuillez réessayer dans quelques instants.",
          retryAfter: Math.ceil((formRateLimit.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((formRateLimit.resetAt - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': formRateLimit.resetAt.toString(),
          }
        }
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

    // Validation des données
    const validatedData = submitFormSchema.parse(body)

    // Nettoyer les données
    const cleanedData = {
      firstName: sanitizeString(validatedData.firstName),
      lastName: sanitizeString(validatedData.lastName),
      email: validatedData.email ? sanitizeString(validatedData.email).toLowerCase() : null,
      phone: validatedData.phone ? sanitizeString(validatedData.phone) : null,
    }

    // Validation des champs requis
    if (form.requireEmail && !cleanedData.email) {
      return NextResponse.json(
        { success: false, error: "L'email est requis pour ce formulaire" },
        { status: 400 }
      )
    }

    if (form.requirePhone && !cleanedData.phone) {
      return NextResponse.json(
        { success: false, error: "Le téléphone est requis pour ce formulaire" },
        { status: 400 }
      )
    }

    // Valider l'email si fourni
    if (cleanedData.email && !isValidEmail(cleanedData.email)) {
      return NextResponse.json(
        { success: false, error: "Format d'email invalide" },
        { status: 400 }
      )
    }

    // Valider le téléphone si fourni
    if (cleanedData.phone && !isValidPhone(cleanedData.phone)) {
      return NextResponse.json(
        { success: false, error: "Format de téléphone invalide" },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà pour cet événement
    if (cleanedData.email) {
      const existingGuestByEmail = await db.guest.findFirst({
        where: {
          eventId: form.eventId,
          email: cleanedData.email,
          userId: form.event.userId,
        }
      })

      if (existingGuestByEmail) {
        if (!form.allowDuplicateEmail) {
          return NextResponse.json(
            { success: false, error: "Un invité avec cet email existe déjà pour cet événement" },
            { status: 409 }
          )
        }
        // Si allowDuplicateEmail est true, on vérifie quand même si c'est une soumission récente (spam)
        const recentSubmission = await db.formSubmission.findFirst({
          where: {
            formId: form.id,
            email: cleanedData.email,
            createdAt: {
              gte: new Date(Date.now() - 60000) // Dernière minute
            }
          }
        })
        if (recentSubmission) {
          return NextResponse.json(
            { success: false, error: "Vous avez déjà soumis ce formulaire récemment. Veuillez patienter." },
            { status: 429 }
          )
        }
      }
    }

    // Vérifier si le numéro de téléphone existe déjà pour cet événement
    if (cleanedData.phone) {
      const existingGuestByPhone = await db.guest.findFirst({
        where: {
          eventId: form.eventId,
          phone: cleanedData.phone,
          userId: form.event.userId,
        }
      })

      if (existingGuestByPhone) {
        return NextResponse.json(
          { success: false, error: "Un invité avec ce numéro de téléphone existe déjà pour cet événement" },
          { status: 409 }
        )
      }

      // Vérifier aussi les soumissions récentes avec le même téléphone (anti-spam)
      const recentSubmissionByPhone = await db.formSubmission.findFirst({
        where: {
          formId: form.id,
          phone: cleanedData.phone,
          createdAt: {
            gte: new Date(Date.now() - 60000) // Dernière minute
          }
        }
      })
      if (recentSubmissionByPhone) {
        return NextResponse.json(
          { success: false, error: "Vous avez déjà soumis ce formulaire récemment. Veuillez patienter." },
          { status: 429 }
        )
      }
    }

    // Utiliser une transaction pour garantir la cohérence
    const result = await db.$transaction(async (tx) => {
      // Créer la soumission
      const submission = await tx.formSubmission.create({
        data: {
          formId: form.id,
          firstName: cleanedData.firstName,
          lastName: cleanedData.lastName,
          email: cleanedData.email,
          phone: cleanedData.phone,
          ipAddress: ip,
          userAgent: userAgent,
          status: 'PENDING',
        }
      })

      // Créer l'invité
      const guest = await tx.guest.create({
        data: {
          firstName: cleanedData.firstName,
          lastName: cleanedData.lastName,
          email: cleanedData.email,
          phone: cleanedData.phone,
          status: 'PENDING',
          eventId: form.eventId,
          userId: form.event.userId,
        }
      })

      // Mettre à jour la soumission avec l'ID de l'invité
      await tx.formSubmission.update({
        where: { id: submission.id },
        data: {
          guestId: guest.id,
          status: 'PROCESSED',
        }
      })

      // Incrémenter le compteur de soumissions
      await tx.publicForm.update({
        where: { id: form.id },
        data: {
          currentSubmissions: {
            increment: 1,
          }
        }
      })

      return { submission, guest }
    })

    return NextResponse.json({
      success: true,
      message: "Votre inscription a été enregistrée avec succès !",
      guest: {
        id: result.guest.id,
        firstName: result.guest.firstName,
        lastName: result.guest.lastName,
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
          { success: false, error: "Une erreur est survenue lors de l'enregistrement" },
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

    console.error("Erreur lors de la soumission du formulaire:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de l'enregistrement de votre inscription" },
      { status: 500 }
    )
  }
}

