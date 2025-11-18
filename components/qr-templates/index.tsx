"use client"

import { TemplateType } from "@/lib/stores/qr-template-store"
import { ProfilTemplate } from "./templates/profil"
import { WifiTemplate } from "./templates/wifi"
import { LocalisationTemplate } from "./templates/localisation"
import { OffreTemplate } from "./templates/offre"
import { BilletTemplate } from "./templates/billet"
import { ConcertTemplate } from "./templates/concert"
import { MariageTemplate } from "./templates/mariage"
import { AnniversaireTemplate } from "./templates/anniversaire"
import { EntrepriseTemplate } from "./templates/entreprise"
import { LinkPageTemplate } from "./templates/linkpage"
import { YouTubeTemplate } from "./templates/youtube"
import { InstagramTemplate } from "./templates/instagram"
import { FacebookTemplate } from "./templates/facebook"
import { VCardTemplate } from "./templates/vcard"
import { EventTicketTemplate } from "./templates/event-ticket"
import { WhatsAppTemplate } from "./templates/whatsapp"
import { getTemplateForm as getForm } from "./forms/index"

export function getTemplateComponent(type: TemplateType | null) {
  if (!type) return null

  const templates = {
    profil: ProfilTemplate,
    wifi: WifiTemplate,
    localisation: LocalisationTemplate,
    offre: OffreTemplate,
    billet: BilletTemplate,
    concert: ConcertTemplate,
    mariage: MariageTemplate,
    anniversaire: AnniversaireTemplate,
    entreprise: EntrepriseTemplate,
    linkpage: LinkPageTemplate,
    youtube: YouTubeTemplate,
    instagram: InstagramTemplate,
    facebook: FacebookTemplate,
    vcard: VCardTemplate,
    eventticket: EventTicketTemplate,
    whatsapp: WhatsAppTemplate,
  }

  return templates[type] || null
}

export function getTemplateForm(type: TemplateType | null) {
  return getForm(type)
}

export const TEMPLATE_OPTIONS: Array<{ value: TemplateType; label: string; description: string }> = [
  { value: 'profil', label: 'Profil', description: 'Page de profil avec réseaux sociaux' },
  { value: 'wifi', label: 'WiFi', description: 'Connexion réseau WiFi' },
  { value: 'localisation', label: 'Localisation', description: 'Adresse et carte' },
  { value: 'offre', label: 'Offre / Réduction', description: 'Promotion et coupon' },
  { value: 'billet', label: 'Billet Événement', description: 'Ticket numérique' },
  { value: 'concert', label: 'Concert', description: 'Concert et tournée' },
  { value: 'mariage', label: 'Mariage', description: 'Invitation mariage' },
  { value: 'anniversaire', label: 'Anniversaire', description: 'Fête d\'anniversaire' },
  { value: 'entreprise', label: 'Entreprise', description: 'Carte professionnelle' },
  { value: 'linkpage', label: 'Page de liens', description: 'Multi-liens personnalisés' },
]

