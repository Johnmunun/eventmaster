import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '3',
    description: 'Idéal pour tester la plateforme',
    features: [
      { name: 'Jusqu\'à 100 QR codes/mois', available: true },
      { name: 'QR codes basiques', available: true },
      { name: 'Intégration sur documents', available: false },
      { name: 'Personnalisation avancée', available: false },
      { name: 'Suivi en temps réel', available: false },
      { name: 'Statistiques détaillées', available: false },
      { name: 'Support prioritaire', available: false },
    ],
  },
  {
    name: 'Professionnel',
    price: '10',
    description: 'Pour les organisateurs d\'événements',
    featured: true,
    features: [
      { name: 'QR codes illimités', available: true },
      { name: 'QR codes personnalisés', available: true },
      { name: 'Intégration sur invitations', available: true },
      { name: 'Personnalisation avancée', available: true },
      { name: 'Suivi en temps réel', available: true },
      { name: 'Statistiques détaillées', available: false },
      { name: 'Support prioritaire', available: false },
    ],
  },
  {
    name: 'Entreprise',
    price: '20',
    description: 'Solution complète pour professionnels',
    features: [
      { name: 'QR codes illimités', available: true },
      { name: 'QR codes ultra-personnalisés', available: true },
      { name: 'Intégration automatique', available: true },
      { name: 'Branding complet', available: true },
      { name: 'Suivi avancé multi-événements', available: true },
      { name: 'Analytics & rapports', available: true },
      { name: 'Support prioritaire 24/7', available: true },
    ],
  },
]

export function PricingSection() {
  return (
    <section id="tarifs" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            Des tarifs <span className="text-primary">simples et transparents</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choisissez le plan adapté à vos besoins et commencez à générer des QR codes professionnels dès aujourd'hui
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`
                relative bg-card rounded-2xl border-2 p-6 lg:p-8 transition-all duration-300 hover:shadow-xl
                animate-fade-in-up
                ${plan.featured 
                  ? 'border-primary shadow-lg md:scale-105' 
                  : 'border-border hover:border-primary/50'
                }
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Recommandé
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-foreground">{plan.price}$</span>
                  <span className="text-muted-foreground">/mois</span>
                </div>

                <Button
                  className={`w-full rounded-lg ${
                    plan.featured
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                  }`}
                >
                  Commencez dès maintenant
                </Button>

                <div className="space-y-3 pt-6 border-t border-border">
                  {plan.features.map((feature) => (
                    <div key={feature.name} className="flex items-start gap-3">
                      {feature.available ? (
                        <div className="mt-0.5 bg-primary/10 rounded-full p-0.5 flex-shrink-0">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                      ) : (
                        <div className="mt-0.5 bg-muted rounded-full p-0.5 flex-shrink-0">
                          <X className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <span
                        className={`text-sm ${
                          feature.available
                            ? 'text-foreground'
                            : 'text-muted-foreground line-through'
                        }`}
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
