"use client"

import { useQRTemplateStore, MariageData } from "@/lib/stores/qr-template-store"
import { getTypographyStyle } from "../utils/font-utils"
import { getImageBorderStyle } from "../utils/image-utils"
import { Heart, Calendar, MapPin, Users } from "lucide-react"

export function MariageTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as MariageData

  const borderRadiusClass = {
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl',
  }[globalConfig.borderRadius]

  const typographyStyle = getTypographyStyle(globalConfig)

  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : { background: `linear-gradient(135deg, #FFF5F5 0%, #FFE5E5 100%)` }

  return (
    <div 
      className="w-full min-h-full flex flex-col"
      style={{
        ...backgroundStyle,
        color: '#8B4A6B',
        ...typographyStyle,
      }}
    >
      {/* Image du couple */}
      {data.coupleImage ? (
        <div className="w-full h-64 overflow-hidden">
          <img 
            src={data.coupleImage} 
            alt="Couple" 
            className={`w-full h-full object-cover ${getImageBorderStyle(globalConfig).className}`}
            style={getImageBorderStyle(globalConfig).style}
          />
        </div>
      ) : (
        <div className="w-full h-64 bg-gradient-to-br from-pink-200 to-rose-200 flex items-center justify-center">
          <Heart className="w-20 h-20 text-pink-400 opacity-50" />
        </div>
      )}

      {/* Contenu */}
      <div className="flex-1 px-6 py-6 text-center">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: globalConfig.primaryColor }}>
            {data.name1 || "Prénom 1"}
          </h1>
          <div className="flex items-center justify-center gap-2 my-3">
            <Heart className="w-6 h-6 fill-current" style={{ color: globalConfig.primaryColor }} />
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: globalConfig.primaryColor }}>
            {data.name2 || "Prénom 2"}
          </h1>
        </div>

        {/* Message */}
        {data.message && (
          <p className="text-sm mb-6 opacity-80 italic leading-relaxed">{data.message}</p>
        )}

        {/* Informations */}
        <div className={`${borderRadiusClass} bg-white/80 backdrop-blur-sm p-4 mb-4 shadow-sm`}>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" style={{ color: globalConfig.primaryColor }} />
              <div>
                <p className="font-medium">{data.date || "Date"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" style={{ color: globalConfig.primaryColor }} />
              <p className="text-sm">{data.location || "Lieu"}</p>
            </div>
            {data.ceremonyLocation && (
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" style={{ color: globalConfig.primaryColor }} />
                <p className="text-sm">Cérémonie : {data.ceremonyLocation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Plan de table */}
        {data.tablePlan && (
          <div className={`${borderRadiusClass} bg-white/80 backdrop-blur-sm p-4 mb-4 shadow-sm`}>
            <p className="text-sm font-medium mb-1">Plan de table</p>
            <p className="text-xs opacity-70">{data.tablePlan}</p>
          </div>
        )}

        {/* RSVP */}
        {data.rsvp && (
          <button
            className={`w-full ${borderRadiusClass} text-white text-center py-4 font-semibold transition hover:opacity-90`}
            style={{ backgroundColor: globalConfig.primaryColor }}
          >
            Confirmer ma présence
          </button>
        )}
      </div>
    </div>
  )
}

