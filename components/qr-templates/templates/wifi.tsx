"use client"

import { useQRTemplateStore, WifiData } from "@/lib/stores/qr-template-store"
import { getTypographyStyle } from "../utils/font-utils"

export function WifiTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as WifiData

  const typographyStyle = getTypographyStyle(globalConfig)
  
  // Couleur primaire pour les boutons (violet/bleu clair comme sur iOS)
  const primaryColor = globalConfig.primaryColor || '#6366F1'
  const lightPrimaryColor = globalConfig.secondaryColor || '#818CF8'

  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : { 
        background: 'linear-gradient(to bottom, #F3F4F6 0%, #FFFFFF 15%, #FFFFFF 85%, #F3F4F6 100%)'
      }

  return (
    <div 
      className="w-full min-h-full flex flex-col"
      style={{
        ...backgroundStyle,
        ...typographyStyle,
      }}
    >
      {/* Contenu centré style iOS */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        {/* Grande icône WiFi (4 arcs concentriques style iOS) */}
        <div className="mb-12 flex items-center justify-center">
          <svg 
            width="100" 
            height="100" 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-400"
          >
            {/* Point central (en bas) */}
            <circle
              cx="50"
              cy="85"
              r="2.5"
              fill="currentColor"
              opacity="0.4"
            />
            {/* Arc 1 (le plus petit, en haut) */}
            <path
              d="M 45 75 Q 50 70 55 75"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
            {/* Arc 2 */}
            <path
              d="M 35 80 Q 50 60 65 80"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
            {/* Arc 3 */}
            <path
              d="M 25 85 Q 50 50 75 85"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
            {/* Arc 4 (le plus grand) */}
            <path
              d="M 15 90 Q 50 40 85 90"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Texte de prompt */}
        <div className="text-center mb-8">
          <p className="text-base text-gray-900 mb-2" style={typographyStyle}>
            Rejoindre le réseau Wi-Fi
          </p>
          <p className="text-base text-gray-900 font-medium" style={typographyStyle}>
            « {data.networkName || "Nom du réseau"} » ?
          </p>
        </div>

        {/* Bouton principal "Se connecter" */}
        <button
          className="w-full max-w-sm rounded-xl py-4 font-semibold text-base text-white transition-all active:opacity-80 shadow-sm mb-3"
          style={{ 
            backgroundColor: primaryColor,
            ...typographyStyle
          }}
        >
          Se connecter
        </button>

        {/* Bouton secondaire "Fermer" */}
        <button
          className="w-full max-w-sm rounded-xl py-4 font-semibold text-base bg-white border-2 transition-all active:opacity-80"
          style={{ 
            borderColor: lightPrimaryColor,
            color: lightPrimaryColor,
            ...typographyStyle
          }}
        >
          Fermer
        </button>

        {/* Informations de sécurité (optionnel, en bas) */}
        {data.securityType && data.securityType !== 'None' && (
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500" style={typographyStyle}>
              Sécurité : {data.securityType}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

