import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const resolvedParams = await params
    const code = decodeURIComponent(resolvedParams.code)

    console.log("Recherche QR code par code:", code)

    // Récupérer le QR code par code
    const qrCode = await db.qrCode.findUnique({
      where: { code: code },
      select: {
        id: true,
        templateData: true,
        type: true,
        data: true, // Inclure les données du QR code (contient originalData, url, etc.)
      },
    })

    if (!qrCode) {
      console.error("QR code non trouvé avec le code:", code)
      return NextResponse.json(
        { success: false, error: "QR code introuvable" },
        { status: 404 }
      )
    }
    
    console.log("QR code trouvé:", qrCode.id)

    // Parser les données du QR code
    let qrCodeData: any = {}
    if (qrCode.data) {
      try {
        qrCodeData = typeof qrCode.data === 'string' 
          ? JSON.parse(qrCode.data) 
          : qrCode.data
      } catch (e) {
        console.error("Erreur parsing qrCode.data:", e)
      }
    }

    // Parser les données du template si présentes
    let templateData = null
    if (qrCode.templateData) {
      try {
        templateData = typeof qrCode.templateData === 'string' 
          ? JSON.parse(qrCode.templateData) 
          : qrCode.templateData
      } catch (e) {
        console.error("Erreur parsing templateData:", e)
      }
    }

    return NextResponse.json({
      success: true,
      qrCodeId: qrCode.id,
      qrCodeType: qrCode.type,
      qrCodeData: qrCodeData, // Contient originalData, url, etc.
      templateData: templateData || {
        type: qrCode.type,
        globalConfig: {},
        templateData: {},
      },
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la récupération du template:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}



