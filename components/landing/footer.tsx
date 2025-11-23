import Link from 'next/link'
import { QrCode } from 'lucide-react'

const footerLinks = {
  product: [
    { label: 'Fonctionnalités', href: '#fonctionnalites' },
    { label: 'Avantages', href: '#avantages' },
    { label: 'Tarifs', href: '#tarifs' },
  ],
  company: [
    { label: 'À propos', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Confidentialité', href: '/privacy' },
    { label: 'Conditions d\'utilisation', href: '/terms' },
    { label: 'Mentions légales', href: '/legal' },
  ],
}

export function LandingFooter() {
  return (
    <footer className="bg-gray-900 dark:bg-black border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6A33] via-[#FF7033] to-[#FF8A3D] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">EventMaster</span>
            </Link>
            
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              La plateforme pour générer des QR codes professionnels et gérer vos événements avec succès.
            </p>
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-white mb-4">Produit</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-[#FF6A33] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-white mb-4">Entreprise</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-[#FF6A33] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-white mb-4">Légal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-[#FF6A33] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="font-semibold text-white mb-4">Commencer maintenant</h3>
            <p className="text-sm text-gray-400 mb-4">
              Essai gratuit disponible
            </p>
            <Link href="/signup">
              <button className="w-full px-4 py-2 bg-gradient-to-r from-[#FF6A33] via-[#FF7033] to-[#FF8A3D] text-white rounded-xl text-sm font-medium hover:from-[#FF5A23] hover:via-[#FF6023] hover:to-[#FF7A2D] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105">
                Commencer l'essai gratuit
              </button>
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 text-center sm:text-left">
              © 2025 EventMaster. Tous droits réservés.
            </p>
            <p className="text-sm text-gray-400 text-center sm:text-right">
              Fait avec passion pour vos événements
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

