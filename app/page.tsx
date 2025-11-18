import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { DemoSection } from '@/components/demo-section'
import { EventTypesSection } from '@/components/event-types-section'
import { StatsSection } from '@/components/stats-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { CtaSection } from '@/components/cta-section'
import { Footer } from '@/components/footer'
import { PricingSection } from '@/components/pricing-section'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <DemoSection />
        <EventTypesSection />
        <TestimonialsSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
