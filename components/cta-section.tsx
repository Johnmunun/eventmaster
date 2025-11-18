import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-blue-50/50 to-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
            Prêt à transformer vos événements avec des <span className="text-primary">QR codes intelligents</span> ?
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Rejoignez des milliers d'organisateurs qui utilisent EventMaster pour créer des expériences événementielles modernes et sans friction
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-8 shadow-sm group"
            >
              Commencez dès maintenant
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="rounded-lg px-8 border-2 border-border text-foreground hover:bg-muted"
            >
              Planifier une démo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground pt-4">
            Essai gratuit pendant 14 jours • Aucune carte de crédit requise • Annulation à tout moment
          </p>
        </div>
      </div>
    </section>
  )
}
