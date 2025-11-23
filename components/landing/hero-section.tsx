'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, QrCode, Zap, Shield } from 'lucide-react'

export function LandingHeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-white via-orange-50/30 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Enhanced background decorations with gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#FF6A33]/10 via-[#FF6A33]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#FF6A33]/10 via-[#FF6A33]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#FF6A33]/5 to-transparent rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 md:space-y-12">
          {/* Badge with glow */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-[#FF6A33]/20 rounded-full text-sm font-medium text-[#FF6A33] shadow-sm animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            <span>Essai gratuit disponible</span>
          </div>

          {/* Main Heading - Larger and with better gradient */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Créez des QR codes{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#FF6A33] via-[#FF7033] to-[#FF8A3D] bg-clip-text text-transparent">
                professionnels
              </span>
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#FF6A33]/30 via-[#FF7033]/30 to-[#FF8A3D]/30 rounded-full blur-sm" />
            </span>
            {' '}pour vos événements
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Générez et personnalisez vos codes QR en quelques secondes. 
            <span className="block mt-3 text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400">
              Design moderne, analytics avancés, gestion complète d'événements.
            </span>
          </p>

          {/* CTA Buttons with enhanced hover effects */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link href="/signup" className="w-full sm:w-auto">
              <Button 
                size="lg"
                className="group relative w-full sm:w-auto bg-gradient-to-r from-[#FF6A33] via-[#FF7033] to-[#FF8A3D] hover:from-[#FF5A23] hover:via-[#FF6023] hover:to-[#FF7A2D] text-white rounded-2xl px-8 py-6 text-base md:text-lg font-semibold shadow-lg hover:shadow-2xl hover:shadow-[#FF6A33]/30 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF6A33] to-[#FF8A3D] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
              </Button>
            </Link>
            <Link href="#fonctionnalites" className="w-full sm:w-auto">
              <Button 
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-2xl px-8 py-6 text-base md:text-lg font-medium border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-[#FF6A33] hover:text-[#FF6A33] hover:bg-[#FF6A33]/5 transition-all duration-300 hover:scale-[1.03]"
              >
                Découvrir les fonctionnalités
              </Button>
            </Link>
          </div>

          {/* Key Features Pills with better styling */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6 sm:pt-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="group flex items-center gap-2 px-4 py-2.5 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 hover:border-[#FF6A33]/30 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-300 hover:scale-105">
              <Zap className="w-4 h-4 text-[#FF6A33]" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Génération instantanée</span>
            </div>
            <div className="group flex items-center gap-2 px-4 py-2.5 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 hover:border-[#FF6A33]/30 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-300 hover:scale-105">
              <Shield className="w-4 h-4 text-[#FF6A33]" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sécurisé et fiable</span>
            </div>
            <div className="group flex items-center gap-2 px-4 py-2.5 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 hover:border-[#FF6A33]/30 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-300 hover:scale-105">
              <QrCode className="w-4 h-4 text-[#FF6A33]" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Personnalisation avancée</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
