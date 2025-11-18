import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { getImageKitUrl } from "@/lib/imagekit"

// GET - Obtenir les informations de prévisualisation d'un QR code
export async function GET(
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
    const qrCodeId = resolvedParams.id

    // Récupérer le QR code
    const qrCode = await db.qrCode.findFirst({
      where: {
        id: qrCodeId,
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
            email: true,
          }
        }
      }
    })

    if (!qrCode) {
      return NextResponse.json(
        { success: false, error: "QR code non trouvé ou non autorisé" },
        { status: 404 }
      )
    }

    const qrData = qrCode.data as any

    // Construire l'URL de l'image (ImageKit ou base64)
    let imageUrl = ""
    
    // Priorité 1: ImageKit URL directe (la plus fiable)
    if (qrData?.imageKitUrl) {
      imageUrl = qrData.imageKitUrl
    }
    // Priorité 2: ImageKit Thumbnail URL
    else if (qrData?.imageKitThumbnailUrl) {
      imageUrl = qrData.imageKitThumbnailUrl
    }
    // Priorité 3: ImageKit File ID (générer l'URL)
    else if (qrData?.imageKitFileId) {
      try {
        imageUrl = getImageKitUrl(qrData.imageKitFileId, {
          width: 800,
          quality: 90,
          format: "png",
        })
      } catch (error) {
        console.error("Erreur lors de la génération de l'URL ImageKit:", error)
      }
    }
    // Priorité 4: Base64 image (fallback)
    else if (qrData?.image) {
      // Vérifier si c'est déjà une data URL
      if (qrData.image.startsWith("data:image")) {
        imageUrl = qrData.image
      } else {
        // Si c'est juste du base64, ajouter le préfixe
        imageUrl = `data:image/png;base64,${qrData.image}`
      }
    }
    
    // Debug: logger les données pour diagnostiquer
    if (!imageUrl) {
      console.warn(`QR code ${qrCodeId} n'a pas d'image associée`, {
        hasImageKitUrl: !!qrData?.imageKitUrl,
        hasImageKitThumbnailUrl: !!qrData?.imageKitThumbnailUrl,
        hasImageKitFileId: !!qrData?.imageKitFileId,
        hasImage: !!qrData?.image,
        dataKeys: Object.keys(qrData || {}),
      })
    } else {
      console.log(`QR code ${qrCodeId} - Image URL trouvée:`, imageUrl.substring(0, 100))
    }

    return NextResponse.json({
      success: true,
      qrCode: {
        id: qrCode.id,
        code: qrCode.code,
        name: qrData?.name || "QR Code",
        type: qrCode.type,
        url: qrData?.url || "",
        imageUrl: imageUrl,
        color: qrData?.color || "#000000",
        backgroundColor: qrData?.backgroundColor || "#FFFFFF",
        scanned: qrCode.scanned,
        scannedAt: qrCode.scannedAt?.toISOString() || null,
        createdAt: qrCode.createdAt.toISOString(),
        event: qrCode.event,
        folder: qrCode.folder,
        guest: qrCode.guest,
      }
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la récupération du QR code:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}

