"use client"

import { useQRTemplateStore, LocalisationData } from "@/lib/stores/qr-template-store"
import { getTypographyStyle } from "../utils/font-utils"
import { MapPin, Navigation, ExternalLink } from "lucide-react"

export function LocalisationTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as LocalisationData

  const typographyStyle = getTypographyStyle(globalConfig)

  const borderRadiusClass = {
    small: 'rounded-xl',
    medium: 'rounded-2xl',
    large: 'rounded-3xl',
  }[globalConfig.borderRadius]

  const primaryColor = globalConfig.primaryColor || '#3B82F6'
  const secondaryColor = globalConfig.secondaryColor || '#60A5FA'

  const mapsUrl = data.latitude && data.longitude 
    ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address || '')}`

  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : {}

  return (
    <div 
      className={`w-full min-h-full flex flex-col relative overflow-hidden ${globalConfig.backgroundColor ? '' : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'}`}
      style={{ ...backgroundStyle, ...typographyStyle }}
    >
      {/* Effet de brillance */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      {/* Image du lieu avec overlay */}
      {data.placeImage ? (
        <div className="relative w-full h-56 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80 z-10"></div>
          <img src={data.placeImage} alt="Lieu" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="relative w-full h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80"></div>
          <MapPin className="w-20 h-20 text-white opacity-40 relative z-10" />
        </div>
      )}

      {/* Contenu */}
      <div className="flex-1 px-6 py-8 relative z-10">
        {/* Card principale avec design moderne */}
        <div className={`${borderRadiusClass} p-6 mb-6 bg-gradient-to-br shadow-xl relative overflow-hidden`} style={{ 
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          color: '#FFFFFF' 
        }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-start gap-4">
              <div className={`${borderRadiusClass} bg-white/20 backdrop-blur-sm p-4 shadow-lg`}>
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-3 drop-shadow-lg">Localisation</h1>
                <p className="text-base opacity-95 leading-relaxed">{data.address || "Adresse"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Note avec design moderne */}
        {data.note && (
          <div className={`${borderRadiusClass} bg-white/80 backdrop-blur-sm p-5 mb-6 shadow-lg border border-gray-100`}>
            <p className="text-sm text-gray-700 leading-relaxed">{data.note}</p>
          </div>
        )}

        {/* Bouton Maps avec effet moderne */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`group block ${borderRadiusClass} text-center py-5 font-bold text-base text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl relative overflow-hidden`}
          style={{ backgroundColor: primaryColor }}
        >
          <div className="relative z-10 flex items-center justify-center gap-3">
            <Navigation className="w-5 h-5" />
            <span>Ouvrir dans Maps</span>
            <ExternalLink className="w-4 h-4 opacity-70" />
          </div>
          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
        </a>
      </div>
    </div>
  )
}

