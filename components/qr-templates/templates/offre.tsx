"use client"

import { useQRTemplateStore, OffreData } from "@/lib/stores/qr-template-store"
import { getTypographyStyle } from "../utils/font-utils"
import { Tag, CheckCircle } from "lucide-react"

export function OffreTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as OffreData

  const borderRadiusClass = {
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl',
  }[globalConfig.borderRadius]

  const getDiscountText = () => {
    if (data.discountType === 'percentage') {
      return `-${data.discountValue}%`
    } else if (data.discountType === 'amount') {
      return `-${data.discountValue}€`
    }
    return data.discountValue
  }

  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : { background: `linear-gradient(135deg, ${globalConfig.primaryColor} 0%, ${globalConfig.secondaryColor} 100%)` }

  return (
    <div 
      className="w-full min-h-full flex flex-col"
      style={{
        ...backgroundStyle,
        color: '#FFFFFF',
        ...typographyStyle,
      }}
    >
      {/* Image principale */}
      {data.image ? (
        <div className="w-full h-64 overflow-hidden">
          <img src={data.image} alt="Offre" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-64 bg-white/10 flex items-center justify-center">
          <Tag className="w-20 h-20 opacity-50" />
        </div>
      )}

      {/* Badge réduction */}
      <div className="px-6 -mt-8 mb-4">
        <div className={`${borderRadiusClass} bg-white text-center py-3 px-6 inline-block shadow-lg`} style={{ color: globalConfig.primaryColor }}>
          <span className="text-3xl font-bold">{getDiscountText()}</span>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 px-6 pb-6">
        <h1 className="text-2xl font-bold mb-2">{data.title || "Offre spéciale"}</h1>
        <p className="text-sm opacity-90 mb-6 leading-relaxed">{data.description || "Description de l'offre"}</p>

        {/* Conditions */}
        {data.conditions && (
          <div className={`${borderRadiusClass} bg-white/20 backdrop-blur-sm p-4 mb-6`}>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-xs opacity-90">{data.conditions}</p>
            </div>
          </div>
        )}

        {/* Bouton CTA */}
        <button
          className={`w-full ${borderRadiusClass} bg-white text-center py-4 font-bold text-lg transition hover:opacity-90 shadow-lg`}
          style={{ color: globalConfig.primaryColor }}
        >
          {data.ctaText || "Obtenir mon bon"}
        </button>
      </div>
    </div>
  )
}

