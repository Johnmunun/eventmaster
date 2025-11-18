"use client"

import { useQRTemplateStore, FacebookData } from "@/lib/stores/qr-template-store"
import { Facebook } from "lucide-react"
import { getTypographyStyle } from "../utils/font-utils"

export function FacebookTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as FacebookData

  const borderRadiusClass = {
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl',
  }[globalConfig.borderRadius]

  const typographyStyle = getTypographyStyle(globalConfig)

  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : { backgroundColor: '#1877F2' }

  return (
    <div 
      className="w-full min-h-full flex flex-col"
      style={{
        ...backgroundStyle,
        color: '#FFFFFF',
        ...typographyStyle,
      }}
    >
      {/* Header avec logo Facebook */}
      <div className="flex items-center justify-center pt-8 pb-6 px-6">
        <div className="flex items-center gap-2">
          <Facebook className="w-8 h-8" fill="currentColor" />
          <span className="text-xl font-bold">Facebook</span>
        </div>
      </div>

      {/* Image de la page */}
      {data.pageImage ? (
        <div className="px-6 mb-4">
          <img 
            src={data.pageImage} 
            alt="Page" 
            className={`w-full h-48 ${borderRadiusClass} object-cover`}
          />
        </div>
      ) : (
        <div className="px-6 mb-4">
          <div className={`${borderRadiusClass} bg-white/20 h-48 flex items-center justify-center`}>
            <Facebook className="w-16 h-16 opacity-50" />
          </div>
        </div>
      )}

      {/* Nom de la page */}
      <div className="px-6 mb-6">
        <h1 className="text-2xl font-bold text-center mb-2">{data.pageName || "Nom de la page"}</h1>
      </div>

      {/* Bouton CTA */}
      <div className="px-6 mb-6">
        <a
          href={data.pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`block ${borderRadiusClass} bg-white text-center py-4 font-bold text-lg transition hover:opacity-90`}
          style={{ color: '#1877F2' }}
        >
          Voir la page
        </a>
      </div>
    </div>
  )
}

