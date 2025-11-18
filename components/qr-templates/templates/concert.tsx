"use client"

import { useQRTemplateStore, ConcertData } from "@/lib/stores/qr-template-store"
import { getTypographyStyle } from "../utils/font-utils"
import { Music, Calendar, MapPin, Info } from "lucide-react"

export function ConcertTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as ConcertData

  const borderRadiusClass = {
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl',
  }[globalConfig.borderRadius]

  const typographyStyle = getTypographyStyle(globalConfig)
  const isDark = data.theme === 'dark'
  const defaultBgColor = isDark ? '#000000' : globalConfig.primaryColor
  const bgColor = globalConfig.backgroundColor || defaultBgColor
  const textColor = isDark ? '#FFFFFF' : '#FFFFFF'

  return (
    <div 
      className="w-full min-h-full flex flex-col"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        ...typographyStyle,
      }}
    >
      {/* Image de l'artiste */}
      {data.artistImage ? (
        <div className="w-full h-64 overflow-hidden">
          <img src={data.artistImage} alt="Artiste" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-64 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
          <Music className="w-20 h-20 opacity-50" />
        </div>
      )}

      {/* Contenu */}
      <div className="flex-1 px-6 py-6">
        <h1 className="text-3xl font-bold mb-2">{data.artistName || "Nom de l'artiste"}</h1>
        {data.tourName && (
          <p className="text-lg opacity-80 mb-6">{data.tourName}</p>
        )}

        {/* Informations */}
        <div className={`${borderRadiusClass} bg-white/10 backdrop-blur-sm p-4 mb-4`}>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="font-medium">{data.date || "Date"}</p>
                {data.time && <p className="text-sm opacity-80">{data.time}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" />
              <p className="text-sm">{data.venue || "Lieu du concert"}</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        {data.instructions && (
          <div className={`${borderRadiusClass} bg-white/10 backdrop-blur-sm p-4 mb-6`}>
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm opacity-90">{data.instructions}</p>
            </div>
          </div>
        )}

        {/* Bouton */}
        <button
          className={`w-full ${borderRadiusClass} bg-white text-center py-4 font-bold text-lg transition hover:opacity-90`}
          style={{ color: bgColor }}
        >
          Voir accès
        </button>
      </div>
    </div>
  )
}

