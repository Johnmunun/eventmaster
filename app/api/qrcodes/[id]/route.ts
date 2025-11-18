import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { deleteFromImageKit } from "@/lib/imagekit"

// DELETE - Supprimer un QR code
export async function DELETE(
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

    // Vérifier que le QR code existe et appartient à l'utilisateur
    const existingQRCode = await db.qrCode.findFirst({
      where: {
        id: qrCodeId,
        userId: userId,
      }
    })

    if (!existingQRCode) {
      return NextResponse.json(
        { success: false, error: "QR code non trouvé ou non autorisé" },
        { status: 404 }
      )
    }

    // Supprimer l'image d'ImageKit si elle existe
    const qrData = existingQRCode.data as any
    if (qrData?.imageKitFileId) {
      try {
        await deleteFromImageKit(qrData.imageKitFileId)
      } catch (error) {
        console.error("Erreur lors de la suppression ImageKit:", error)
        // On continue même si la suppression ImageKit échoue
      }
    }

    // Supprimer le QR code
    await db.qrCode.delete({
      where: { id: qrCodeId }
    })

    return NextResponse.json({
      success: true,
      message: "QR code supprimé avec succès"
    }, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la suppression du QR code:", error)
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de la suppression du QR code" },
      { status: 500 }
    )
  }
}

