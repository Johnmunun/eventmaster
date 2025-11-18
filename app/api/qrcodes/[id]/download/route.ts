import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { getImageKitUrl } from "@/lib/imagekit"

// GET - Télécharger un QR code
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
      }
    })

    if (!qrCode) {
      return NextResponse.json(
        { success: false, error: "QR code non trouvé ou non autorisé" },
        { status: 404 }
      )
    }

    const qrData = qrCode.data as any
    const qrName = qrData?.name || `qrcode-${qrCode.code}`

    // Construire l'URL de l'image haute qualité
    let imageUrl = qrData?.image || ""
    if (qrData?.imageKitFileId) {
      // ImageKit avec haute qualité pour téléchargement
      imageUrl = getImageKitUrl(qrData.imageKitFileId, {
        width: 1024,
        quality: 100,
        format: "png",
      })
    } else if (qrData?.imageKitUrl) {
      imageUrl = qrData.imageKitUrl
    }

    // Si c'est une base64, la convertir en Buffer
    if (imageUrl.startsWith("data:image")) {
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '')
      const imageBuffer = Buffer.from(base64Data, 'base64')
      
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="${qrName}.png"`,
          'Content-Length': imageBuffer.length.toString(),
        },
      })
    }

    // Si c'est une URL ImageKit, rediriger vers l'URL de téléchargement
    if (imageUrl) {
      // Ajouter le paramètre de téléchargement
      const downloadUrl = imageUrl.includes('?') 
        ? `${imageUrl}&ik-attachment=true`
        : `${imageUrl}?ik-attachment=true`
      
      return NextResponse.redirect(downloadUrl)
    }

    return NextResponse.json(
      { success: false, error: "Image non disponible" },
      { status: 404 }
    )

  } catch (error) {
    console.error("Erreur lors du téléchargement du QR code:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}



