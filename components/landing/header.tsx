'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, QrCode } from 'lucide-react'

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Smooth scroll handler
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        const headerOffset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-[#FF6A33] via-[#FF7033] to-[#FF8A3D] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
              <QrCode className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">EventMaster</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            <Link 
              href="#fonctionnalites" 
              onClick={(e) => handleSmoothScroll(e, '#fonctionnalites')}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#FF6A33] transition-colors duration-200"
            >
              Fonctionnalités
            </Link>
            <Link 
              href="#avantages" 
              onClick={(e) => handleSmoothScroll(e, '#avantages')}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#FF6A33] transition-colors duration-200"
            >
              Avantages
            </Link>
            <Link 
              href="#tarifs" 
              onClick={(e) => handleSmoothScroll(e, '#tarifs')}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#FF6A33] transition-colors duration-200"
            >
              Tarifs
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button 
                variant="ghost"
                className="text-gray-700 dark:text-gray-200 hover:text-[#FF6A33] rounded-xl px-4 text-sm font-medium transition-colors"
              >
                Connexion
              </Button>
            </Link>
            <Link href="/signup">
              <Button 
                className="bg-gradient-to-r from-[#FF6A33] via-[#FF7033] to-[#FF8A3D] hover:from-[#FF5A23] hover:via-[#FF6023] hover:to-[#FF7A2D] text-white rounded-xl px-6 text-sm font-medium shadow-md hover:shadow-lg hover:shadow-[#FF6A33]/30 transition-all duration-300 hover:scale-105"
              >
                Commencer gratuitement
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 animate-fade-in-down">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            <Link 
              href="#fonctionnalites" 
              onClick={(e) => handleSmoothScroll(e, '#fonctionnalites')}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#FF6A33] transition-colors py-2"
            >
              Fonctionnalités
            </Link>
            <Link 
              href="#avantages" 
              onClick={(e) => handleSmoothScroll(e, '#avantages')}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#FF6A33] transition-colors py-2"
            >
              Avantages
            </Link>
            <Link 
              href="#tarifs" 
              onClick={(e) => handleSmoothScroll(e, '#tarifs')}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#FF6A33] transition-colors py-2"
            >
              Tarifs
            </Link>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-3">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant="ghost"
                  className="w-full rounded-lg"
                >
                  Connexion
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  className="bg-gradient-to-r from-[#FF6A33] via-[#FF7033] to-[#FF8A3D] hover:from-[#FF5A23] hover:via-[#FF6023] hover:to-[#FF7A2D] text-white rounded-xl w-full shadow-md"
                >
                  Commencer gratuitement
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
