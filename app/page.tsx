import { LandingHeader } from '@/components/landing/header'
import { LandingHeroSection } from '@/components/landing/hero-section'
import { BenefitsSection } from '@/components/landing/benefits-section'
import { LandingFeaturesSection } from '@/components/landing/features-section'
import { LandingPricingSection } from '@/components/landing/pricing-section'
import { LandingCtaSection } from '@/components/landing/cta-section'
import { LandingFooter } from '@/components/landing/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <LandingHeader />
      <main>
        <LandingHeroSection />
        <BenefitsSection />
        <LandingFeaturesSection />
        <LandingPricingSection />
        <LandingCtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
