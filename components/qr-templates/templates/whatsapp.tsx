"use client"

import { useQRTemplateStore, WhatsAppData } from "@/lib/stores/qr-template-store"
import { getTypographyStyle } from "../utils/font-utils"
import { User, Video, Phone, MoreVertical, Smile, Paperclip, Camera, Mic } from "lucide-react"

export function WhatsAppTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as WhatsAppData

  const typographyStyle = getTypographyStyle(globalConfig)

  // Format du numéro de téléphone pour l'affichage
  const formatPhoneNumber = (phone: string) => {
    // Format: 0998 655 048
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`
  }

  const displayPhone = data.phoneNumber ? formatPhoneNumber(data.phoneNumber) : "0998 655 048"
  const displayMessage = data.message || "bonjour vous allez bien"

  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : { backgroundColor: '#E5DDD5' } // Fond WhatsApp par défaut

  return (
    <div 
      className="w-full h-full flex flex-col"
      style={{ ...backgroundStyle, ...typographyStyle }}
    >
      {/* Header WhatsApp - Fixe en haut */}
      <div className="w-full bg-[#075E54] px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3 flex-1">
          {/* Icône profil */}
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-white" />
          </div>
          {/* Numéro de téléphone */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-xs truncate" style={typographyStyle}>
              {displayPhone}
            </p>
          </div>
        </div>
        {/* Icônes d'action */}
        <div className="flex items-center gap-4">
          <Video className="w-5 h-5 text-white cursor-pointer" />
          <Phone className="w-5 h-5 text-white cursor-pointer" />
          <MoreVertical className="w-5 h-5 text-white cursor-pointer" />
        </div>
      </div>

      {/* Zone de chat - Scrollable au milieu */}
      <div 
        className="flex-1 px-4 py-6 overflow-y-auto overflow-x-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='whatsapp-pattern' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='20' cy='20' r='1' fill='%23ffffff' opacity='0.05'/%3E%3Ccircle cx='80' cy='80' r='1' fill='%23ffffff' opacity='0.05'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23whatsapp-pattern)'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
          minHeight: 0
        }}
      >
        {/* Bulle de message */}
        <div className="flex justify-end mb-4">
          <div 
            className="max-w-[85%] rounded-lg px-3 py-2 shadow-sm"
            style={{ 
              backgroundColor: '#DCF8C6',
              ...typographyStyle 
            }}
          >
            <p className="text-sm text-gray-800 break-words" style={typographyStyle}>
              {displayMessage}
            </p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-[10px] text-gray-500">9:41</span>
              {/* Double coche bleue (message lu) */}
              <div className="flex items-center">
                <svg className="w-4 h-3 text-[#4FC3F7]" fill="currentColor" viewBox="0 0 16 11">
                  <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.874a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.417.417 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.175a.366.366 0 0 0-.063-.51zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.874a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.175a.365.365 0 0 0-.063-.51z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de saisie - Fixe en bas */}
      <div className="w-full bg-white px-3 py-2 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Emoji */}
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          
          {/* Champ de saisie */}
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Message"
              className="w-full bg-transparent text-sm text-gray-700 outline-none"
              style={typographyStyle}
              value={displayMessage}
              readOnly
            />
          </div>

          {/* Icônes d'action */}
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Camera className="w-5 h-5" />
          </button>
          <button 
            className="p-2 text-[#25D366] hover:text-[#20BA5A] transition-colors"
            style={{ backgroundColor: 'transparent' }}
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

