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
    const password = formData.get("password") as string | null
    const pdfFile = formData.get("pdfFile") as File | null
    const images = formData.getAll("images") as File[]
    const logoFile = formData.get("logoFile") as File | null
    const qrCodeImageFile = formData.get("qrCodeImage") as File | null
    const templateDataStr = formData.get("templateData") as string | null
    const frameStyle = formData.get("frameStyle") as string | null
    const pattern = formData.get("pattern") as string | null
    const cornerStyle = formData.get("cornerStyle") as string | null

    if (!type || !name || !data) {
      return NextResponse.json(
        { success: false, error: "Type, nom et données sont requis" },
        { status: 400 }
      )
    }
    
    // Vérifier que data n'est pas "{}"
    if (data === "{}" || data.trim() === "{}") {
      console.error("Les données sont vides ({}), type:", type)
      return NextResponse.json(
        { success: false, error: "Les données du QR code sont invalides" },
        { status: 400 }
      )
    }
    
    console.log("API - Type:", type, "Name:", name, "Data (premiers 100 chars):", data?.substring(0, 100))

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

    // Générer un code unique pour le QR code (avant l'upload pour avoir le code disponible)
    let code: string = ""
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

    if (!isUnique || !code) {
      return NextResponse.json(
        { success: false, error: "Impossible de générer un code unique. Veuillez réessayer." },
        { status: 500 }
      )
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

    // Si un logo est fourni, on l'upload sur ImageKit et on sauvegarde l'URL
    let logoUrl: string | null = null
    let logoFileId: string | null = null
    if (logoFile) {
      try {
        const logoBuffer = Buffer.from(await logoFile.arrayBuffer())
        const logoResult = await uploadToImageKit({
          file: logoBuffer,
          fileName: `logo-${code}-${Date.now()}-${logoFile.name}`,
          folder: "/qrcodes/logos",
          tags: ["qrcode", "logo", "eventmaster"],
        })
        logoUrl = logoResult.url
        logoFileId = logoResult.fileId
        qrCodeOptions.logo = logoResult.url
        uploadedFiles.push(logoResult.url) // Ajouter le logo aux fichiers uploadés
      } catch (error) {
        console.error("Erreur upload logo:", error)
        // On continue sans logo si l'upload échoue
      }
    }

    // Construire l'URL finale pour le QR code
    // TOUS les QR codes doivent pointer vers /qr/${code} pour afficher le contenu dynamiquement
    // Utiliser l'URL de la requête pour obtenir le bon domaine
    let protocol = request.headers.get('x-forwarded-proto') || 'https'
    const host = request.headers.get('host') || request.headers.get('x-forwarded-host') || 'localhost:3000'
    
    // En développement local, utiliser http
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      protocol = 'http'
    }
    
    // Si NEXT_PUBLIC_APP_URL est défini, l'utiliser en priorité
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`
    // Nettoyer l'URL (enlever les trailing slashes et chemins incorrects)
    const cleanAppUrl = appUrl.replace(/\/$/, '').split('/dashboard')[0].split('/api')[0]
    const qrCodeUrl = `${cleanAppUrl}/qr/${code}`
    
    // TOUJOURS régénérer le QR code côté serveur avec la bonne URL
    // Même si une image avec frames est fournie, on doit s'assurer que l'URL encodée est correcte
    let qrCodeDataUrl: string
    try {
      // Générer le QR code avec la bonne URL (qrCodeUrl)
      const result = await QRCode.toDataURL(qrCodeUrl, qrCodeOptions) as unknown as string
      qrCodeDataUrl = result
      
      // Si une image avec frames est fournie, on peut l'utiliser pour l'apparence visuelle
      // mais le QR code doit toujours contenir la bonne URL
      // Note: Pour l'instant, on génère toujours un nouveau QR code pour garantir la bonne URL
      // TODO: Implémenter la fusion de l'image frame avec le QR code régénéré si nécessaire
    } catch (error) {
      console.error("Erreur génération QR code:", error)
      return NextResponse.json(
        { success: false, error: "Impossible de générer le QR code" },
        { status: 500 }
      )
    }

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

    // Fonction helper pour uploader une image base64 vers ImageKit
    const uploadBase64Image = async (base64Data: string, fileName: string): Promise<{ url: string; fileId: string } | null> => {
      try {
        // Convertir base64 en Buffer
        const base64Match = base64Data.match(/^data:image\/(\w+);base64,(.+)$/)
        if (!base64Match) return null
        
        const imageBuffer = Buffer.from(base64Match[2], 'base64')
        const result = await uploadToImageKit({
          file: imageBuffer,
          fileName: fileName,
          folder: "/qrcodes/templates",
          tags: ["qrcode", "template", "eventmaster"],
        })
        return { url: result.url, fileId: result.fileId }
      } catch (error) {
        console.error("Erreur upload image base64:", error)
        return null
      }
    }

    // Parser templateData si présent
    let templateData = null
    if (templateDataStr) {
      try {
        templateData = JSON.parse(templateDataStr)
        
        // Uploader les images base64 vers ImageKit et remplacer par les URLs
        const uploadedFileIds: Array<{ type: string; fileId: string }> = []
        
        // Uploader coverImage si c'est une base64
        if (templateData.globalConfig?.coverImage && templateData.globalConfig.coverImage.startsWith('data:image')) {
          const result = await uploadBase64Image(
            templateData.globalConfig.coverImage,
            `cover-${code}-${Date.now()}.png`
          )
          if (result) {
            templateData.globalConfig.coverImage = result.url
            uploadedFileIds.push({ type: 'coverImage', fileId: result.fileId })
          }
        }
        
        // Uploader logo si c'est une base64 (si pas déjà uploadé via logoFile)
        if (templateData.globalConfig?.logo && templateData.globalConfig.logo.startsWith('data:image') && !logoUrl) {
          const result = await uploadBase64Image(
            templateData.globalConfig.logo,
            `logo-${code}-${Date.now()}.png`
          )
          if (result) {
            templateData.globalConfig.logo = result.url
            uploadedFileIds.push({ type: 'logo', fileId: result.fileId })
          }
        } else if (logoUrl) {
          // Si logo a été uploadé via logoFile, utiliser cette URL
          templateData.globalConfig = templateData.globalConfig || {}
          templateData.globalConfig.logo = logoUrl
          if (logoFileId) {
            uploadedFileIds.push({ type: 'logo', fileId: logoFileId })
          }
        }
        
        // Uploader les images dans templateData (profileImage, etc.)
        if (templateData.templateData) {
          const imageFields = ['profileImage', 'coverImage', 'image', 'artistImage', 'coupleImage', 'personImage', 'bannerImage', 'placeImage']
          
          for (const field of imageFields) {
            if (templateData.templateData[field] && typeof templateData.templateData[field] === 'string' && templateData.templateData[field].startsWith('data:image')) {
              const result = await uploadBase64Image(
                templateData.templateData[field],
                `${field}-${code}-${Date.now()}.png`
              )
              if (result) {
                templateData.templateData[field] = result.url
                uploadedFileIds.push({ type: field, fileId: result.fileId })
              }
            }
          }
        }
        
        // Mettre à jour globalConfig avec les URLs des fichiers uploadés
        if (!templateData.globalConfig) {
          templateData.globalConfig = {}
        }
        
        // Si coverImage n'est pas défini et qu'on a des images uploadées, utiliser la première
        if (!templateData.globalConfig.coverImage && uploadedFiles.length > 0) {
          templateData.globalConfig.coverImage = uploadedFiles[0]
        }
        
        // Sauvegarder les IDs des fichiers ImageKit pour la suppression future
        if (imageKitFileId) {
          uploadedFileIds.push({ type: 'qrcode', fileId: imageKitFileId })
        }
        templateData.uploadedFileIds = uploadedFileIds
      } catch (e) {
        console.error("Erreur parsing templateData:", e)
      }
    }

    // Préparer les données à stocker
    // url contient l'URL de redirection (/qr/${code})
    // originalData contient les données originales (pour PDF, IMAGE, URL, etc.)
    const qrCodeData = {
      name: name,
      url: qrCodeUrl, // URL de redirection vers /qr/${code}
      originalData: finalData, // Données originales (URL du PDF, image, texte, etc.)
      type: type, // Type du QR code pour savoir comment l'afficher
      color: color,
      backgroundColor: backgroundColor,
      pixelShape: pixelShape,
      image: qrCodeDataUrl, // Garder base64 en fallback
      imageKitUrl: imageKitUrl,
      imageKitFileId: imageKitFileId,
      imageKitThumbnailUrl: imageKitThumbnailUrl,
      uploadedFiles: uploadedFiles, // Tous les fichiers uploadés (PDFs, images, logos)
      logoUrl: logoUrl, // URL du logo uploadé
      logoFileId: logoFileId, // ID ImageKit du logo pour suppression
    }

    // Créer le QR code dans la base de données
    const createData: {
      code: string
      type: any
      data: any
      folderId: string | null
      userId: string
      scanned: boolean
      password?: string
      templateData?: any
    } = {
      code: code,
      type: type as any,
      data: qrCodeData,
      folderId: folderId || null,
      userId: userId,
      scanned: false,
    }

    // Ajouter password si fourni (haché avec bcrypt)
    if (password && password.trim() !== "") {
      try {
        const bcrypt = await import('bcryptjs')
        const hashedPassword = await bcrypt.default.hash(password, 10)
        createData.password = hashedPassword
      } catch (hashError) {
        console.error("Erreur lors du hachage du mot de passe:", hashError)
        // Ne pas bloquer la création si le hachage échoue, mais logger l'erreur
      }
    }

    // Ajouter templateData seulement s'il est défini (le champ peut ne pas exister dans certaines versions du schéma)
    if (templateData !== null && templateData !== undefined) {
      createData.templateData = templateData
    }

    let qrCode
    try {
      qrCode = await db.qrCode.create({
        data: createData,
        include: {
          folder: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      })
    } catch (prismaError: any) {
      console.error("Erreur Prisma lors de la création:", prismaError)
      
      // Si l'erreur concerne le champ password, c'est que le client Prisma n'a pas été régénéré
      if (prismaError.message?.includes("password") || prismaError.message?.includes("Unknown argument")) {
        console.error("Le client Prisma n'a pas été régénéré. Exécutez: npx prisma generate")
        return NextResponse.json(
          { 
            success: false, 
            error: "Erreur de configuration: Le client Prisma doit être régénéré. Veuillez exécuter 'npx prisma generate' et redémarrer le serveur." 
          },
          { status: 500 }
        )
      }
      
      // Pour les autres erreurs Prisma
      throw prismaError
    }

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
        url: qrCodeUrl,
        qrUrl: qrCodeUrl, // URL complète pour le QR code
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

