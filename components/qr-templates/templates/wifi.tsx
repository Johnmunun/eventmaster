"use client"

import { useQRTemplateStore, WifiData } from "@/lib/stores/qr-template-store"
import { getTypographyStyle } from "../utils/font-utils"
import { Wifi, Lock } from "lucide-react"

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
        background: 'linear-gradient(to bottom, #F8F9FA 0%, #FFFFFF 20%, #FFFFFF 80%, #F8F9FA 100%)'
      }

  return (
    <div 
      className="w-full min-h-full flex flex-col relative"
      style={{
        ...backgroundStyle,
        ...typographyStyle,
      }}
    >
      {/* Effet de brillance subtil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      {/* Contenu centré style iOS moderne */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 relative z-10">
        {/* Grande icône WiFi avec animation */}
        <div className="mb-16 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative">
            <svg 
              width="120" 
              height="120" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-blue-500"
            >
              {/* Point central (en bas) */}
              <circle
                cx="50"
                cy="85"
                r="3"
                fill="currentColor"
                opacity="0.6"
              />
              {/* Arc 1 (le plus petit, en haut) */}
              <path
                d="M 45 75 Q 50 70 55 75"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                opacity="0.7"
              />
              {/* Arc 2 */}
              <path
                d="M 35 80 Q 50 60 65 80"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                opacity="0.8"
              />
              {/* Arc 3 */}
              <path
                d="M 25 85 Q 50 50 75 85"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                opacity="0.9"
              />
              {/* Arc 4 (le plus grand) */}
              <path
                d="M 15 90 Q 50 40 85 90"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                opacity="1"
              />
            </svg>
          </div>
        </div>

        {/* Texte de prompt avec design moderne */}
        <div className="text-center mb-10">
          <p className="text-lg text-gray-800 mb-3 font-medium" style={typographyStyle}>
            Rejoindre le réseau Wi-Fi
          </p>
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200">
            <Wifi className="w-5 h-5 text-gray-600" />
            <p className="text-lg text-gray-900 font-semibold" style={typographyStyle}>
              {data.networkName || "Nom du réseau"}
            </p>
          </div>
        </div>

        {/* Bouton principal "Se connecter" avec effet moderne */}
        <button
          className="w-full max-w-sm rounded-2xl py-5 font-semibold text-base text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl mb-4 relative overflow-hidden group"
          style={{ 
            backgroundColor: primaryColor,
            ...typographyStyle
          }}
        >
          <span className="relative z-10">Se connecter</span>
          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
        </button>

        {/* Bouton secondaire "Fermer" */}
        <button
          className="w-full max-w-sm rounded-2xl py-5 font-semibold text-base bg-white border-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md"
          style={{ 
            borderColor: lightPrimaryColor,
            color: lightPrimaryColor,
            ...typographyStyle
          }}
        >
          Fermer
        </button>

        {/* Informations de sécurité avec design moderne */}
        {data.securityType && data.securityType !== 'None' && (
          <div className="mt-10 flex items-center justify-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 shadow-sm">
            <Lock className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-600 font-medium" style={typographyStyle}>
              Sécurité : {data.securityType}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

