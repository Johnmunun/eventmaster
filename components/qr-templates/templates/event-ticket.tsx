"use client"

import { useQRTemplateStore, EventTicketData } from "@/lib/stores/qr-template-store"
import { Calendar, MapPin, Ticket, User, Hash, Clock } from "lucide-react"
import { getTypographyStyle } from "../utils/font-utils"

export function EventTicketTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  const data = templateData as EventTicketData

  const borderRadiusClass = {
    small: 'rounded-xl',
    medium: 'rounded-2xl',
    large: 'rounded-3xl',
  }[globalConfig.borderRadius]

  const typographyStyle = getTypographyStyle(globalConfig)

  const eventColor = data.eventColor || globalConfig.primaryColor || '#6366F1'

  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : {}

  return (
    <div 
      className={`w-full min-h-full flex flex-col relative overflow-hidden ${globalConfig.backgroundColor ? '' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'}`}
      style={{ ...backgroundStyle, ...typographyStyle }}
    >
      {/* Effet de brillance */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
      </div>

      {/* Image de couverture avec overlay */}
      {data.coverImage ? (
        <div className="relative w-full h-56 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80 z-10"></div>
          <img src={data.coverImage} alt="Événement" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="relative w-full h-56 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80"></div>
          <Ticket className="w-20 h-20 text-white opacity-40 relative z-10" />
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 px-6 py-8 relative z-10">
        <h1 className="text-3xl font-bold mb-6 drop-shadow-sm" style={{ color: eventColor }}>
          {data.eventTitle || "Titre de l'événement"}
        </h1>

        {/* Informations avec design moderne */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-gray-100">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: eventColor + '15' }}>
              <Calendar className="w-5 h-5" style={{ color: eventColor }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-1">{data.eventDate || "Date"}</p>
              {data.eventTime && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span>{data.eventTime}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-gray-100">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: eventColor + '15' }}>
              <MapPin className="w-5 h-5" style={{ color: eventColor }} />
            </div>
            <p className="text-sm font-semibold text-gray-900 flex-1">{data.eventLocation || "Lieu"}</p>
          </div>
        </div>

        {/* Description */}
        {data.eventDescription && (
          <div className="mb-8 bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-700 leading-relaxed">{data.eventDescription}</p>
          </div>
        )}

        {/* Carte ticket style moderne */}
        <div className={`${borderRadiusClass} border-2 border-dashed p-6 mb-6 bg-gradient-to-br from-white to-gray-50 shadow-xl relative overflow-hidden`} style={{ borderColor: eventColor }}>
          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: eventColor }}></div>
          
          <div className="text-center mb-6 mt-2">
            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Code du billet</p>
            <p className="text-3xl font-mono font-bold tracking-wider" style={{ color: eventColor }}>
              {data.ticketCode || "XXXX-XXXX"}
            </p>
          </div>
          
          {data.guestName && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: eventColor + '15' }}>
                <User className="w-4 h-4" style={{ color: eventColor }} />
              </div>
              <p className="text-sm font-semibold text-gray-900">{data.guestName}</p>
            </div>
          )}

          {data.ticketType && (
            <div className="text-center mb-4">
              <span className={`${borderRadiusClass} px-4 py-2 text-xs font-bold uppercase tracking-wide inline-block`} style={{ backgroundColor: eventColor + '20', color: eventColor }}>
                {data.ticketType}
              </span>
            </div>
          )}

          {(data.seatNumber || data.tableNumber) && (
            <div className="flex items-center justify-center gap-6 text-xs text-gray-600 pt-4 border-t border-gray-200">
              {data.seatNumber && (
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <span className="font-semibold">Place: {data.seatNumber}</span>
                </div>
              )}
              {data.tableNumber && (
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <span className="font-semibold">Table: {data.tableNumber}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bouton validation avec effet moderne */}
        <button
          className={`w-full ${borderRadiusClass} text-white text-center py-5 font-bold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl flex items-center justify-center gap-3 relative overflow-hidden group`}
          style={{ backgroundColor: eventColor }}
        >
          <Ticket className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Valider le billet</span>
          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
        </button>
      </div>
    </div>
  )
}

