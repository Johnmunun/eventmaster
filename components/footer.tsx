import Link from 'next/link'
import { QrCode, Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react'

const footerLinks = {
  product: [
    { label: 'Fonctionnalités', href: '#fonctionnalites' },
    { label: 'Tarifs', href: '#tarifs' },
    { label: 'Cas d\'usage', href: '#types-evenements' },
    { label: 'Documentation', href: '/docs' },
  ],
  company: [
    { label: 'À propos', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Carrières', href: '/careers' },
    { label: 'Contact', href: '#contact' },
  ],
  legal: [
    { label: 'Confidentialité', href: '/privacy' },
    { label: 'Conditions d\'utilisation', href: '/terms' },
    { label: 'Mentions légales', href: '/legal' },
    { label: 'Cookies', href: '/cookies' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">EventMaster</span>
            </Link>
            
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              La plateforme tout-en-un pour générer des QR codes professionnels et gérer vos événements avec succès.
            </p>
            
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:contact@eventmaster.com" className="hover:text-primary transition-colors">
                  contact@eventmaster.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+33123456789" className="hover:text-primary transition-colors">
                  +33 1 23 45 67 89
                </a>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/80 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/80 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-sky-400 rounded-full flex items-center justify-center text-white hover:bg-sky-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-bold text-foreground mb-4">Produit</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-bold text-foreground mb-4">Entreprise</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-bold text-foreground mb-4">Légal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="font-bold text-foreground mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Recevez nos actualités et conseils
            </p>
            <div className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="Votre email"
                className="px-4 py-2 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                S'inscrire
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © 2025 EventMaster. Tous droits réservés.
            </p>
            <p className="text-sm text-muted-foreground text-center sm:text-right">
              Fait avec passion en France
            </p>
          </div>
        </div>
      </div>
      
      <div className="h-1 bg-gradient-to-r from-primary via-blue-500 to-primary"></div>
    </footer>
  )
}
