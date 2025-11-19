"use client"

import { useQRTemplateStore, LinkPageData } from "@/lib/stores/qr-template-store"
import { getTypographyStyle } from "../utils/font-utils"
import { Instagram, Facebook, Youtube, Music, Link as LinkIcon, ArrowRight } from "lucide-react"

export function LinkPageTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as LinkPageData

  const borderRadiusClass = {
    small: 'rounded-lg',
    medium: 'rounded-xl',
    large: 'rounded-2xl',
  }[globalConfig.borderRadius]

  const typographyStyle = getTypographyStyle(globalConfig)

  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : globalConfig.coverImage 
    ? { background: `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%), url(${globalConfig.coverImage}) center/cover` }
    : { background: `linear-gradient(135deg, ${globalConfig.primaryColor || '#6366F1'} 0%, ${globalConfig.secondaryColor || '#8B5CF6'} 50%, ${globalConfig.primaryColor || '#6366F1'} 100%)` }

  return (
    <div 
      className="w-full min-h-full flex flex-col relative overflow-hidden"
      style={{
        ...backgroundStyle,
        color: '#FFFFFF',
        ...typographyStyle,
      }}
    >
      {/* Effet de brillance animé en arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Image de couverture avec overlay */}
      {data.image ? (
        <div className="relative w-full h-56 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 z-10"></div>
          <img src={data.image} alt="Cover" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="relative w-full h-56 bg-gradient-to-br from-blue-500/80 via-purple-500/80 to-pink-500/80">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
        </div>
      )}

      {/* Contenu */}
      <div className="flex-1 px-6 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3 drop-shadow-lg" style={{ color: '#FFFFFF' }}>
            {data.name || "Nom"}
          </h1>
          {data.description && (
            <p className="text-base text-white/90 leading-relaxed px-2">{data.description}</p>
          )}
        </div>

        {/* Liens avec design moderne */}
        {data.links && data.links.length > 0 && (
          <div className="space-y-3 mb-8">
            {data.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block ${borderRadiusClass} p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] backdrop-blur-sm`}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {link.icon ? (
                      <span className="text-2xl">{link.icon}</span>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <LinkIcon className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <span className="font-semibold text-base">{link.label}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Réseaux sociaux avec design moderne */}
        {(data.socialLinks?.instagram || data.socialLinks?.facebook || data.socialLinks?.youtube || data.socialLinks?.tiktok) && (
          <div className="flex justify-center gap-4">
            {data.socialLinks?.instagram && (
              <a 
                href={data.socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-14 h-14 ${borderRadiusClass} flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95 backdrop-blur-sm`}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <Instagram className="w-7 h-7 text-white" />
              </a>
            )}
            {data.socialLinks?.facebook && (
              <a 
                href={data.socialLinks.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-14 h-14 ${borderRadiusClass} flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95 backdrop-blur-sm`}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <Facebook className="w-7 h-7 text-white" />
              </a>
            )}
            {data.socialLinks?.youtube && (
              <a 
                href={data.socialLinks.youtube} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-14 h-14 ${borderRadiusClass} flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95 backdrop-blur-sm`}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <Youtube className="w-7 h-7 text-white" />
              </a>
            )}
            {data.socialLinks?.tiktok && (
              <a 
                href={data.socialLinks.tiktok} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-14 h-14 ${borderRadiusClass} flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95 backdrop-blur-sm`}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <Music className="w-7 h-7 text-white" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

