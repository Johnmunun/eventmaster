import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// PATCH - Mettre à jour le scan d'un QR code
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const qrCodeId = resolvedParams.id

    // Mettre à jour le scan (sans authentification car c'est public)
    const qrCode = await db.qrCode.update({
      where: {
        id: qrCodeId,
      },
      data: {
        scanned: true,
        scannedAt: new Date(),
      },
      select: {
        id: true,
        scanned: true,
        scannedAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      qrCode,
    })
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du scan:", error)
    
    // Si le QR code n'existe pas par ID, essayer par code
    try {
      const resolvedParams = await params
      const code = resolvedParams.id
      
      const qrCode = await db.qrCode.update({
        where: {
          code: code,
        },
        data: {
          scanned: true,
          scannedAt: new Date(),
        },
        select: {
          id: true,
          scanned: true,
          scannedAt: true,
        }
      })

      return NextResponse.json({
        success: true,
        qrCode,
      })
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "QR code non trouvé" },
        { status: 404 }
      )
    }
  }
}



