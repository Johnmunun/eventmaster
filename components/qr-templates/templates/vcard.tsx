"use client"

import { useQRTemplateStore, VCardData } from "@/lib/stores/qr-template-store"
import { Phone, Mail, MapPin, User, Globe, Briefcase } from "lucide-react"
import { getTypographyStyle } from "../utils/font-utils"
import { getImageBorderStyle } from "../utils/image-utils"

export function VCardTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as VCardData

  const typographyStyle = getTypographyStyle(globalConfig)
  const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || "Nom complet"

  // Dégradé par défaut (teal/vert clair vers bleu) ou couleur personnalisée
  const primaryColor = globalConfig.primaryColor || '#3B82F6'
  const secondaryColor = globalConfig.secondaryColor || '#7DD3FC'
  const defaultGradient = `linear-gradient(135deg, ${secondaryColor} 0%, ${primaryColor} 50%, ${secondaryColor} 100%)`
  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : { background: defaultGradient }

  // Couleur pour les icônes (bleu clair)
  const iconBgColor = 'rgba(255, 255, 255, 0.25)'

  return (
    <div 
      className="w-full min-h-full flex flex-col relative overflow-hidden"
      style={{ 
        ...backgroundStyle, 
        color: '#FFFFFF',
        ...typographyStyle 
      }}
    >
      {/* Effet de brillance animé */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col items-center pt-16 pb-10 px-6 relative z-10">
        {/* Photo de profil circulaire avec effet de halo */}
        <div className="mb-8 relative">
          {data.profileImage ? (
            <>
              <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl scale-125"></div>
              <img 
                src={data.profileImage} 
                alt="Profile" 
                className="relative w-36 h-36 rounded-full border-4 border-white/50 object-cover shadow-2xl"
                style={getImageBorderStyle(globalConfig).style}
              />
            </>
          ) : (
            <div className="relative w-36 h-36 rounded-full bg-white/20 border-4 border-white/50 flex items-center justify-center shadow-2xl backdrop-blur-sm">
              <User className="w-18 h-18 text-white/80" />
            </div>
          )}
        </div>

        {/* Nom */}
        <h1 className="text-3xl font-bold text-center mb-3 text-white drop-shadow-lg" style={typographyStyle}>
          {fullName}
        </h1>

        {/* Titre/Poste */}
        {data.jobTitle && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <Briefcase className="w-4 h-4 text-white/80" />
            <p className="text-base text-center text-white/95 font-medium" style={typographyStyle}>
              {data.jobTitle}
            </p>
          </div>
        )}

        {/* Icônes de contact circulaires avec design moderne */}
        <div className="flex items-center justify-center gap-5 mb-10">
          {data.phone && (
            <a
              href={`tel:${data.phone}`}
              className="w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/30 active:scale-95 shadow-xl backdrop-blur-md"
              style={{ backgroundColor: iconBgColor }}
            >
              <Phone className="w-7 h-7 text-white" />
            </a>
          )}
          {data.email && (
            <a
              href={`mailto:${data.email}`}
              className="w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/30 active:scale-95 shadow-xl backdrop-blur-md"
              style={{ backgroundColor: iconBgColor }}
            >
              <Mail className="w-7 h-7 text-white" />
            </a>
          )}
          {data.website && (
            <a
              href={data.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/30 active:scale-95 shadow-xl backdrop-blur-md"
              style={{ backgroundColor: iconBgColor }}
            >
              <Globe className="w-7 h-7 text-white" />
            </a>
          )}
        </div>

        {/* Description avec card moderne */}
        {data.description && (
          <div className="w-full max-w-sm mb-8 bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-lg">
            <p className="text-sm text-center text-white/95 leading-relaxed" style={typographyStyle}>
              {data.description}
            </p>
          </div>
        )}

        {/* Section téléphone en bas avec design moderne */}
        {data.phone && (
          <div className="w-full max-w-sm mt-auto bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-white/90 uppercase tracking-wide font-semibold" style={typographyStyle}>
                Téléphone
              </span>
            </div>
            <a 
              href={`tel:${data.phone}`}
              className="text-xl font-bold text-white block hover:opacity-80 transition-opacity" 
              style={typographyStyle}
            >
              {data.phone}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
