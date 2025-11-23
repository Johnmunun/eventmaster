'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { ScrollReveal } from './scroll-reveal'

export function LandingCtaSection() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-[#FF6A33]/10 via-white to-orange-50/30 dark:from-[#FF6A33]/5 dark:via-gray-950 dark:to-gray-900 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF6A33]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#FF6A33]/10 to-transparent rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-[#FF6A33]/20 rounded-full text-sm font-medium text-[#FF6A33] shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Prêt à commencer ?</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              Créez votre premier QR code{' '}
              <span className="bg-gradient-to-r from-[#FF6A33] via-[#FF7033] to-[#FF8A3D] bg-clip-text text-transparent">
                en quelques secondes
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Rejoignez des milliers d'organisateurs qui font confiance à EventMaster pour leurs événements.
              <span className="block mt-2 font-semibold text-[#FF6A33]">
                Commencez votre essai gratuit dès maintenant.
              </span>
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button 
                size="lg"
                className="group relative w-full sm:w-auto bg-gradient-to-r from-[#FF6A33] via-[#FF7033] to-[#FF8A3D] hover:from-[#FF5A23] hover:via-[#FF6023] hover:to-[#FF7A2D] text-white rounded-2xl px-8 py-6 text-base md:text-lg font-semibold shadow-lg hover:shadow-2xl hover:shadow-[#FF6A33]/30 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center">
                  Commencer l'essai gratuit
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF6A33] to-[#FF8A3D] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button 
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-2xl px-8 py-6 text-base md:text-lg font-medium border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-[#FF6A33] hover:text-[#FF6A33] hover:bg-[#FF6A33]/5 transition-all duration-300 hover:scale-[1.03]"
              >
                J'ai déjà un compte
              </Button>
            </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 pt-4">
              ✓ Inscription en 30 secondes • ✓ Support inclus • ✓ Abonnement après l'essai
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
