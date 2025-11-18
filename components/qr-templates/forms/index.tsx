"use client"

import { TemplateType } from "@/lib/stores/qr-template-store"
import { ProfilForm } from "./profil-form"
import { WifiForm } from "./wifi-form"
import { LocalisationForm } from "./localisation-form"
import { OffreForm } from "./offre-form"
import { BilletForm } from "./billet-form"
import { ConcertForm } from "./concert-form"
import { MariageForm } from "./mariage-form"
import { AnniversaireForm } from "./anniversaire-form"
import { EntrepriseForm } from "./entreprise-form"
import { LinkPageForm } from "./linkpage-form"
import { YouTubeForm } from "./youtube-form"
import { InstagramForm } from "./instagram-form"
import { FacebookForm } from "./facebook-form"
import { VCardForm } from "./vcard-form"
import { EventTicketForm } from "./event-ticket-form"
import { WhatsAppForm } from "./whatsapp-form"

export function getTemplateForm(type: TemplateType | null) {
  if (!type) return null

  const forms = {
    profil: ProfilForm,
    wifi: WifiForm,
    localisation: LocalisationForm,
    offre: OffreForm,
    billet: BilletForm,
    concert: ConcertForm,
    mariage: MariageForm,
    anniversaire: AnniversaireForm,
    entreprise: EntrepriseForm,
    linkpage: LinkPageForm,
    youtube: YouTubeForm,
    instagram: InstagramForm,
    facebook: FacebookForm,
    vcard: VCardForm,
    eventticket: EventTicketForm,
    whatsapp: WhatsAppForm,
  }

  return forms[type] || null
}

