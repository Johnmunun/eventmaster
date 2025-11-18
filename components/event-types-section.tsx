import Image from 'next/image'

const useCases = [
  {
    title: 'Invitations Élégantes',
    description: 'Ajoutez des QR codes stylisés sur vos invitations de mariage, événements corporate et galas',
    image: '/elegant-wedding-invitation-with-qr-code.jpg',
  },
  {
    title: 'Billets de Concert',
    description: 'Sécurisez vos événements musicaux avec des billets électroniques à QR code unique',
    image: '/concert-ticket-with-qr-code-scanning.jpg',
  },
  {
    title: 'Badges de Formation',
    description: 'Gérez les participants à vos séminaires et formations avec des badges QR code intelligents',
    image: '/conference-badge-with-qr-code-professional.jpg',
  },
]

export function EventTypesSection() {
  return (
    <section id="types-evenements" className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            Intégrez des QR codes sur <span className="text-primary">tous vos supports</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Notre technologie s'adapte à tous types d'événements et de documents
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={useCase.image || "/placeholder.svg"}
                  alt={useCase.title}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-xl font-bold text-foreground">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
