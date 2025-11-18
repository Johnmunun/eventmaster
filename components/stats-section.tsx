import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { BarChart3, Target, TrendingUp, Zap } from 'lucide-react'

export function StatsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-white via-orange-50/20 to-white relative overflow-hidden">
      <div className="absolute top-10 right-10 w-32 h-32 bg-orange-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-block">
              <span className="text-sm font-semibold text-orange-600 px-4 py-1.5 bg-orange-50 border border-orange-200 rounded-full inline-flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Notre Expertise
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Pourquoi choisir{' '}
              <span className="text-primary relative inline-block">
                EventMaster
                <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                  <path d="M0 3C50 1 150 5 200 3" stroke="rgb(249 115 22 / 0.3)" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
              {' '}?
            </h2>
            
            <p className="text-muted-foreground leading-relaxed text-lg">
              Nous croyons au pouvoir des données. Notre approche basée sur l'analyse vous permet de prendre des décisions éclairées et d'optimiser vos événements pour un ROI maximal. Transformons vos données en insights actionnables.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-border hover:border-orange-400/50 transition-all duration-300 hover:shadow-md group">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Analytics Avancés</h4>
                  <p className="text-sm text-muted-foreground">Tableaux de bord en temps réel</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-border hover:border-orange-400/50 transition-all duration-300 hover:shadow-md group">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Suivi Précis</h4>
                  <p className="text-sm text-muted-foreground">Chaque scan est enregistré</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-border hover:border-orange-400/50 transition-all duration-300 hover:shadow-md group">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">ROI Optimisé</h4>
                  <p className="text-sm text-muted-foreground">Maximisez vos résultats</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-border hover:border-orange-400/50 transition-all duration-300 hover:shadow-md group">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Rapide & Efficace</h4>
                  <p className="text-sm text-muted-foreground">Configuration en minutes</p>
                </div>
              </div>
            </div>

            <Button 
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              En savoir plus
            </Button>
          </div>

          <div className="relative animate-fade-in-up animate-delay-200">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-orange-400/10 rounded-3xl blur-2xl" />
            <div className="relative">
              <Image
                src="/person-working-at-desk-with-analytics-charts-illus.jpg"
                alt="Analyse de données EventMaster"
                width={500}
                height={400}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
