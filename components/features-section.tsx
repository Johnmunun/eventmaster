import { QrCode, Calendar, Scan, Users, BarChart3, Mail } from 'lucide-react'
import Image from 'next/image'

const features = [
  {
    icon: QrCode,
    title: 'QR Codes personnalisés',
    description: 'Wedding, corporate, premium - adaptez votre QR code à l\'identité de votre événement',
    visual: '/customized-qr-codes-with-logos.jpg',
    color: 'bg-blue-500',
  },
  {
    icon: Calendar,
    title: 'Création d\'événements assistée par IA',
    description: 'L\'IA vous guide pas à pas dans la création et l\'organisation de votre événement',
    visual: '/ai-event-creation-wizard.jpg',
    color: 'bg-green-500',
  },
  {
    icon: Scan,
    title: 'Scanner professionnel',
    description: 'Scannez les QR codes en un instant avec notre application mobile dédiée',
    visual: '/professional-qr-code-scanner-app.jpg',
    color: 'bg-orange-500',
  },
  {
    icon: Users,
    title: 'Gestion des tables et placement IA',
    description: 'Optimisez automatiquement le placement de vos invités selon vos critères',
    visual: '/ai-table-seating-arrangement.jpg',
    color: 'bg-pink-500',
  },
  {
    icon: BarChart3,
    title: 'Tableau de bord avancé',
    description: 'Visualisez toutes vos données en temps réel avec des graphiques intuitifs',
    visual: '/advanced-event-analytics-dashboard.jpg',
    color: 'bg-indigo-500',
  },
  {
    icon: Mail,
    title: 'Automatisation emails + SMS',
    description: 'Envoyez automatiquement vos invitations par email et SMS personnalisés',
    visual: '/automated-email-sms-invitation-system.jpg',
    color: 'bg-teal-500',
  },
]

export function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-orange-400/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Toutes les fonctionnalités pour vos{' '}
            <span className="text-primary">événements parfaits</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Une suite complète d'outils alimentés par l'IA pour créer, gérer et analyser vos événements professionnels
          </p>
        </div>

        <div className="space-y-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center animate-fade-in-up ${
                index % 2 === 1 ? 'md:grid-flow-dense' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`space-y-6 ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              <div className={`relative ${index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-2xl blur-xl" />
                <div className="relative bg-white border border-border rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                  <Image
                    src={feature.visual || "/placeholder.svg"}
                    alt={feature.title}
                    width={400}
                    height={300}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
