"use client"

import { useQRTemplateStore, AnniversaireData } from "@/lib/stores/qr-template-store"
import { getTypographyStyle } from "../utils/font-utils"
import { Gift, Calendar, MapPin, PartyPopper } from "lucide-react"

export function AnniversaireTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as AnniversaireData

  const borderRadiusClass = {
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl',
  }[globalConfig.borderRadius]

  const typographyStyle = getTypographyStyle(globalConfig)
  const themeColors = {
    blue: { bg: 'from-blue-400 to-blue-600', accent: '#3B82F6' },
    pink: { bg: 'from-pink-400 to-pink-600', accent: '#EC4899' },
    yellow: { bg: 'from-yellow-400 to-yellow-600', accent: '#FBBF24' },
    rainbow: { bg: 'from-purple-400 via-pink-400 to-yellow-400', accent: '#8B5CF6' },
  }[data.theme || 'blue']

  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : {}

  return (
    <div 
      className={`w-full min-h-full flex flex-col ${globalConfig.backgroundColor ? '' : `bg-gradient-to-br ${themeColors.bg}`}`}
      style={{ 
        ...backgroundStyle,
        color: '#FFFFFF',
        ...typographyStyle,
      }}
    >
      {/* Image de la personne */}
      {data.personImage ? (
        <div className="w-full h-64 overflow-hidden">
          <img src={data.personImage} alt="Personne" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-64 bg-white/20 flex items-center justify-center">
          <Gift className="w-20 h-20 opacity-50" />
        </div>
      )}

      {/* Contenu */}
      <div className="flex-1 px-6 py-6 text-center">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            Anniversaire de {data.personName || "Nom"}
          </h1>
          {data.age && (
            <div className={`${borderRadiusClass} bg-white/20 backdrop-blur-sm inline-block px-4 py-2 mb-4`}>
              <p className="text-2xl font-bold">{data.age} ans</p>
            </div>
          )}
        </div>

        {/* Message */}
        {data.message && (
          <p className="text-sm mb-6 opacity-90 leading-relaxed">{data.message}</p>
        )}

        {/* Informations */}
        <div className={`${borderRadiusClass} bg-white/20 backdrop-blur-sm p-4 mb-4`}>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="font-medium">{data.date || "Date"}</p>
                {data.time && <p className="text-sm opacity-80">{data.time}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" />
              <p className="text-sm">{data.location || "Lieu"}</p>
            </div>
          </div>
        </div>

        {/* Programme */}
        {data.program && (
          <div className={`${borderRadiusClass} bg-white/20 backdrop-blur-sm p-4 mb-4 text-left`}>
            <div className="flex items-center gap-2 mb-2">
              <PartyPopper className="w-5 h-5" />
              <p className="font-medium">Programme</p>
            </div>
            <p className="text-sm opacity-90">{data.program}</p>
          </div>
        )}

        {/* Bouton */}
        <button
          className={`w-full ${borderRadiusClass} bg-white text-center py-4 font-bold text-lg transition hover:opacity-90`}
          style={{ color: themeColors.accent }}
        >
          Confirmer ma présence
        </button>
      </div>
    </div>
  )
}

