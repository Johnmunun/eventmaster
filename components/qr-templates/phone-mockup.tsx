"use client"

import { ReactNode, useRef, useState, useEffect } from "react"
import { DeviceBar } from "./device-bar"

interface PhoneMockupProps {
  children: ReactNode
  className?: string
  width?: number
  height?: number
}

export function PhoneMockup({ children, className = "", width = 280, height = 560 }: PhoneMockupProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollbarRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const container = scrollContainerRef.current
    const scrollbar = scrollbarRef.current
    if (!container || !scrollbar) return

    const updateScrollbar = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const maxScroll = scrollHeight - clientHeight
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0
      setScrollProgress(progress)
      
      // Calculer la hauteur et la position du thumb
      const thumbHeight = Math.max(20, (clientHeight / scrollHeight) * clientHeight)
      const thumbTop = progress * (clientHeight - thumbHeight)
      
      scrollbar.style.setProperty('--thumb-height', `${thumbHeight}px`)
      scrollbar.style.setProperty('--thumb-top', `${thumbTop}px`)
    }

    const handleScroll = () => {
      setIsScrolling(true)
      updateScrollbar()
      
      // Réinitialiser le timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      // Masquer le scrollbar après 2 secondes d'inactivité
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 2000)
    }

    // Observer les changements de taille
    const resizeObserver = new ResizeObserver(() => {
      updateScrollbar()
    })
    resizeObserver.observe(container)

    // Gérer le scroll (souris, touch, clavier)
    container.addEventListener('scroll', handleScroll)
    
    // Gérer les touches du clavier (flèches haut/bas, page up/down, etc.)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
        // Le scroll sera géré par le navigateur, on met juste à jour le scrollbar
        setTimeout(() => {
          updateScrollbar()
          setIsScrolling(true)
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
          }
          scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false)
          }, 2000)
        }, 10)
      }
    }
    
    container.addEventListener('keydown', handleKeyDown)
    updateScrollbar()
    
    return () => {
      container.removeEventListener('scroll', handleScroll)
      container.removeEventListener('keydown', handleKeyDown)
      resizeObserver.disconnect()
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div 
      className={`relative bg-gray-900 rounded-[3rem] p-2 shadow-2xl ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Écran du téléphone */}
      <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
        {/* Menu bulle en bas */}
        <DeviceBar />
        {/* Barre de statut */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gray-900 flex items-center justify-between px-6 text-white text-xs font-medium z-10">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 border border-white rounded-sm">
              <div className="w-full h-full bg-white rounded-sm"></div>
            </div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-6 h-3 border border-white rounded-sm">
              <div className="w-4/5 h-full bg-white rounded-sm"></div>
            </div>
          </div>
        </div>
        
        {/* Contenu de l'écran - Scrollable avec scrollbar personnalisé en overlay */}
        <div className="relative pt-8 h-full overflow-hidden">
          <div 
            ref={scrollContainerRef}
            className="h-full overflow-y-scroll overflow-x-hidden custom-scrollbar-overlay"
            tabIndex={0} // Permettre le focus pour les touches du clavier
            style={{ 
              scrollbarWidth: 'none', // Masquer le scrollbar natif
              msOverflowStyle: 'none', // Masquer pour IE/Edge
              maxHeight: 'calc(100% - 2rem)',
              outline: 'none' // Pas de contour de focus visible
            }}
          >
            <div 
              className="w-full min-h-full" 
              style={{ 
                width: '100%', 
                maxWidth: '100%', 
                boxSizing: 'border-box'
              }}
            >
              {children}
            </div>
          </div>
          
          {/* Scrollbar personnalisé en overlay - ne prend aucun espace */}
          <div 
            ref={scrollbarRef}
            className={`absolute top-8 right-0 bottom-0 w-2 pointer-events-none z-20 transition-opacity duration-300 ${
              isScrolling ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              '--thumb-height': '20px',
              '--thumb-top': '0px'
            } as React.CSSProperties}
          >
            <div 
              className="absolute right-0 w-1 bg-gray-400/30 rounded-full transition-all duration-200"
              style={{
                height: 'var(--thumb-height)',
                top: 'var(--thumb-top)',
                minHeight: '20px'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Bouton home (iPhone) */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full"></div>
    </div>
  )
}

