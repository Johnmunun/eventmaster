import Image from 'next/image'
import { Play } from 'lucide-react'

const demoSteps = [
  {
    title: 'Génération d\'un QR code',
    description: 'Créez un QR code personnalisé en quelques secondes',
    image: '/qr-code-generation-interface-demonstration.jpg',
  },
  {
    title: 'Scan sur téléphone',
    description: 'Scannez instantanément avec l\'application mobile',
    image: '/mobile-phone-scanning-qr-code.jpg',
  },
  {
    title: 'Édition de design',
    description: 'Personnalisez vos invitations avec l\'éditeur IA',
    image: '/invitation-design-editor-interface.jpg',
  },
  {
    title: 'Confirmation d\'invité',
    description: 'Recevez les confirmations en temps réel',
    image: '/guest-confirmation-notification.jpg',
  },
  {
    title: 'Placement automatique',
    description: 'L\'IA organise le placement optimal de vos invités',
    image: '/automatic-seating-arrangement-ai.jpg',
  },
]

export function DemoSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-400/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Play className="w-4 h-4" />
            Démo Interactive
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Découvrez EventMaster en action
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Voyez comment notre plateforme simplifie chaque étape de la gestion d'événements
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoSteps.map((step, index) => (
            <div
              key={index}
              className="group bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <Image
                  src={step.image || "/placeholder.svg"}
                  alt={step.title}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="flex items-center gap-2 text-white">
                    <Play className="w-5 h-5" />
                    <span className="text-sm font-semibold">Voir la démo</span>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
