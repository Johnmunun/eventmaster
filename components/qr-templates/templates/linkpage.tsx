"use client"

import { useQRTemplateStore, LinkPageData } from "@/lib/stores/qr-template-store"
import { getTypographyStyle } from "../utils/font-utils"
import { Instagram, Facebook, Youtube, Music, Link as LinkIcon } from "lucide-react"

export function LinkPageTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as LinkPageData

  const borderRadiusClass = {
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl',
  }[globalConfig.borderRadius]

  const typographyStyle = getTypographyStyle(globalConfig)

  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : globalConfig.coverImage 
    ? { background: `linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%), url(${globalConfig.coverImage}) center/cover` }
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
      {/* Image de couverture */}
      {data.image ? (
        <div className="w-full h-48 overflow-hidden">
          <img src={data.image} alt="Cover" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500"></div>
      )}

      {/* Contenu */}
      <div className="flex-1 px-6 py-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: globalConfig.primaryColor }}>
            {data.name || "Nom"}
          </h1>
          {data.description && (
            <p className="text-sm text-gray-600">{data.description}</p>
          )}
        </div>

        {/* Liens */}
        {data.links && data.links.length > 0 && (
          <div className="space-y-3 mb-6">
            {data.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block ${borderRadiusClass} p-4 transition hover:opacity-90`}
                style={{ backgroundColor: globalConfig.primaryColor, color: '#FFFFFF' }}
              >
                <div className="flex items-center gap-3">
                  {link.icon ? (
                    <span className="text-xl">{link.icon}</span>
                  ) : (
                    <LinkIcon className="w-5 h-5" />
                  )}
                  <span className="font-medium">{link.label}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Réseaux sociaux */}
        {(data.socialLinks?.instagram || data.socialLinks?.facebook || data.socialLinks?.youtube || data.socialLinks?.tiktok) && (
          <div className="flex justify-center gap-4">
            {data.socialLinks?.instagram && (
              <a 
                href={data.socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-12 h-12 ${borderRadiusClass} flex items-center justify-center transition hover:opacity-90`}
                style={{ backgroundColor: globalConfig.secondaryColor }}
              >
                <Instagram className="w-6 h-6 text-white" />
              </a>
            )}
            {data.socialLinks?.facebook && (
              <a 
                href={data.socialLinks.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-12 h-12 ${borderRadiusClass} flex items-center justify-center transition hover:opacity-90`}
                style={{ backgroundColor: globalConfig.secondaryColor }}
              >
                <Facebook className="w-6 h-6 text-white" />
              </a>
            )}
            {data.socialLinks?.youtube && (
              <a 
                href={data.socialLinks.youtube} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-12 h-12 ${borderRadiusClass} flex items-center justify-center transition hover:opacity-90`}
                style={{ backgroundColor: globalConfig.secondaryColor }}
              >
                <Youtube className="w-6 h-6 text-white" />
              </a>
            )}
            {data.socialLinks?.tiktok && (
              <a 
                href={data.socialLinks.tiktok} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-12 h-12 ${borderRadiusClass} flex items-center justify-center transition hover:opacity-90`}
                style={{ backgroundColor: globalConfig.secondaryColor }}
              >
                <Music className="w-6 h-6 text-white" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

