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

    // Supprimer tous les fichiers associés sur ImageKit
    const qrData = existingQRCode.data as any
    const templateData = existingQRCode.templateData as any
    
    // Liste des IDs de fichiers à supprimer
    const fileIdsToDelete: string[] = []
    
    // Supprimer l'image principale du QR code
    if (qrData?.imageKitFileId) {
      fileIdsToDelete.push(qrData.imageKitFileId)
    }
    
    // Supprimer le logo si présent
    if (qrData?.logoFileId) {
      fileIdsToDelete.push(qrData.logoFileId)
    }
    
    // Supprimer les fichiers depuis templateData (logos, coverImages, etc.)
    if (templateData?.uploadedFileIds && Array.isArray(templateData.uploadedFileIds)) {
      templateData.uploadedFileIds.forEach((fileInfo: { fileId: string }) => {
        if (fileInfo.fileId && !fileIdsToDelete.includes(fileInfo.fileId)) {
          fileIdsToDelete.push(fileInfo.fileId)
        }
      })
    }
    
    // Supprimer aussi depuis globalConfig si présent
    if (templateData?.globalConfig) {
      // Les URLs sont dans globalConfig mais on a besoin des IDs
      // On peut essayer de supprimer par URL si ImageKit le supporte
    }
    
    // Supprimer tous les fichiers ImageKit
    for (const fileId of fileIdsToDelete) {
      try {
        await deleteFromImageKit(fileId)
      } catch (error) {
        console.error(`Erreur lors de la suppression ImageKit pour ${fileId}:`, error)
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

