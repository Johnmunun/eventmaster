'use client'

import { useState, useEffect } from 'react'
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

const testimonials = [
  {
    name: 'Sophie Martin',
    role: 'Wedding Planner',
    company: 'Élégance Événements',
    content: 'EventMaster a révolutionné notre façon de gérer les invitations de mariages. Les QR codes personnalisés ajoutent une touche premium que nos clients adorent !',
    rating: 5,
    image: '/professional-woman-wedding-planner.jpg',
  },
  {
    name: 'Thomas Dubois',
    role: 'Directeur d\'événements',
    company: 'TechConf Paris',
    content: 'La gestion des 3000 participants de notre conférence annuelle est devenue un jeu d\'enfant. Le scanner QR est ultra-rapide et le tableau de bord nous donne une vue complète en temps réel.',
    rating: 5,
    image: '/professional-man-event-director.jpg',
  },
  {
    name: 'Marie Lambert',
    role: 'Responsable Marketing',
    company: 'Luxe Hôtel & Spa',
    content: 'Nous utilisons EventMaster pour tous nos événements corporate. L\'automatisation des invitations nous fait gagner un temps précieux et l\'interface est magnifique.',
    rating: 5,
    image: '/professional-woman-marketing-manager.jpg',
  },
  {
    name: 'Alexandre Chen',
    role: 'Chef de projet',
    company: 'Innovation Labs',
    content: 'L\'IA pour le placement des invités est bluffante ! Elle a parfaitement organisé nos tables en tenant compte de toutes nos contraintes. Un outil indispensable.',
    rating: 5,
    image: '/professional-project-manager.png',
  },
  {
    name: 'Isabelle Rousseau',
    role: 'Directrice des opérations',
    company: 'Grand Palais Events',
    content: 'La personnalisation des QR codes avec nos logos est un vrai plus. Nos clients sont impressionnés par le niveau de détail et la qualité professionnelle.',
    rating: 5,
    image: '/professional-woman-operations-director.png',
  },
  {
    name: 'Lucas Moreau',
    role: 'Organisateur d\'événements',
    company: 'Festival Arts & Culture',
    content: 'Gérer 5000 billets n\'a jamais été aussi simple. Le système est robuste, intuitif et le support client est exceptionnel. Je recommande à 100%!',
    rating: 5,
    image: '/professional-man-festival-organizer.jpg',
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Quote className="w-4 h-4" />
            Témoignages clients
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Ils nous font confiance
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Découvrez comment EventMaster transforme la gestion d'événements pour des milliers de professionnels
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white border border-border rounded-3xl p-8 md:p-12 shadow-xl">
            <Quote className="absolute top-8 left-8 w-12 h-12 text-primary/20" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonials[currentIndex].rating
                        ? 'fill-orange-400 text-orange-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-xl md:text-2xl text-foreground leading-relaxed font-medium italic">
                "{testimonials[currentIndex].content}"
              </p>
              
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-orange-400/20 flex items-center justify-center text-2xl font-bold text-primary">
                  {testimonials[currentIndex].name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-lg text-foreground">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonials[currentIndex].role}
                  </div>
                  <div className="text-sm text-primary font-semibold">
                    {testimonials[currentIndex].company}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                className="rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-primary w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Aller au témoignage ${index + 1}`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center space-y-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="text-3xl md:text-4xl font-bold text-primary">10k+</div>
              <div className="text-sm text-muted-foreground">Événements créés</div>
            </div>
            <div className="text-center space-y-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="text-3xl md:text-4xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction client</div>
            </div>
            <div className="text-center space-y-2 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="text-3xl md:text-4xl font-bold text-primary">5M+</div>
              <div className="text-sm text-muted-foreground">QR codes générés</div>
            </div>
            <div className="text-center space-y-2 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="text-3xl md:text-4xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support disponible</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
