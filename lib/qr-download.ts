/**
 * Fonctions utilitaires pour télécharger le QR code avec cadre en PNG
 */

/**
 * Télécharger le QR code avec cadre en PNG
 * @param canvasElement - L'élément canvas contenant le QR code avec cadre
 * @param filename - Nom du fichier à télécharger (sans extension)
 */
export function downloadQRCodeAsPNG(
  canvasElement: HTMLCanvasElement,
  filename: string = "qrcode"
): void {
  try {
    // Convertir le canvas en blob
    canvasElement.toBlob((blob) => {
      if (!blob) {
        console.error("Impossible de créer le blob depuis le canvas")
        return
      }

      // Créer un lien de téléchargement
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${filename}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Libérer l'URL
      setTimeout(() => URL.revokeObjectURL(url), 100)
    }, "image/png")
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error)
    throw error
  }
}

/**
 * Télécharger le QR code avec cadre depuis un élément div/conteneur
 * @param containerElement - L'élément conteneur (div) contenant le QR code avec cadre
 * @param filename - Nom du fichier à télécharger (sans extension)
 */
export async function downloadQRCodeFromContainer(
  containerElement: HTMLElement,
  filename: string = "qrcode"
): Promise<void> {
  try {
    // Utiliser html2canvas pour capturer le contenu
    const html2canvas = (await import("html2canvas")).default

    const canvas = await html2canvas(containerElement, {
      backgroundColor: "#ffffff",
      scale: 2, // Haute résolution
      logging: false,
      useCORS: true,
      allowTaint: true,
    })

    downloadQRCodeAsPNG(canvas, filename)
  } catch (error) {
    console.error("Erreur lors du téléchargement depuis le conteneur:", error)
    throw error
  }
}

/**
 * Télécharger le QR code avec cadre depuis une URL d'image
 * @param imageUrl - URL de l'image (data URL ou URL)
 * @param filename - Nom du fichier à télécharger (sans extension)
 */
export async function downloadQRCodeFromImage(
  imageUrl: string,
  filename: string = "qrcode"
): Promise<void> {
  try {
    const img = new Image()
    img.crossOrigin = "anonymous"

    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = imageUrl
    })

    // Créer un canvas et dessiner l'image
    const canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("Impossible d'obtenir le contexte du canvas")
    }

    ctx.drawImage(img, 0, 0)
    downloadQRCodeAsPNG(canvas, filename)
  } catch (error) {
    console.error("Erreur lors du téléchargement depuis l'image:", error)
    throw error
  }
}


