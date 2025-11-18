import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const resolvedParams = await params
    const code = resolvedParams.code

    // Récupérer le QR code par code
    const qrCode = await prisma.qrCode.findUnique({
      where: { code: code },
      select: {
        id: true,
        templateData: true,
        type: true,
      },
    })

    if (!qrCode) {
      return NextResponse.json(
        { success: false, error: "QR code introuvable" },
        { status: 404 }
      )
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


