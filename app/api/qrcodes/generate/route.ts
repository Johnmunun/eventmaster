import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import QRCode from "qrcode"
import crypto from "crypto"
import { uploadToImageKit } from "@/lib/imagekit"

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
    const formData = await request.formData()

    const type = formData.get("type") as string
    const name = formData.get("name") as string
    const data = formData.get("data") as string
    const color = (formData.get("color") as string) || "#000000"
    const backgroundColor = (formData.get("backgroundColor") as string) || "#FFFFFF"
    const pixelShape = (formData.get("pixelShape") as string) || "square"
    const folderId = formData.get("folderId") as string | null
    const pdfFile = formData.get("pdfFile") as File | null
    const images = formData.getAll("images") as File[]
    const logoFile = formData.get("logoFile") as File | null
    const templateDataStr = formData.get("templateData") as string | null

    if (!type || !name || !data) {
      return NextResponse.json(
        { success: false, error: "Type, nom et données sont requis" },
        { status: 400 }
      )
    }

    // Vérifier que le dossier appartient à l'utilisateur si fourni
    if (folderId) {
      const folder = await db.folder.findFirst({
        where: {
          id: folderId,
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

    // Gérer l'upload des fichiers selon le type
    let finalData = data
    let uploadedFiles: string[] = []

    if (type === "PDF" && pdfFile) {
      // Upload du PDF sur ImageKit
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer())
      try {
        const pdfResult = await uploadToImageKit({
          file: pdfBuffer,
          fileName: `pdf-${Date.now()}-${pdfFile.name}`,
          folder: "/qrcodes/pdfs",
          tags: ["qrcode", "pdf", "eventmaster"],
        })
        finalData = pdfResult.url
        uploadedFiles.push(pdfResult.url)
      } catch (error) {
        console.error("Erreur upload PDF:", error)
        return NextResponse.json(
          { success: false, error: "Impossible d'uploader le PDF" },
          { status: 500 }
        )
      }
    }

    if (type === "IMAGE" && images.length > 0) {
      // Upload des images sur ImageKit
      const imageUrls: string[] = []
      for (const image of images) {
        try {
          const imageBuffer = Buffer.from(await image.arrayBuffer())
          const imageResult = await uploadToImageKit({
            file: imageBuffer,
            fileName: `image-${Date.now()}-${image.name}`,
            folder: "/qrcodes/images",
            tags: ["qrcode", "image", "eventmaster"],
          })
          imageUrls.push(imageResult.url)
        } catch (error) {
          console.error("Erreur upload image:", error)
        }
      }
      if (imageUrls.length > 0) {
        // Pour plusieurs images, on crée une page de galerie ou on encode la première
        finalData = imageUrls.length === 1 ? imageUrls[0] : JSON.stringify({ gallery: imageUrls })
        uploadedFiles = imageUrls
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

    // Options de génération du QR code
    const qrCodeOptions: any = {
      color: {
        dark: color,
        light: backgroundColor,
      },
      errorCorrectionLevel: 'H' as const,
      type: 'image/png' as const,
      quality: 0.92,
      margin: 1,
      width: 512,
    }

    // Si un logo est fourni, on l'ajoute au centre du QR code
    if (logoFile) {
      try {
        const logoBuffer = Buffer.from(await logoFile.arrayBuffer())
        // Pour ajouter un logo au centre, on utilise une approche différente
        // On génère d'abord le QR code, puis on superpose le logo
        // Pour simplifier, on stocke le logo séparément et on le superpose côté client
        const logoResult = await uploadToImageKit({
          file: logoBuffer,
          fileName: `logo-${Date.now()}-${logoFile.name}`,
          folder: "/qrcodes/logos",
          tags: ["qrcode", "logo", "eventmaster"],
        })
        qrCodeOptions.logo = logoResult.url
      } catch (error) {
        console.error("Erreur upload logo:", error)
        // On continue sans logo si l'upload échoue
      }
    }

    // Générer le QR code
    const qrCodeDataUrl = await QRCode.toDataURL(finalData, qrCodeOptions)

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
        tags: ["qrcode", "eventmaster", type.toLowerCase()],
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
      name: name,
      url: finalData,
      color: color,
      backgroundColor: backgroundColor,
      pixelShape: pixelShape,
      image: qrCodeDataUrl, // Garder base64 en fallback
      imageKitUrl: imageKitUrl,
      imageKitFileId: imageKitFileId,
      imageKitThumbnailUrl: imageKitThumbnailUrl,
      uploadedFiles: uploadedFiles,
      logoUrl: qrCodeOptions.logo || null,
    }

    // Parser templateData si présent
    let templateData = null
    if (templateDataStr) {
      try {
        templateData = JSON.parse(templateDataStr)
      } catch (e) {
        console.error("Erreur parsing templateData:", e)
      }
    }

    // Pour les templates, mettre à jour l'URL avec le vrai code
    if (type === "TEMPLATE" && templateData) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      qrCodeData.url = `${appUrl}/qr/${code}`
      // Régénérer le QR code avec la bonne URL
      const updatedQrCodeDataUrl = await QRCode.toDataURL(qrCodeData.url, qrCodeOptions)
      const updatedBase64Data = updatedQrCodeDataUrl.replace(/^data:image\/\w+;base64,/, '')
      const updatedImageBuffer = Buffer.from(updatedBase64Data, 'base64')
      
      try {
        const updatedImageKitResult = await uploadToImageKit({
          file: updatedImageBuffer,
          fileName: `qrcode-${code}-${Date.now()}.png`,
          folder: "/qrcodes",
          tags: ["qrcode", "eventmaster", "template"],
        })
        qrCodeData.imageKitUrl = updatedImageKitResult.url
        qrCodeData.imageKitFileId = updatedImageKitResult.fileId
        qrCodeData.imageKitThumbnailUrl = updatedImageKitResult.thumbnailUrl
        qrCodeData.image = updatedQrCodeDataUrl
      } catch (e) {
        console.error("Erreur upload QR code mis à jour:", e)
      }
    }

    // Créer le QR code dans la base de données
    const qrCode = await db.qrCode.create({
      data: {
        code: code!,
        type: type as any,
        data: qrCodeData,
        templateData: templateData,
        folderId: folderId || null,
        userId: userId,
        scanned: false,
      },
      include: {
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
        name: name,
        type: qrCode.type,
        image: imageKitUrl || qrCodeDataUrl,
        imageKitUrl: imageKitUrl,
        imageKitFileId: imageKitFileId,
        url: finalData,
        folder: qrCode.folder,
        createdAt: qrCode.createdAt.toISOString(),
      }
    }, { status: 201 })

  } catch (error) {
    console.error("Erreur lors de la génération du QR code:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de la génération du QR code" },
      { status: 500 }
    )
  }
}

