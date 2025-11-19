"use client"

import { useQRTemplateStore, ProfilData } from "@/lib/stores/qr-template-store"
import { Instagram, Facebook, Youtube, Music, Link as LinkIcon, ArrowRight } from "lucide-react"
import { getTypographyStyle } from "../utils/font-utils"
import { getImageBorderStyle } from "../utils/image-utils"

export function ProfilTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as ProfilData

  const borderRadiusClass = {
    small: 'rounded-xl',
    medium: 'rounded-2xl',
    large: 'rounded-3xl',
  }[globalConfig.borderRadius]

  const typographyStyle = getTypographyStyle(globalConfig)

  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : globalConfig.coverImage
    ? { background: `linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%), url(${globalConfig.coverImage}) center/cover` }
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
      {/* Effet de brillance animé */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Header avec photo de profil */}
      <div className="flex flex-col items-center pt-16 pb-8 px-6 relative z-10">
        {/* Photo de profil avec effet de halo */}
        <div className="relative mb-6">
          {data.profileImage ? (
            <>
              <div className="absolute inset-0 bg-white/30 rounded-full blur-xl scale-110"></div>
              <img 
                src={data.profileImage} 
                alt="Profile" 
                className={`relative w-32 h-32 ${getImageBorderStyle(globalConfig).className} border-4 border-white/40 shadow-2xl object-cover`}
                style={getImageBorderStyle(globalConfig).style}
              />
            </>
          ) : (
            <div className={`relative w-32 h-32 ${borderRadiusClass} bg-white/20 border-4 border-white/40 shadow-2xl flex items-center justify-center backdrop-blur-sm`}>
              <span className="text-5xl">👤</span>
            </div>
          )}
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-3 drop-shadow-lg" style={typographyStyle}>
          {data.name || "Nom"}
        </h1>
        {data.description && (
          <p className="text-base text-center text-white/90 px-4 leading-relaxed max-w-sm">
            {data.description}
          </p>
        )}
      </div>

      {/* Réseaux sociaux avec design moderne */}
      {(data.socialLinks?.instagram || data.socialLinks?.facebook || data.socialLinks?.youtube || data.socialLinks?.tiktok) && (
        <div className="flex justify-center gap-4 px-6 mb-8 relative z-10">
          {data.socialLinks?.instagram && (
            <a 
              href={data.socialLinks.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300 active:scale-95 shadow-lg"
            >
              <Instagram className="w-7 h-7 text-white" />
            </a>
          )}
          {data.socialLinks?.facebook && (
            <a 
              href={data.socialLinks.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300 active:scale-95 shadow-lg"
            >
              <Facebook className="w-7 h-7 text-white" />
            </a>
          )}
          {data.socialLinks?.youtube && (
            <a 
              href={data.socialLinks.youtube} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300 active:scale-95 shadow-lg"
            >
              <Youtube className="w-7 h-7 text-white" />
            </a>
          )}
          {data.socialLinks?.tiktok && (
            <a 
              href={data.socialLinks.tiktok} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300 active:scale-95 shadow-lg"
            >
              <Music className="w-7 h-7 text-white" />
            </a>
          )}
        </div>
      )}

      {/* Liens personnalisables avec design moderne */}
      {data.customLinks && data.customLinks.length > 0 && (
        <div className="px-6 mb-6 space-y-3 relative z-10">
          {data.customLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group block ${borderRadiusClass} bg-white/15 backdrop-blur-md border border-white/20 p-4 hover:bg-white/25 hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] shadow-lg`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-base">{link.label}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Logo en bas si présent */}
      {globalConfig.logo && (
        <div className="mt-auto px-6 pb-8 flex justify-center relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-lg">
            <img 
              src={globalConfig.logo} 
              alt="Logo" 
              className="h-10 opacity-90"
            />
          </div>
        </div>
      )}
    </div>
  )
}

