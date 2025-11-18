"use client"

import { useQRTemplateStore, ProfilData } from "@/lib/stores/qr-template-store"
import { Instagram, Facebook, Youtube, Music, Link as LinkIcon } from "lucide-react"
import { getTypographyStyle } from "../utils/font-utils"
import { getImageBorderStyle } from "../utils/image-utils"

export function ProfilTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as ProfilData

  const borderRadiusClass = {
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl',
  }[globalConfig.borderRadius]

  const typographyStyle = getTypographyStyle(globalConfig)

  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : globalConfig.coverImage
    ? { background: `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%), url(${globalConfig.coverImage}) center/cover` }
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
      {/* Header avec photo de profil */}
      <div className="flex flex-col items-center pt-12 pb-6 px-6">
        {data.profileImage ? (
          <img 
            src={data.profileImage} 
            alt="Profile" 
            className={`w-24 h-24 ${getImageBorderStyle(globalConfig).className} border-4 border-white/30 shadow-lg mb-4 object-cover`}
            style={getImageBorderStyle(globalConfig).style}
          />
        ) : (
          <div className={`w-24 h-24 ${borderRadiusClass} bg-white/20 border-4 border-white/30 shadow-lg mb-4 flex items-center justify-center`}>
            <span className="text-3xl font-bold">👤</span>
          </div>
        )}
          <h1 className="text-2xl font-bold text-center mb-2" style={typographyStyle}>{data.name || "Nom"}</h1>
        {data.description && (
          <p className="text-sm text-center opacity-90 px-4">{data.description}</p>
        )}
      </div>

      {/* Réseaux sociaux */}
      {(data.socialLinks?.instagram || data.socialLinks?.facebook || data.socialLinks?.youtube || data.socialLinks?.tiktok) && (
        <div className="flex justify-center gap-4 px-6 mb-6">
          {data.socialLinks?.instagram && (
            <a 
              href={data.socialLinks.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition backdrop-blur-sm"
            >
              <Instagram className="w-6 h-6" />
            </a>
          )}
          {data.socialLinks?.facebook && (
            <a 
              href={data.socialLinks.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition backdrop-blur-sm"
            >
              <Facebook className="w-6 h-6" />
            </a>
          )}
          {data.socialLinks?.youtube && (
            <a 
              href={data.socialLinks.youtube} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition backdrop-blur-sm"
            >
              <Youtube className="w-6 h-6" />
            </a>
          )}
          {data.socialLinks?.tiktok && (
            <a 
              href={data.socialLinks.tiktok} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition backdrop-blur-sm"
            >
              <Music className="w-6 h-6" />
            </a>
          )}
        </div>
      )}

      {/* Liens personnalisables */}
      {data.customLinks && data.customLinks.length > 0 && (
        <div className="px-6 mb-6 space-y-3">
          {data.customLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block ${borderRadiusClass} bg-white/20 backdrop-blur-sm p-4 hover:bg-white/30 transition`}
            >
              <div className="flex items-center gap-3">
                <LinkIcon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Logo en bas si présent */}
      {globalConfig.logo && (
        <div className="mt-auto px-6 pb-6 flex justify-center">
          <img 
            src={globalConfig.logo} 
            alt="Logo" 
            className="h-8 opacity-80"
          />
        </div>
      )}
    </div>
  )
}

