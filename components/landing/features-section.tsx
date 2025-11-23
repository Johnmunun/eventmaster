'use client'

import { QrCode, Calendar, Palette, BarChart3, Download, Settings } from 'lucide-react'
import { ScrollReveal } from './scroll-reveal'

const features = [
  {
    icon: QrCode,
    title: 'Génération de QR codes',
    description: 'Créez des QR codes dynamiques et statiques pour tous types d\'événements. Personnalisez les couleurs, motifs et cadres.',
  },
  {
    icon: Calendar,
    title: 'Gestion d\'événements',
    description: 'Organisez vos événements, gérez les invités, créez des invitations digitales et suivez les présences en temps réel.',
  },
  {
    icon: Palette,
    title: 'QR moderne et personnalisable',
    description: 'Designs élégants, cadres décoratifs, logos intégrés. Créez des QR codes qui reflètent l\'identité de votre événement.',
  },
  {
    icon: BarChart3,
    title: 'Analytics en temps réel',
    description: 'Tableaux de bord détaillés, statistiques de scans, analyse des performances et rapports exportables.',
  },
  {
    icon: Download,
    title: 'Export en haute qualité',
    description: 'Téléchargez vos QR codes en PNG, SVG ou PDF haute résolution, prêts pour l\'impression professionnelle.',
  },
  {
    icon: Settings,
    title: 'Configuration avancée',
    description: 'Paramètres de correction d\'erreur, taille personnalisée, format de sortie et intégrations API disponibles.',
  },
]

export function LandingFeaturesSection() {
  return (
    <section id="fonctionnalites" className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-white dark:bg-gray-950 overflow-hidden">
      {/* Background blur decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-orange-50/20 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF6A33]/5 to-transparent rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-8 sm:mb-10 md:mb-12 space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              Fonctionnalités{' '}
              <span className="bg-gradient-to-r from-[#FF6A33] via-[#FF7033] to-[#FF8A3D] bg-clip-text text-transparent">
                complètes
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour créer et gérer des QR codes professionnels pour vos événements
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="group relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/40 dark:border-gray-800/40 hover:border-[#FF6A33]/30 dark:hover:border-[#FF6A33]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#FF6A33]/5 hover:scale-[1.02]">
              {/* Glassmorphism effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              
              {/* Icon with consistent styling */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6A33] to-[#FF8A3D] opacity-10 rounded-xl blur-lg group-hover:opacity-20 transition-opacity duration-500" />
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#FF6A33] to-[#FF8A3D] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-md">
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Content with consistent spacing */}
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
