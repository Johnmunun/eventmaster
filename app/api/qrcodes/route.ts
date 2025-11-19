import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"
import { Prisma } from "@prisma/client"
import QRCode from "qrcode"
import crypto from "crypto"
import { uploadToImageKit, deleteFromImageKit } from "@/lib/imagekit"

const createQRCodeSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Le nom est trop long"),
  eventId: z.string().min(1, "L'événement est requis").optional(),
  guestId: z.string().optional(),
  type: z.enum(["EVENT", "GUEST", "CUSTOM"]),
  folderId: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur invalide").optional(),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur de fond invalide").optional(),
  data: z.record(z.any()).optional(), // Données personnalisées pour le QR code
})

// POST - Créer un QR code
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
    const validatedData = createQRCodeSchema.parse(body)

    // Vérifier que l'événement appartient à l'utilisateur si fourni
    if (validatedData.eventId) {
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
    }

    // Vérifier que l'invité appartient à l'utilisateur si fourni
    if (validatedData.guestId) {
      const guest = await db.guest.findFirst({
        where: {
          id: validatedData.guestId,
          userId: userId,
        }
      })

      if (!guest) {
        return NextResponse.json(
          { success: false, error: "Invité non trouvé ou non autorisé" },
          { status: 404 }
        )
      }
    }

    // Vérifier que le dossier appartient à l'utilisateur si fourni
    if (validatedData.folderId) {
      const folder = await db.folder.findFirst({
        where: {
          id: validatedData.folderId,
          userId: userId,
        }
      })

      if (!folder) {
        return NextResponse.json(
          { success: false, error: "Dossier non trouvé ou non autorisé" },
          { status: 404 }
        )
      }
    }

    // Générer un code unique pour le QR code
    let code: string
    let isUnique = false
    let attempts = 0
    const maxAttempts = 10

    while (!isUnique && attempts < maxAttempts) {
      code = crypto.randomBytes(16).toString('hex')
      const existing = await db.qrCode.findUnique({
        where: { code }
      })
      if (!existing) {
        isUnique = true
      }
      attempts++
    }

    if (!isUnique) {
      return NextResponse.json(
        { success: false, error: "Impossible de générer un code unique. Veuillez réessayer." },
        { status: 500 }
      )
    }

    // Déterminer l'URL à encoder dans le QR code
    let qrData: string
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    if (validatedData.type === "GUEST" && validatedData.guestId) {
      // QR code pour un invité spécifique
      qrData = `${baseUrl}/scan/${code}`
    } else if (validatedData.type === "EVENT" && validatedData.eventId) {
      // QR code pour un événement
      qrData = `${baseUrl}/event/${validatedData.eventId}/scan/${code}`
    } else {
      // QR code personnalisé
      qrData = validatedData.data?.url || `${baseUrl}/scan/${code}`
    }

    // Générer le QR code en base64
    const qrCodeOptions = {
      color: {
        dark: validatedData.color || "#000000",
        light: validatedData.backgroundColor || "#FFFFFF",
      },
      errorCorrectionLevel: 'H' as const,
      type: 'image/png' as const,
      quality: 0.92,
      margin: 1,
      width: 512,
    }

    const qrCodeDataUrl = await QRCode.toDataURL(qrData, qrCodeOptions)

    // Convertir base64 en Buffer pour ImageKit
    const base64Data = qrCodeDataUrl.replace(/^data:image\/\w+;base64,/, '')
    const imageBuffer = Buffer.from(base64Data, 'base64')

    // Upload sur ImageKit
    let imageKitUrl: string | null = null
    let imageKitFileId: string | null = null
    let imageKitThumbnailUrl: string | null = null

    try {
      const imageKitResult = await uploadToImageKit({
        file: imageBuffer,
        fileName: `qrcode-${code}-${Date.now()}.png`,
        folder: "/qrcodes",
        tags: ["qrcode", "eventmaster", validatedData.type.toLowerCase()],
      })

      imageKitUrl = imageKitResult.url
      imageKitFileId = imageKitResult.fileId
      imageKitThumbnailUrl = imageKitResult.thumbnailUrl
    } catch (imageKitError) {
      console.error("Erreur ImageKit, utilisation du fallback base64:", imageKitError)
      // En cas d'erreur ImageKit, on continue avec base64
    }

    // Préparer les données à stocker
    const qrCodeData = {
      name: validatedData.name,
      url: qrData,
      color: validatedData.color || "#000000",
      backgroundColor: validatedData.backgroundColor || "#FFFFFF",
      image: qrCodeDataUrl, // Garder base64 en fallback
      imageKitUrl: imageKitUrl,
      imageKitFileId: imageKitFileId,
      imageKitThumbnailUrl: imageKitThumbnailUrl,
      ...validatedData.data,
    }

    // Créer le QR code dans la base de données
    const qrCode = await db.qrCode.create({
      data: {
        code: code!,
        type: validatedData.type,
        data: qrCodeData,
        eventId: validatedData.eventId || null,
        guestId: validatedData.guestId || null,
        folderId: validatedData.folderId || null,
        userId: userId,
        scanned: false,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
          }
        },
        folder: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "QR code généré avec succès",
      qrCode: {
        id: qrCode.id,
        code: qrCode.code,
        name: validatedData.name,
        type: qrCode.type,
        image: imageKitUrl || qrCodeDataUrl, // Préférer ImageKit si disponible
        imageKitUrl: imageKitUrl,
        imageKitFileId: imageKitFileId,
        url: qrData,
        event: qrCode.event,
        folder: qrCode.folder,
        createdAt: qrCode.createdAt.toISOString(),
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
          { success: false, error: "Un QR code avec ce code existe déjà" },
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

    console.error("Erreur lors de la génération du QR code:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de la génération du QR code" },
      { status: 500 }
    )
  }
}

// GET - Récupérer les QR codes de l'utilisateur
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
    const folderId = searchParams.get('folderId')
    const eventId = searchParams.get('eventId')

    const where: Prisma.QrCodeWhereInput = {
      userId,
    }

    if (folderId) {
      where.folderId = folderId
    }

    if (eventId) {
      where.eventId = eventId
    }

    const qrCodes = await db.qrCode.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            name: true,
            date: true,
          }
        },
        folder: {
          select: {
            id: true,
            name: true,
            color: true,
          }
        },
        guest: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedQRCodes = qrCodes.map(qr => {
      const qrData = qr.data as any
      // Utiliser ImageKit si disponible, sinon base64
      const imageUrl = qrData?.imageKitUrl || qrData?.image || ""
      
      return {
        id: qr.id,
        code: qr.code,
        name: qrData?.name || "QR Code",
        type: qr.type,
        scanned: qr.scanned,
        scannedAt: qr.scannedAt?.toISOString() || null,
        createdAt: qr.createdAt.toISOString(),
        imageUrl: imageUrl,
        imageKitFileId: qrData?.imageKitFileId || null,
        event: qr.event,
        folder: qr.folder,
        guest: qr.guest,
      }
    })

    return NextResponse.json({
      success: true,
      qrCodes: formattedQRCodes
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la récupération des QR codes:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer plusieurs QR codes
export async function DELETE(request: NextRequest) {
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
    const idsParam = searchParams.get('ids')
    
    if (!idsParam) {
      return NextResponse.json(
        { success: false, error: "Aucun ID fourni" },
        { status: 400 }
      )
    }

    const ids = idsParam.split(',').filter(id => id.trim())
    
    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Aucun ID valide fourni" },
        { status: 400 }
      )
    }

    // Vérifier que tous les QR codes appartiennent à l'utilisateur
    const qrCodes = await db.qrCode.findMany({
      where: {
        id: { in: ids },
        userId: userId,
      },
      select: {
        id: true,
        data: true,
      }
    })

    if (qrCodes.length !== ids.length) {
      return NextResponse.json(
        { success: false, error: "Certains QR codes n'existent pas ou ne vous appartiennent pas" },
        { status: 403 }
      )
    }

    // Supprimer tous les fichiers associés sur ImageKit pour chaque QR code
    for (const qrCode of qrCodes) {
      const qrData = qrCode.data as any
      const templateData = qrCode.templateData as any
      
      // Liste des IDs de fichiers à supprimer pour ce QR code
      const fileIdsToDelete: string[] = []
      
      // Supprimer l'image principale du QR code
      if (qrData?.imageKitFileId) {
        fileIdsToDelete.push(qrData.imageKitFileId)
      }
      
      // Supprimer le logo si présent
      if (qrData?.logoFileId) {
        fileIdsToDelete.push(qrData.logoFileId)
      }
      
      // Supprimer les fichiers depuis templateData
      if (templateData?.uploadedFileIds && Array.isArray(templateData.uploadedFileIds)) {
        templateData.uploadedFileIds.forEach((fileInfo: { fileId: string }) => {
          if (fileInfo.fileId && !fileIdsToDelete.includes(fileInfo.fileId)) {
            fileIdsToDelete.push(fileInfo.fileId)
          }
        })
      }
      
      // Supprimer tous les fichiers ImageKit pour ce QR code
      for (const fileId of fileIdsToDelete) {
        try {
          await deleteFromImageKit(fileId)
        } catch (error) {
          console.error(`Erreur lors de la suppression ImageKit pour ${fileId}:`, error)
          // On continue même si la suppression ImageKit échoue
        }
      }
    }

    // Supprimer les QR codes
    await db.qrCode.deleteMany({
      where: {
        id: { in: ids },
        userId: userId,
      }
    })

    return NextResponse.json({
      success: true,
      message: `${qrCodes.length} QR code(s) supprimé(s) avec succès`,
      deletedCount: qrCodes.length
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la suppression multiple des QR codes:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de la suppression" },
      { status: 500 }
    )
  }
}

