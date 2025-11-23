'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, Sparkles } from 'lucide-react'
import { ScrollReveal } from './scroll-reveal'

const features = [
  'QR codes illimités',
  'Événements illimités',
  'QR personnalisés avec cadres et logos',
  'Invitations digitales',
  'Dashboard analytics complet',
  'Export HD (PNG, SVG, PDF)',
  'Gestion des invités',
  'Scanner intégré',
  'Support par email',
  'Mises à jour gratuites',
]

export function LandingPricingSection() {
  return (
    <section id="tarifs" className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-orange-50/30 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Background decoration with gradient circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-[#FF6A33]/10 via-[#FF6A33]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF6A33]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#FF6A33]/5 to-transparent rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-8 sm:mb-10 md:mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-[#FF6A33]/20 rounded-full text-sm font-medium text-[#FF6A33] shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Essai gratuit • Période limitée</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              Un seul plan.{' '}
              <span className="bg-gradient-to-r from-[#FF6A33] via-[#FF7033] to-[#FF8A3D] bg-clip-text text-transparent">
                Commencez gratuitement.
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Profitez d'une période d'essai gratuite pour découvrir toutes les fonctionnalités.
              <span className="block mt-2 font-semibold text-[#FF6A33]">
                Après la période d'essai, un abonnement sera requis.
              </span>
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="max-w-5xl mx-auto">
            <div className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl border-2 border-[#FF6A33]/30 dark:border-[#FF6A33]/30 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(255,106,51,0.3)] p-8 sm:p-10 md:p-12 lg:p-16 transition-all duration-500 hover:scale-[1.02]">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6A33] via-[#FF7033] to-[#FF8A3D] rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 -z-10" />
            
            {/* Badge - Better styled */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF6A33] via-[#FF7033] to-[#FF8A3D] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg">
              Plan Unique • Essai Gratuit
            </div>

            <div className="pt-6 sm:pt-8 space-y-8 sm:space-y-10">
              {/* Price - Larger and more impactful */}
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl sm:text-7xl md:text-8xl font-bold bg-gradient-to-r from-[#FF6A33] to-[#FF8A3D] bg-clip-text text-transparent">$0</span>
                  <span className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-400">/mois</span>
                </div>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-3">
                  Gratuit pendant la période d'essai
                </p>
              </div>

              {/* CTA with enhanced styling */}
              <div className="text-center">
                <Link href="/signup" className="inline-block">
                  <Button 
                    size="lg"
                    className="group relative bg-gradient-to-r from-[#FF6A33] via-[#FF7033] to-[#FF8A3D] hover:from-[#FF5A23] hover:via-[#FF6023] hover:to-[#FF7A2D] text-white rounded-2xl px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-semibold shadow-lg hover:shadow-2xl hover:shadow-[#FF6A33]/30 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 w-full sm:w-auto"
                  >
                    <span className="relative z-10">Commencer l'essai gratuit</span>
                    <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF6A33] to-[#FF8A3D] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                  </Button>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Inscription en 30 secondes
                </p>
              </div>

              {/* Features List - Better organized */}
              <div className="pt-8 sm:pt-10 border-t border-gray-200/60 dark:border-gray-700/60">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
                  Tout ce qui est inclus :
                </h3>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 group/item">
                      <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#FF6A33]/20 to-[#FF8A3D]/20 dark:from-[#FF6A33]/30 dark:to-[#FF8A3D]/30 flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                        <Check className="w-4 h-4 text-[#FF6A33]" strokeWidth={3} />
                      </div>
                      <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="pt-6 sm:pt-8 text-center space-y-2">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  ✓ Accès complet pendant l'essai
                </p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  ✓ Toutes les fonctionnalités incluses
                </p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  ✓ Abonnement requis après la période d'essai
                </p>
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
