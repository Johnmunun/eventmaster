"use client"

import { useQRTemplateStore, EntrepriseData } from "@/lib/stores/qr-template-store"
import { getTypographyStyle } from "../utils/font-utils"
import { getImageBorderStyle } from "../utils/image-utils"
import { Clock, MoreVertical } from "lucide-react"

export function EntrepriseTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as EntrepriseData

  const borderRadiusClass = {
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl',
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
      className="w-full min-h-full flex flex-col"
      style={{ ...backgroundStyle, ...typographyStyle }}
    >
      {/* Header bleu avec titre */}
      <div 
        className="w-full py-4 px-6 flex items-center justify-center"
        style={{ backgroundColor: headerColor }}
      >
        <h1 className="text-lg font-semibold text-white text-center" style={typographyStyle}>
          {data.companyName || "Nom de l'entreprise"}
        </h1>
      </div>

      {/* Carte blanche principale */}
      <div className="flex-1 px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Image principale */}
          {data.bannerImage && (
            <div className="w-full h-48 overflow-hidden">
              <img 
                src={data.bannerImage} 
                alt={data.companyName || "Image"} 
                className="w-full h-full object-cover"
                style={getImageBorderStyle(globalConfig).style}
              />
            </div>
          )}

          {/* Contenu de la carte */}
          <div className="p-5">
            {/* Titre */}
            <h2 className="text-xl font-bold text-center mb-2 text-gray-900" style={typographyStyle}>
              {data.companyName || "Nom de l'entreprise"}
            </h2>

            {/* Description */}
            {data.description && (
              <p className="text-sm text-center text-gray-600 mb-6" style={typographyStyle}>
                {data.description}
              </p>
            )}

            {/* Bouton CTA */}
            {data.ctaText && (
              <div className="mb-6">
                <a
                  href={data.ctaUrl || '#'}
                  className="block w-full rounded-xl py-3 text-center font-semibold text-white transition-all active:opacity-90"
                  style={{ backgroundColor: ctaColor, ...typographyStyle }}
                >
                  {data.ctaText}
                </a>
              </div>
            )}

            {/* Heures d'ouverture */}
            {data.openingHours && (
              <div className="flex items-start justify-between pt-4 border-t border-gray-200">
                <div className="flex items-start gap-3 flex-1">
                  <Clock className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1" style={typographyStyle}>
                      Heures d'ouverture - Ouvert maintenant
                    </p>
                    <p className="text-xs text-gray-600" style={typographyStyle}>
                      {data.openingHours}
                    </p>
                  </div>
                </div>
                <button 
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:opacity-70"
                  style={{ backgroundColor: headerColor + '20' }}
                >
                  <MoreVertical className="w-4 h-4" style={{ color: headerColor }} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

