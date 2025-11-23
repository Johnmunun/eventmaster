'use client'

import { Shield, Zap, Palette, BarChart3 } from 'lucide-react'
import { ScrollReveal } from './scroll-reveal'

const benefits = [
  {
    icon: Shield,
    title: 'Sécurité maximale',
    description: 'Vos données et QR codes sont protégés avec un chiffrement de niveau entreprise.',
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50 to-white',
  },
  {
    icon: Zap,
    title: 'Simplicité',
    description: 'Interface intuitive, création de QR codes en quelques clics, sans compétences techniques.',
    gradient: 'from-[#FF6A33] to-[#FF8A3D]',
    bgGradient: 'from-orange-50 to-white',
  },
  {
    icon: Palette,
    title: 'Personnalisation',
    description: 'Designs, couleurs, cadres et logos personnalisables pour correspondre à votre identité.',
    gradient: 'from-purple-500 to-purple-600',
    bgGradient: 'from-purple-50 to-white',
  },
  {
    icon: BarChart3,
    title: 'Analytics avancés',
    description: 'Suivez les scans en temps réel, analysez les performances et optimisez vos événements.',
    gradient: 'from-green-500 to-green-600',
    bgGradient: 'from-green-50 to-white',
  },
]

export function BenefitsSection() {
  return (
    <section id="avantages" className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 overflow-hidden">
      {/* Background blur decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FF6A33]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#FF6A33]/5 to-transparent rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-8 sm:mb-10 md:mb-12 space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              Pourquoi choisir{' '}
              <span className="bg-gradient-to-r from-[#FF6A33] via-[#FF7033] to-[#FF8A3D] bg-clip-text text-transparent">
                EventMaster
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Une solution complète pour tous vos besoins en QR codes événementiels
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="group relative bg-gradient-to-br from-white to-orange-50/30 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200/60 dark:border-gray-700/60 hover:border-[#FF6A33]/50 dark:hover:border-[#FF6A33]/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#FF6A33]/10">
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF6A33]/0 to-[#FF6A33]/0 group-hover:from-[#FF6A33]/5 group-hover:to-transparent transition-all duration-500 -z-10" />
              
              {/* Icon with gradient circle background */}
              <div className="relative mb-6">
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-10 rounded-2xl blur-xl group-hover:opacity-20 transition-opacity duration-500`} />
                <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  <benefit.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {benefit.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {benefit.description}
              </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
