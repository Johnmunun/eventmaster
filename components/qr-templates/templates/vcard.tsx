"use client"

import { useQRTemplateStore, VCardData } from "@/lib/stores/qr-template-store"
import { Phone, Mail, MapPin, User } from "lucide-react"
import { getTypographyStyle } from "../utils/font-utils"
import { getImageBorderStyle } from "../utils/image-utils"

export function VCardTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as VCardData

  const typographyStyle = getTypographyStyle(globalConfig)
  const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || "Nom complet"

  // Dégradé par défaut (teal/vert clair vers bleu) ou couleur personnalisée
  const defaultGradient = 'linear-gradient(to bottom, #7DD3FC 0%, #3B82F6 100%)'
  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : { background: defaultGradient }

  // Couleur pour les icônes (bleu clair)
  const iconBgColor = '#93C5FD'

  return (
    <div 
      className="w-full min-h-full flex flex-col"
      style={{ 
        ...backgroundStyle, 
        color: '#FFFFFF',
        ...typographyStyle 
      }}
    >
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col items-center pt-12 pb-8 px-6">
        {/* Photo de profil circulaire avec bordure blanche */}
        <div className="mb-6">
          {data.profileImage ? (
            <div className="relative">
              <img 
                src={data.profileImage} 
                alt="Profile" 
                className="w-28 h-28 rounded-full border-2 border-white object-cover shadow-lg"
                style={getImageBorderStyle(globalConfig).style}
              />
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full bg-white/20 border-2 border-white flex items-center justify-center shadow-lg">
              <User className="w-14 h-14 text-white/80" />
            </div>
          )}
        </div>

        {/* Nom */}
        <h1 className="text-2xl font-bold text-center mb-2 text-white" style={typographyStyle}>
          {fullName}
        </h1>

        {/* Titre/Poste */}
        {data.jobTitle && (
          <p className="text-base text-center text-white/90 mb-8" style={typographyStyle}>
            {data.jobTitle}
          </p>
        )}

        {/* Icônes de contact circulaires */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {data.phone && (
            <a
              href={`tel:${data.phone}`}
              className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center transition-all active:scale-95"
              style={{ backgroundColor: iconBgColor }}
            >
              <Phone className="w-6 h-6 text-white" />
            </a>
          )}
          {data.email && (
            <a
              href={`mailto:${data.email}`}
              className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center transition-all active:scale-95"
              style={{ backgroundColor: iconBgColor }}
            >
              <Mail className="w-6 h-6 text-white" />
            </a>
          )}
          {data.website && (
            <a
              href={data.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center transition-all active:scale-95"
              style={{ backgroundColor: iconBgColor }}
            >
              <MapPin className="w-6 h-6 text-white" />
            </a>
          )}
        </div>

        {/* Description */}
        {data.description && (
          <p className="text-sm text-center text-white/90 mb-8 px-4 leading-relaxed" style={typographyStyle}>
            {data.description}
          </p>
        )}

        {/* Section téléphone en bas */}
        {data.phone && (
          <div className="w-full max-w-sm mt-auto">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="w-5 h-5 text-white/80" />
              <span className="text-xs text-white/80 uppercase tracking-wide" style={typographyStyle}>
                Téléphone
              </span>
            </div>
            <p className="text-lg font-semibold text-white" style={typographyStyle}>
              {data.phone}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
