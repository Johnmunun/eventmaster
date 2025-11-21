import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"
import { isDatabaseConnectionError, getDatabaseErrorMessage } from "@/lib/db-utils"

// PATCH - Mettre à jour le scan d'un QR code
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const qrCodeId = resolvedParams.id

    // Mettre à jour le scan (sans authentification car c'est public)
    // Utiliser updateMany pour éviter les erreurs si le QR code n'existe pas
    const result = await db.qrCode.updateMany({
      where: {
        id: qrCodeId,
      },
      data: {
        scanned: true,
        scannedAt: new Date(),
      },
    })

    // Si aucun QR code n'a été mis à jour, essayer par code
    if (result.count === 0) {
      const codeResult = await db.qrCode.updateMany({
        where: {
          code: qrCodeId,
        },
        data: {
          scanned: true,
          scannedAt: new Date(),
        },
      })

      if (codeResult.count === 0) {
        return NextResponse.json(
          { success: false, error: "QR code non trouvé" },
          { status: 404 }
        )
      }

      // Récupérer le QR code mis à jour pour la réponse
      const qrCode = await db.qrCode.findFirst({
        where: { code: qrCodeId },
        select: {
          id: true,
          scanned: true,
          scannedAt: true,
        },
      })

      return NextResponse.json({
        success: true,
        qrCode,
      })
    }

    // Récupérer le QR code mis à jour pour la réponse
    const qrCode = await db.qrCode.findUnique({
      where: { id: qrCodeId },
      select: {
        id: true,
        scanned: true,
        scannedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      qrCode,
    })
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du scan:", error)
    
    // Gérer les erreurs de connexion à la base de données
    if (isDatabaseConnectionError(error)) {
      return NextResponse.json(
        { success: false, error: getDatabaseErrorMessage(error) },
        { status: 503 }
      )
    }

    // Gérer les erreurs Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        // Record not found
        return NextResponse.json(
          { success: false, error: "QR code non trouvé" },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour du scan" },
      { status: 500 }
    )
  }
}



