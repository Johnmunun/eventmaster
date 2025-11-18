"use client"

import { useQRTemplateStore, BilletData, EventTicketData } from "@/lib/stores/qr-template-store"
import { Calendar, MapPin, Ticket, CheckCircle, User, Hash } from "lucide-react"
import { getTypographyStyle } from "../utils/font-utils"

export function BilletTemplate() {
  const { globalConfig, templateData } = useQRTemplateStore()
  // Vérifier si c'est un EventTicketData ou BilletData
  const isEventTicket = 'eventId' in (templateData as any)
  const eventData = isEventTicket ? (templateData as EventTicketData) : null
  const data = isEventTicket ? null : (templateData as BilletData)

  const borderRadiusClass = {
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl',
  }[globalConfig.borderRadius]

  const typographyStyle = getTypographyStyle(globalConfig)

  // Si c'est un ticket d'événement, utiliser les données de l'événement
  if (isEventTicket && eventData) {
    const eventColor = eventData.eventColor || globalConfig.primaryColor
    const backgroundStyle = globalConfig.backgroundColor 
      ? { backgroundColor: globalConfig.backgroundColor }
      : {}

    return (
      <div 
        className={`w-full min-h-full flex flex-col ${globalConfig.backgroundColor ? '' : 'bg-gradient-to-br from-gray-50 to-white'}`}
        style={{ ...backgroundStyle, ...typographyStyle }}
      >
        {/* Image de couverture */}
        {eventData.coverImage ? (
          <div className="w-full h-48 overflow-hidden">
            <img src={eventData.coverImage} alt="Événement" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Ticket className="w-16 h-16 text-white opacity-50" />
          </div>
        )}

        {/* Contenu principal */}
        <div className="flex-1 px-6 py-6">
          <h1 className="text-2xl font-bold mb-4" style={{ color: eventColor }}>
            {eventData.eventTitle || "Titre de l'événement"}
          </h1>

          {/* Informations */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">{eventData.eventDate || "Date"}</p>
                {eventData.eventTime && <p className="text-xs text-gray-500">{eventData.eventTime}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <p className="text-sm">{eventData.eventLocation || "Lieu"}</p>
            </div>
          </div>

          {/* Description */}
          {eventData.eventDescription && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 leading-relaxed">{eventData.eventDescription}</p>
            </div>
          )}

          {/* Carte ticket style */}
          <div className={`${borderRadiusClass} border-2 border-dashed p-6 mb-6`} style={{ borderColor: eventColor }}>
            <div className="text-center mb-4">
              <p className="text-xs text-gray-500 mb-1">Code du billet</p>
              <p className="text-2xl font-mono font-bold" style={{ color: eventColor }}>
                {eventData.ticketCode || "XXXX-XXXX"}
              </p>
            </div>
            
            {eventData.guestName && (
              <div className="flex items-center justify-center gap-2 mb-3">
                <User className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-medium">{eventData.guestName}</p>
              </div>
            )}

            {eventData.ticketType && (
              <div className="text-center mb-3">
                <span className={`${borderRadiusClass} px-3 py-1 text-xs font-semibold`} style={{ backgroundColor: eventColor + '20', color: eventColor }}>
                  {eventData.ticketType}
                </span>
              </div>
            )}

            {(eventData.seatNumber || eventData.tableNumber) && (
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                {eventData.seatNumber && (
                  <div className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    <span>Place: {eventData.seatNumber}</span>
                  </div>
                )}
                {eventData.tableNumber && (
                  <div className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    <span>Table: {eventData.tableNumber}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bouton validation */}
          <button
            className={`w-full ${borderRadiusClass} text-white text-center py-4 font-semibold transition hover:opacity-90 flex items-center justify-center gap-2`}
            style={{ backgroundColor: eventColor }}
          >
            <Ticket className="w-5 h-5" />
            <span>Valider le billet</span>
          </button>
        </div>
      </div>
    )
  }

  // Template billet classique
  const backgroundStyle = globalConfig.backgroundColor 
    ? { backgroundColor: globalConfig.backgroundColor }
    : {}

  return (
    <div 
      className={`w-full min-h-full flex flex-col ${globalConfig.backgroundColor ? '' : 'bg-gradient-to-br from-gray-50 to-white'}`}
      style={{ ...backgroundStyle, ...typographyStyle }}
    >
      {/* Image de couverture */}
      {data?.coverImage ? (
        <div className="w-full h-48 overflow-hidden">
          <img src={data.coverImage} alt="Événement" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Ticket className="w-16 h-16 text-white opacity-50" />
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 px-6 py-6">
        <h1 className="text-2xl font-bold mb-4" style={{ color: globalConfig.primaryColor }}>
          {data?.eventTitle || "Titre de l'événement"}
        </h1>

        {/* Informations */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium">{data?.date || "Date"}</p>
              {data?.time && <p className="text-xs text-gray-500">{data.time}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <p className="text-sm">{data?.location || "Lieu"}</p>
          </div>
        </div>

        {/* Ticket card */}
        <div className={`${borderRadiusClass} border-2 border-dashed p-6 mb-6`} style={{ borderColor: globalConfig.primaryColor }}>
          <div className="text-center mb-4">
            <p className="text-xs text-gray-500 mb-1">Code du billet</p>
            <p className="text-2xl font-mono font-bold" style={{ color: globalConfig.primaryColor }}>
              {data?.ticketCode || "XXXX-XXXX"}
            </p>
          </div>
          {data?.ticketType && (
            <div className="text-center">
              <span className={`${borderRadiusClass} px-3 py-1 text-xs font-semibold`} style={{ backgroundColor: globalConfig.secondaryColor, color: '#FFFFFF' }}>
                {data.ticketType}
              </span>
            </div>
          )}
          {data?.seatInfo && (
            <p className="text-xs text-center text-gray-500 mt-2">{data.seatInfo}</p>
          )}
        </div>

        {/* Bouton validation */}
        <button
          className={`w-full ${borderRadiusClass} text-white text-center py-4 font-semibold transition hover:opacity-90 flex items-center justify-center gap-2`}
          style={{ backgroundColor: globalConfig.primaryColor }}
        >
          <CheckCircle className="w-5 h-5" />
          <span>Valider le billet</span>
        </button>
      </div>
    </div>
  )
}

