import { create } from 'zustand'

export type TemplateType = 
  | 'profil'
  | 'wifi'
  | 'localisation'
  | 'offre'
  | 'billet'
  | 'concert'
  | 'mariage'
  | 'anniversaire'
  | 'entreprise'
  | 'linkpage'
  | 'youtube'
  | 'instagram'
  | 'facebook'
  | 'vcard'
  | 'eventticket'
  | 'whatsapp'

export interface GlobalConfig {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string | null
  coverImage: string | null
  logo: string | null
  typography: 'sans' | 'serif' | 'mono' | 'times' | 'playfair' | 'montserrat' | 'roboto' | 'lato' | 'cursive'
  borderRadius: 'small' | 'medium' | 'large'
  fontWeight: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  imageBorderStyle: 'none' | 'solid' | 'dashed' | 'dotted' | 'double' | 'shadow' | 'gradient'
  imageBorderWidth: number
  imageBorderColor: string
  imageBorderRadius: 'none' | 'small' | 'medium' | 'large' | 'full'
}

export interface ProfilData {
  profileImage: string | null
  name: string
  description: string
  socialLinks: {
    instagram?: string
    tiktok?: string
    youtube?: string
    facebook?: string
  }
  customLinks: Array<{ label: string; url: string }>
}

export interface WifiData {
  networkName: string
  password: string
  securityType: 'WPA' | 'WPA2' | 'WEP' | 'None'
  message?: string
}

export interface LocalisationData {
  address: string
  latitude?: number
  longitude?: number
  placeImage?: string | null
  note?: string
}

export interface OffreData {
  image: string | null
  discountType: 'percentage' | 'amount' | 'text'
  discountValue: string
  title: string
  description: string
  conditions?: string
  ctaText: string
}

export interface BilletData {
  eventTitle: string
  date: string
  time: string
  location: string
  coverImage: string | null
  ticketCode: string
  ticketType: string
  seatInfo?: string
}

export interface ConcertData {
  artistImage: string | null
  artistName: string
  tourName?: string
  date: string
  time: string
  venue: string
  instructions?: string
  theme: 'dark' | 'flashy'
}

export interface MariageData {
  coupleImage: string | null
  name1: string
  name2: string
  date: string
  location: string
  message: string
  tablePlan?: string
  ceremonyLocation?: string
  rsvp?: boolean
}

export interface AnniversaireData {
  personImage: string | null
  personName: string
  age?: number
  date: string
  time: string
  location: string
  message: string
  program?: string
  theme: 'blue' | 'pink' | 'yellow' | 'rainbow'
}

export interface EntrepriseData {
  logo: string | null
  companyName: string
  description?: string
  services: string[]
  phone?: string
  whatsapp?: string
  email?: string
  address: string
  bannerImage?: string | null
  openingHours?: string
  ctaText?: string
  ctaUrl?: string
}

export interface LinkPageData {
  image: string | null
  name: string
  description: string
  links: Array<{ label: string; url: string; icon?: string }>
  socialLinks: {
    instagram?: string
    tiktok?: string
    youtube?: string
    facebook?: string
  }
}

export interface YouTubeData {
  url: string
  title: string
  thumbnail?: string | null
}

export interface InstagramData {
  username: string
  url: string
  bio: string
  profileImage?: string | null
}

export interface FacebookData {
  pageUrl: string
  pageName: string
  pageImage?: string | null
}

export interface WhatsAppData {
  phoneNumber: string
  message?: string
}

export interface VCardData {
  firstName: string
  lastName: string
  organization?: string
  jobTitle?: string
  email?: string
  phone?: string
  website?: string
  profileImage?: string | null
  description?: string
}

export interface EventTicketData {
  eventId: string
  guestId?: string
  eventTitle: string
  eventDate: string
  eventTime?: string
  eventLocation: string
  eventDescription?: string
  guestName?: string
  seatNumber?: string
  tableNumber?: string
  ticketCode: string
  ticketType: string
  coverImage?: string | null
  eventColor?: string
}

export type TemplateData = 
  | ProfilData
  | WifiData
  | LocalisationData
  | OffreData
  | BilletData
  | ConcertData
  | MariageData
  | AnniversaireData
  | EntrepriseData
  | LinkPageData
  | YouTubeData
  | InstagramData
  | FacebookData
  | VCardData
  | EventTicketData

interface QRTemplateStore {
  selectedTemplate: TemplateType | null
  globalConfig: GlobalConfig
  templateData: Partial<TemplateData>
  
  setSelectedTemplate: (template: TemplateType | null) => void
  updateGlobalConfig: (config: Partial<GlobalConfig>) => void
  updateTemplateData: (data: Partial<TemplateData>) => void
  reset: () => void
  exportToJSON: () => any
}

const defaultGlobalConfig: GlobalConfig = {
  primaryColor: '#527AC9',
  secondaryColor: '#8B5CF6',
  backgroundColor: null,
  coverImage: null,
  logo: null,
  typography: 'sans',
  borderRadius: 'medium',
  fontWeight: 'normal',
  imageBorderStyle: 'shadow',
  imageBorderWidth: 2,
  imageBorderColor: '#E5E7EB',
  imageBorderRadius: 'medium',
}

export const useQRTemplateStore = create<QRTemplateStore>((set, get) => ({
  selectedTemplate: null,
  globalConfig: defaultGlobalConfig,
  templateData: {},

  setSelectedTemplate: (template) => {
    set({ selectedTemplate: template, templateData: {} })
  },

  updateGlobalConfig: (config) => {
    set((state) => ({
      globalConfig: { ...state.globalConfig, ...config },
    }))
  },

  updateTemplateData: (data) => {
    set((state) => ({
      templateData: { ...state.templateData, ...data },
    }))
  },

  reset: () => {
    set({
      selectedTemplate: null,
      globalConfig: defaultGlobalConfig,
      templateData: {},
    })
  },

  exportToJSON: () => {
    const state = get()
    return {
      type: state.selectedTemplate,
      globalConfig: state.globalConfig,
      templateData: state.templateData,
      createdAt: new Date().toISOString(),
    }
  },
}))

