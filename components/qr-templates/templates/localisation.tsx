"use client"

import { useQRTemplateStore, LocalisationData } from "@/lib/stores/qr-template-store"
import { getTypographyStyle } from "../utils/font-utils"
import { MapPin, Navigation } from "lucide-react"

export function LocalisationTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as LocalisationData

  const borderRadiusClass = {
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl',
  }[globalConfig.borderRadius]

  const mapsUrl = data.latitude && data.longitude 
    ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address || '')}`

  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : {}

  return (
    <div 
      className={`w-full min-h-full flex flex-col ${globalConfig.backgroundColor ? '' : 'bg-gradient-to-br from-blue-50 to-white'}`}
      style={{ ...backgroundStyle, ...typographyStyle }}
    >
      {/* Image du lieu */}
      {data.placeImage ? (
        <div className="w-full h-48 overflow-hidden">
          <img src={data.placeImage} alt="Lieu" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <MapPin className="w-16 h-16 text-white opacity-50" />
        </div>
      )}

      {/* Contenu */}
      <div className="flex-1 px-6 py-8">
        <div className={`${borderRadiusClass} p-6 mb-6`} style={{ backgroundColor: globalConfig.primaryColor, color: '#FFFFFF' }}>
          <div className="flex items-start gap-4">
            <div className={`${borderRadiusClass} bg-white/20 p-3`}>
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold mb-2">Localisation</h1>
              <p className="text-sm opacity-90 leading-relaxed">{data.address || "Adresse"}</p>
            </div>
          </div>
        </div>

        {/* Note */}
        {data.note && (
          <div className={`${borderRadiusClass} bg-white p-4 mb-6 shadow-sm`}>
            <p className="text-sm text-gray-600">{data.note}</p>
          </div>
        )}

        {/* Bouton Maps */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`block ${borderRadiusClass} text-center py-4 font-semibold text-white transition hover:opacity-90`}
          style={{ backgroundColor: globalConfig.primaryColor }}
        >
          <div className="flex items-center justify-center gap-2">
            <Navigation className="w-5 h-5" />
            <span>Ouvrir dans Maps</span>
          </div>
        </a>
      </div>
    </div>
  )
}

