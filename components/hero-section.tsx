'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const mockups = [
  { src: '/elegant-wedding-invitation-with-qr-code.jpg', alt: 'Invitation avec QR code' },
  { src: '/concert-ticket-with-qr-code-scanning.jpg', alt: 'Billet de concert avec QR code' },
  { src: '/conference-badge-with-qr-code-professional.jpg', alt: 'Badge professionnel avec QR code' },
]

export function HeroSection() {
  const [currentMockup, setCurrentMockup] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMockup((prev) => (prev + 1) % mockups.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="accueil" className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 overflow-hidden">
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full opacity-40 animate-float" />
      <div className="absolute top-40 left-20 w-1.5 h-1.5 bg-orange-400/30 rounded-full opacity-30 animate-float-delayed" />
      <div className="absolute bottom-40 left-32 w-1.5 h-1.5 bg-primary/20 rounded-full opacity-35 animate-float" />
      <div className="absolute top-32 right-20 w-2 h-2 bg-orange-400/30 rounded-full opacity-40 animate-float-delayed" />
      <div className="absolute bottom-32 right-40 w-1.5 h-1.5 bg-primary/20 rounded-full opacity-30 animate-float" />
      <div className="absolute top-1/2 right-10 w-1.5 h-1.5 bg-orange-400/30 rounded-full opacity-35 animate-float-delayed" />
      
      {/* Large decorative circle */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-block animate-bounce-subtle">
              <span className="text-sm font-semibold text-primary px-4 py-1.5 bg-primary/5 border border-primary/20 rounded-full inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Solution IA d'événements
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Organisez vos événements{' '}
              <span className="text-primary relative inline-block">
                comme jamais
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                  <path d="M0 4C50 2 150 6 200 4" stroke="rgb(249 115 22 / 0.3)" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>{' '}
              grâce à l'IA
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Génération de QR codes dynamiques, design automatique, suivi des présences, placement intelligent, tableaux de bord IA... tout en un seul outil.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6 sm:px-8 shadow-md hover:shadow-lg group transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                Commencez gratuitement
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="rounded-lg px-6 sm:px-8 border-2 border-border text-foreground hover:bg-muted hover:border-primary/50 transition-all duration-300 w-full sm:w-auto"
              >
                Créer mon premier événement
              </Button>
            </div>
          </div>

          <div className="relative lg:h-[500px] animate-fade-in-up animate-delay-200">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl blur-2xl" />
            <div className="relative">
              {mockups.map((mockup, index) => (
                <div
                  key={index}
                  className={`transition-opacity duration-1000 ${
                    index === currentMockup ? 'opacity-100' : 'opacity-0 absolute inset-0'
                  }`}
                >
                  <Image
                    src={mockup.src || "/placeholder.svg"}
                    alt={mockup.alt}
                    width={600}
                    height={500}
                    className="w-full h-auto rounded-2xl shadow-2xl"
                    priority={index === 0}
                  />
                </div>
              ))}
              
              {/* Slider dots */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {mockups.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMockup(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentMockup ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                    }`}
                    aria-label={`Voir mockup ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
