"use client"

import { useQRTemplateStore, OffreData } from "@/lib/stores/qr-template-store"
import { getTypographyStyle } from "../utils/font-utils"
import { Tag, CheckCircle, Sparkles, ArrowRight } from "lucide-react"

export function OffreTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as OffreData

  const borderRadiusClass = {
    small: 'rounded-xl',
    medium: 'rounded-2xl',
    large: 'rounded-3xl',
  }[globalConfig.borderRadius]

  const typographyStyle = getTypographyStyle(globalConfig)

  const getDiscountText = () => {
    if (data.discountType === 'percentage') {
      return `-${data.discountValue}%`
    } else if (data.discountType === 'amount') {
      return `-${data.discountValue}€`
    }
    return data.discountValue
  }

  const primaryColor = globalConfig.primaryColor || '#6366F1'
  const secondaryColor = globalConfig.secondaryColor || '#8B5CF6'

  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : { background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${primaryColor} 100%)` }

  return (
    <div 
      className="w-full min-h-full flex flex-col relative overflow-hidden"
      style={{
        ...backgroundStyle,
        color: '#FFFFFF',
        ...typographyStyle,
      }}
    >
      {/* Effet de brillance animé */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Image principale avec overlay */}
      {data.image ? (
        <div className="relative w-full h-72 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 z-10"></div>
          <img src={data.image} alt="Offre" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="relative w-full h-72 bg-gradient-to-br from-yellow-400/80 via-orange-400/80 to-red-400/80 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
          <Tag className="w-24 h-24 text-white opacity-40 relative z-10" />
        </div>
      )}

      {/* Badge réduction flottant avec effet moderne */}
      <div className="px-6 -mt-12 mb-6 relative z-20">
        <div className={`${borderRadiusClass} bg-white text-center py-5 px-8 inline-block shadow-2xl transform rotate-[-2deg] relative overflow-hidden group`} style={{ color: primaryColor }}>
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-orange-100 opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Réduction</span>
            </div>
            <span className="text-5xl font-black block leading-none">{getDiscountText()}</span>
            {data.discountType === 'percentage' && (
              <span className="text-sm font-semibold opacity-80">de réduction</span>
            )}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 px-6 pb-8 relative z-10">
        <h1 className="text-3xl font-bold mb-3 drop-shadow-lg">{data.title || "Offre spéciale"}</h1>
        <p className="text-base opacity-95 mb-8 leading-relaxed px-2">{data.description || "Description de l'offre"}</p>

        {/* Conditions avec design moderne */}
        {data.conditions && (
          <div className={`${borderRadiusClass} bg-white/20 backdrop-blur-md border border-white/30 p-5 mb-8 shadow-lg`}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm opacity-95 leading-relaxed flex-1">{data.conditions}</p>
            </div>
          </div>
        )}

        {/* Bouton CTA avec effet moderne */}
        <button
          className={`group w-full ${borderRadiusClass} bg-white text-center py-5 font-bold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3 relative overflow-hidden`}
          style={{ color: primaryColor }}
        >
          <span className="relative z-10">{data.ctaText || "Obtenir mon bon"}</span>
          <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </button>
      </div>
    </div>
  )
}

