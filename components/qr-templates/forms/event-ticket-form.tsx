"use client"

import { useQRTemplateStore } from "@/lib/stores/qr-template-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileInput } from "@/components/ui/file-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"

export function EventTicketForm() {
  const { templateData, updateTemplateData, globalConfig } = useQRTemplateStore()
  const data = templateData as any
  const [events, setEvents] = useState<Array<{ id: string; name: string }>>([])
  const [guests, setGuests] = useState<Array<{ id: string; firstName: string; lastName: string }>>([])

  useEffect(() => {
    // Charger les événements depuis la DB
    const loadEvents = async () => {
      try {
        const response = await fetch("/api/events/list")
        const result = await response.json()
        if (result.success) {
          setEvents(result.events || [])
        }
      } catch (error) {
        console.error("Erreur lors du chargement des événements:", error)
      }
    }

    loadEvents()
  }, [])

  useEffect(() => {
    // Charger les invités quand un événement est sélectionné
    if (data.eventId) {
      const loadGuests = async () => {
        try {
          const response = await fetch(`/api/guests?eventId=${data.eventId}`)
          const result = await response.json()
          if (result.success) {
            setGuests(result.guests || [])
          } else {
            // Si l'erreur est liée à la base de données, on continue sans invités
            if (result.error?.includes("base de données") || result.error?.includes("database")) {
              console.warn("Impossible de charger les invités (problème de connexion DB):", result.error)
              setGuests([])
            } else {
              console.error("Erreur lors du chargement des invités:", result.error)
              setGuests([])
            }
          }
        } catch (error) {
          console.error("Erreur lors du chargement des invités:", error)
          // En cas d'erreur réseau ou autre, on continue sans invités
          setGuests([])
        }
      }
      loadGuests()
    } else {
      setGuests([])
    }
  }, [data.eventId])

  const handleChange = (field: string, value: any) => {
    updateTemplateData({ [field]: value })
  }

  const handleEventSelect = async (eventId: string) => {
    handleChange('eventId', eventId)
    
    // Charger les données de l'événement
    try {
      const response = await fetch(`/api/events/${eventId}`)
      const result = await response.json()
      if (result.success && result.event) {
        const event = result.event
        handleChange('eventTitle', event.name)
        // Formater la date pour l'input date (YYYY-MM-DD)
        if (event.date) {
          const date = new Date(event.date)
          if (!isNaN(date.getTime())) {
            const formattedDate = date.toISOString().split('T')[0]
            handleChange('eventDate', formattedDate)
          }
        }
        handleChange('eventLocation', event.location || '')
        handleChange('eventDescription', event.description || '')
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'événement:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Événement</Label>
        <Select
          value={data.eventId || ''}
          onValueChange={handleEventSelect}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un événement" />
          </SelectTrigger>
          <SelectContent>
            {events.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500 mt-1">
          Les données de l'événement seront pré-remplies automatiquement
        </p>
      </div>

      <div>
        <Label>Titre de l'événement</Label>
        <Input
          value={data.eventTitle || ''}
          onChange={(e) => handleChange('eventTitle', e.target.value)}
          placeholder="Titre de l'événement"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={(() => {
              if (!data.eventDate) return ''
              // Si c'est déjà au format YYYY-MM-DD, l'utiliser directement
              if (typeof data.eventDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.eventDate)) {
                return data.eventDate
              }
              // Sinon, essayer de convertir
              try {
                const date = new Date(data.eventDate)
                if (!isNaN(date.getTime())) {
                  return date.toISOString().split('T')[0]
                }
              } catch (e) {
                console.error('Erreur de conversion de date:', e)
              }
              return ''
            })()}
            onChange={(e) => handleChange('eventDate', e.target.value)}
          />
        </div>
        <div>
          <Label>Heure (optionnel)</Label>
          <Input
            type="time"
            value={data.eventTime || ''}
            onChange={(e) => handleChange('eventTime', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label>Lieu</Label>
        <Input
          value={data.eventLocation || ''}
          onChange={(e) => handleChange('eventLocation', e.target.value)}
          placeholder="Lieu de l'événement"
        />
      </div>

      <div>
        <Label>Description (optionnel)</Label>
        <Textarea
          value={data.eventDescription || ''}
          onChange={(e) => handleChange('eventDescription', e.target.value)}
          placeholder="Description de l'événement..."
          rows={3}
        />
      </div>

      <div>
        <FileInput
          label="Image de couverture (optionnel)"
          accept="image/*"
          maxSize={5}
          preview={data.coverImage || null}
          onFileChange={(file) => {
            if (file) {
              const reader = new FileReader()
              reader.onload = (event) => {
                handleChange('coverImage', event.target?.result)
              }
              reader.readAsDataURL(file)
            } else {
              handleChange('coverImage', null)
            }
          }}
          onRemove={() => handleChange('coverImage', null)}
        />
      </div>

      {data.eventId && guests.length > 0 && (
        <div>
          <Label>Invité (optionnel)</Label>
          <Select
            value={data.guestId || ''}
            onValueChange={(guestId) => {
              handleChange('guestId', guestId)
              const guest = guests.find(g => g.id === guestId)
              if (guest) {
                handleChange('guestName', `${guest.firstName} ${guest.lastName}`)
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un invité" />
            </SelectTrigger>
            <SelectContent>
              {guests.map((guest) => (
                <SelectItem key={guest.id} value={guest.id}>
                  {guest.firstName} {guest.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label>Code du billet</Label>
        <Input
          value={data.ticketCode || ''}
          onChange={(e) => handleChange('ticketCode', e.target.value)}
          placeholder="XXXX-XXXX"
        />
      </div>

      <div>
        <Label>Type de billet</Label>
        <Input
          value={data.ticketType || ''}
          onChange={(e) => handleChange('ticketType', e.target.value)}
          placeholder="VIP, Standard..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Numéro de place (optionnel)</Label>
          <Input
            value={data.seatNumber || ''}
            onChange={(e) => handleChange('seatNumber', e.target.value)}
            placeholder="A12"
          />
        </div>
        <div>
          <Label>Numéro de table (optionnel)</Label>
          <Input
            value={data.tableNumber || ''}
            onChange={(e) => handleChange('tableNumber', e.target.value)}
            placeholder="5"
          />
        </div>
      </div>

      <div>
        <Label>Couleur du thème (optionnel)</Label>
        <div className="flex gap-2 mt-2">
          <Input
            type="color"
            className="w-16 h-10 cursor-pointer"
            value={data.eventColor || globalConfig.primaryColor}
            onChange={(e) => handleChange('eventColor', e.target.value)}
          />
          <Input
            type="text"
            value={data.eventColor || ''}
            onChange={(e) => handleChange('eventColor', e.target.value)}
            placeholder="#527AC9"
          />
        </div>
      </div>
    </div>
  )
}

