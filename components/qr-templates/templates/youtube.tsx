"use client"

import { useQRTemplateStore, YouTubeData } from "@/lib/stores/qr-template-store"
import { Play, Youtube } from "lucide-react"
import { getTypographyStyle } from "../utils/font-utils"

export function YouTubeTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as YouTubeData

  const borderRadiusClass = {
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl',
  }[globalConfig.borderRadius]

  const typographyStyle = getTypographyStyle(globalConfig)

  // Extraire l'ID de la vidéo depuis l'URL YouTube
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const videoId = data.url ? getVideoId(data.url) : null
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : data.thumbnail

  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : { backgroundColor: '#FF0000' }

  return (
    <div 
      className="w-full min-h-full flex flex-col"
      style={{
        ...backgroundStyle,
        color: '#FFFFFF',
        ...typographyStyle,
      }}
    >
      {/* Header avec logo YouTube */}
      <div className="flex items-center justify-center pt-8 pb-4 px-6">
        <div className="flex items-center gap-2">
          <Youtube className="w-8 h-8" />
          <span className="text-xl font-bold">YouTube</span>
        </div>
      </div>

      {/* Thumbnail de la vidéo */}
      {thumbnailUrl ? (
        <div className="px-6 mb-4">
          <div className={`${borderRadiusClass} overflow-hidden relative`}>
            <img 
              src={thumbnailUrl} 
              alt="Video thumbnail" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className={`${borderRadiusClass} bg-red-600 p-4 cursor-pointer hover:bg-red-700 transition`}>
                <Play className="w-12 h-12 text-white" fill="white" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 mb-4">
          <div className={`${borderRadiusClass} bg-gray-800 h-48 flex items-center justify-center`}>
            <Play className="w-16 h-16 text-white/50" />
          </div>
        </div>
      )}

      {/* Titre */}
      <div className="px-6 mb-6">
        <h1 className="text-xl font-bold mb-2">{data.title || "Titre de la vidéo"}</h1>
      </div>

      {/* Bouton CTA */}
      <div className="px-6 mb-6">
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block ${borderRadiusClass} bg-white text-center py-4 font-bold text-lg transition hover:opacity-90`}
          style={{ color: '#FF0000' }}
        >
          Voir la vidéo
        </a>
      </div>
    </div>
  )
}

