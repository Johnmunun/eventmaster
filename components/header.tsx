'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, QrCode } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">EventMaster</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="#accueil" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200">
              Accueil
            </Link>
            <Link href="#fonctionnalites" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200">
              Fonctionnalités
            </Link>
            <Link href="#types-evenements" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200">
              Solutions
            </Link>
            <Link href="#tarifs" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200">
              Tarifs
            </Link>
            <Link href="#contact" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200">
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button 
                variant="ghost"
                className="text-foreground/80 hover:text-primary rounded-full px-4 lg:px-6 text-sm lg:text-base transition-all duration-300"
              >
                Connexion
              </Button>
            </Link>
            <Link href="/signup">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 lg:px-6 text-sm lg:text-base shadow-sm hover:shadow-md transition-all duration-300"
              >
                Commencez maintenant
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-white animate-fade-in-down">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              href="#accueil" 
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              href="#fonctionnalites" 
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Fonctionnalités
            </Link>
            <Link 
              href="#types-evenements" 
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Solutions
            </Link>
            <Link 
              href="#tarifs" 
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Tarifs
            </Link>
            <Link 
              href="#contact" 
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              <Button 
                variant="ghost"
                className="w-full rounded-full transition-all duration-300"
              >
                Connexion
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white rounded-full w-full shadow-sm hover:shadow-md transition-all duration-300"
              >
                Commencez maintenant
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
