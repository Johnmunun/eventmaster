"use client"

import { useQRTemplateStore, EntrepriseData } from "@/lib/stores/qr-template-store"
import { getTypographyStyle } from "../utils/font-utils"
import { getImageBorderStyle } from "../utils/image-utils"
import { Clock, MoreVertical, ArrowRight, Building2 } from "lucide-react"

export function EntrepriseTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as EntrepriseData

  const borderRadiusClass = {
    small: 'rounded-xl',
    medium: 'rounded-2xl',
    large: 'rounded-3xl',
  }[globalConfig.borderRadius]

  const typographyStyle = getTypographyStyle(globalConfig)

  // Couleur primaire pour le header (bleu par défaut)
  const headerColor = globalConfig.primaryColor || '#3B82F6'
  // Couleur pour le bouton CTA (vert par défaut)
  const ctaColor = globalConfig.secondaryColor || '#10B981'

  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : { backgroundColor: '#F9FAFB' }

  return (
    <div 
      className="w-full min-h-full flex flex-col relative overflow-hidden"
      style={{ ...backgroundStyle, ...typographyStyle }}
    >
      {/* Header avec gradient moderne */}
      <div 
        className="w-full py-6 px-6 flex items-center justify-center relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${headerColor} 0%, ${headerColor}dd 100%)`
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <Building2 className="w-6 h-6 text-white" />
          <h1 className="text-xl font-bold text-white text-center drop-shadow-lg" style={typographyStyle}>
            {data.companyName || "Nom de l'entreprise"}
          </h1>
        </div>
      </div>

      {/* Carte blanche principale avec design moderne */}
      <div className="flex-1 px-4 py-6">
        <div className={`bg-white ${borderRadiusClass} shadow-2xl overflow-hidden border border-gray-100`}>
          {/* Image principale avec overlay */}
          {data.bannerImage && (
            <div className="relative w-full h-56 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/30 z-10"></div>
              <img 
                src={data.bannerImage} 
                alt={data.companyName || "Image"} 
                className="w-full h-full object-cover"
                style={getImageBorderStyle(globalConfig).style}
              />
            </div>
          )}

          {/* Contenu de la carte */}
          <div className="p-6">
            {/* Titre */}
            <h2 className="text-2xl font-bold text-center mb-3 text-gray-900" style={typographyStyle}>
              {data.companyName || "Nom de l'entreprise"}
            </h2>

            {/* Description */}
            {data.description && (
              <p className="text-sm text-center text-gray-600 mb-8 leading-relaxed px-2" style={typographyStyle}>
                {data.description}
              </p>
            )}

            {/* Bouton CTA avec effet moderne */}
            {data.ctaText && (
              <div className="mb-8">
                <a
                  href={data.ctaUrl || '#'}
                  className={`group block w-full ${borderRadiusClass} text-center py-4 font-bold text-base text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl relative overflow-hidden`}
                  style={{ backgroundColor: ctaColor, ...typographyStyle }}
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <span>{data.ctaText}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </a>
              </div>
            )}

            {/* Heures d'ouverture avec design moderne */}
            {data.openingHours && (
              <div className={`flex items-start justify-between pt-6 border-t border-gray-200 bg-gray-50/50 ${borderRadiusClass} p-4`}>
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: headerColor + '15' }}>
                    <Clock className="w-5 h-5" style={{ color: headerColor }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-1" style={typographyStyle}>
                      Heures d'ouverture
                    </p>
                    <p className="text-xs text-gray-600 font-medium" style={typographyStyle}>
                      {data.openingHours}
                    </p>
                  </div>
                </div>
                <button 
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                  style={{ backgroundColor: headerColor + '15' }}
                >
                  <MoreVertical className="w-5 h-5" style={{ color: headerColor }} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

