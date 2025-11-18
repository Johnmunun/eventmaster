"use client"

import { useQRTemplateStore, InstagramData } from "@/lib/stores/qr-template-store"
import { Instagram, Heart, MessageCircle, Share2 } from "lucide-react"
import { getTypographyStyle } from "../utils/font-utils"

export function InstagramTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as InstagramData

  const borderRadiusClass = {
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl',
  }[globalConfig.borderRadius]

  const typographyStyle = getTypographyStyle(globalConfig)

  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : { background: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)' }

  return (
    <div 
      className="w-full min-h-full flex flex-col"
      style={{
        ...backgroundStyle,
        color: '#FFFFFF',
        ...typographyStyle,
      }}
    >
      {/* Header avec logo Instagram */}
      <div className="flex items-center justify-center pt-8 pb-6 px-6">
        <Instagram className="w-8 h-8" />
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        {data.profileImage ? (
          <img 
            src={data.profileImage} 
            alt="Profile" 
            className={`w-24 h-24 ${borderRadiusClass} border-4 border-white shadow-lg mb-4 object-cover`}
          />
        ) : (
          <div className={`w-24 h-24 ${borderRadiusClass} bg-white/20 border-4 border-white shadow-lg mb-4 flex items-center justify-center`}>
            <span className="text-3xl">👤</span>
          </div>
        )}
        <h1 className="text-2xl font-bold mb-2">@{data.username || "username"}</h1>
      </div>

      {/* Bio */}
      {data.bio && (
        <div className="px-6 mb-6">
          <p className="text-sm text-center opacity-90 leading-relaxed">{data.bio}</p>
        </div>
      )}

      {/* Stats (simulées) */}
      <div className="flex justify-center gap-6 px-6 mb-6">
        <div className="text-center">
          <p className="text-lg font-bold">0</p>
          <p className="text-xs opacity-80">Publications</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">0</p>
          <p className="text-xs opacity-80">Abonnés</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">0</p>
          <p className="text-xs opacity-80">Abonnements</p>
        </div>
      </div>

      {/* Bouton Suivre */}
      <div className="px-6 mb-6">
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block ${borderRadiusClass} bg-white text-center py-3 font-semibold transition hover:opacity-90`}
          style={{ color: '#833AB4' }}
        >
          Suivre sur Instagram
        </a>
      </div>
    </div>
  )
}

