import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import QRCode from "qrcode"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      )
    }

    const body = await request.json()
    let { data, color = "#000000", backgroundColor = "#FFFFFF", pixelShape = "square", logoBase64 } = body

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Les données sont requises" },
        { status: 400 }
      )
    }

    // Valider et corriger les couleurs hexadécimales
    const isValidHexColor = (color: string): boolean => {
      return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
    }

    if (!isValidHexColor(color)) {
      color = "#000000"
    }
    if (!isValidHexColor(backgroundColor)) {
      backgroundColor = "#FFFFFF"
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

    // Ajuster les options selon la forme des pixels
    if (pixelShape === "round") {
      // Pour des pixels ronds, on utilise rendererOpts avec des modules arrondis
      qrCodeOptions.rendererOpts = {
        ...qrCodeOptions.rendererOpts,
      }
    } else if (pixelShape === "mixed") {
      // Pour mixed, on peut utiliser une approche avec des coins arrondis
      qrCodeOptions.rendererOpts = {
        ...qrCodeOptions.rendererOpts,
      }
    }

    console.log("Génération QR avec options:", { color, backgroundColor, pixelShape })
    let qrCodeDataUrl = await QRCode.toDataURL(data, qrCodeOptions)
    console.log("QR code généré avec succès")

    // Si un logo est fourni, le superposer au centre du QR code
    if (logoBase64) {
      try {
        const sharp = require('sharp')
        
        // Convertir le QR code en buffer
        const qrBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64')
        
        // Charger le logo
        const logoBuffer = Buffer.from(logoBase64.split(',')[1], 'base64')
        
        // Redimensionner le logo (20% de la taille du QR code)
        const logoSize = 512 * 0.2
        const logoResized = await sharp(logoBuffer)
          .resize(Math.round(logoSize), Math.round(logoSize), {
            fit: 'inside',
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          })
          .png()
          .toBuffer()
        
        // Superposer le logo au centre
        const finalImage = await sharp(qrBuffer)
          .composite([{
            input: logoResized,
            top: Math.round((512 - logoSize) / 2),
            left: Math.round((512 - logoSize) / 2),
            blend: 'over'
          }])
          .png()
          .toBuffer()
        
        qrCodeDataUrl = `data:image/png;base64,${finalImage.toString('base64')}`
      } catch (logoError) {
        console.error("Erreur lors de l'ajout du logo:", logoError)
        // Continuer sans logo si l'ajout échoue
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl: qrCodeDataUrl,
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la génération de la preview:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}

