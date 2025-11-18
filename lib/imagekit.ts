import ImageKit from "imagekit"

// Configuration ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
})

export interface UploadOptions {
  file: Buffer | string // Buffer pour fichier, string pour base64
  fileName: string
  folder?: string
  tags?: string[]
}

/**
 * Upload un fichier sur ImageKit
 */
export async function uploadToImageKit(options: UploadOptions): Promise<{
  url: string
  fileId: string
  thumbnailUrl: string
}> {
  try {
    const uploadOptions: any = {
      file: options.file,
      fileName: options.fileName,
      folder: options.folder || "/qrcodes",
      tags: options.tags || ["qrcode", "eventmaster"],
    }

    const result = await imagekit.upload(uploadOptions)

    return {
      url: result.url,
      fileId: result.fileId,
      thumbnailUrl: result.thumbnailUrl || result.url,
    }
  } catch (error) {
    console.error("Erreur lors de l'upload ImageKit:", error)
    throw new Error("Impossible d'uploader l'image sur ImageKit")
  }
}

/**
 * Supprimer un fichier d'ImageKit
 */
export async function deleteFromImageKit(fileId: string): Promise<boolean> {
  try {
    await imagekit.deleteFile(fileId)
    return true
  } catch (error) {
    console.error("Erreur lors de la suppression ImageKit:", error)
    return false
  }
}

/**
 * Obtenir l'URL d'une image avec transformations
 */
export function getImageKitUrl(
  fileId: string,
  transformations?: {
    width?: number
    height?: number
    quality?: number
    format?: string
  }
): string {
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || ""
  
  // ImageKit peut utiliser soit le fileId, soit le path
  // On essaie d'abord avec le fileId directement
  let url = `${urlEndpoint}/${fileId}`
  
  // Si le fileId contient déjà un chemin complet, utiliser directement
  if (fileId.startsWith("http")) {
    url = fileId
  } else if (fileId.includes("/")) {
    // Si c'est un chemin relatif
    url = `${urlEndpoint}${fileId.startsWith("/") ? "" : "/"}${fileId}`
  }
  
  if (transformations) {
    const params: string[] = []
    if (transformations.width) params.push(`w-${transformations.width}`)
    if (transformations.height) params.push(`h-${transformations.height}`)
    if (transformations.quality) params.push(`q-${transformations.quality}`)
    if (transformations.format) params.push(`f-${transformations.format}`)
    
    if (params.length > 0) {
      // ImageKit utilise le format: ?tr=w-800,q-90,f-png
      url += (url.includes("?") ? "&" : "?") + `tr=${params.join(",")}`
    }
  }
  
  return url
}

export { imagekit }

