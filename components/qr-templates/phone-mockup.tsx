"use client"

import { ReactNode, useRef, useState, useEffect } from "react"
import { DeviceBar } from "./device-bar"

interface PhoneMockupProps {
  children: ReactNode
  className?: string
}

export function PhoneMockup({ children, className = "" }: PhoneMockupProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      setIsScrolling(true)
      
      // Réinitialiser le timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      // Masquer le scrollbar après 2 secondes d'inactivité
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 2000)
    }

    container.addEventListener('scroll', handleScroll)
    
    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className={`relative w-[280px] h-[560px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl ${className}`}>
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
        
        {/* Contenu de l'écran - Scrollable avec scrollbar auto-hide */}
        <div 
          ref={scrollContainerRef}
          className={`pt-8 h-full overflow-y-auto overflow-x-hidden phone-scrollbar ${isScrolling ? 'phone-scrollbar-visible' : 'phone-scrollbar-hidden'}`}
          style={{ 
            scrollbarWidth: 'thin', 
            scrollbarColor: isScrolling ? 'rgba(156, 163, 175, 0.6) transparent' : 'transparent transparent',
            maxHeight: 'calc(100% - 2rem)'
          }}
        >
          <div className="w-full min-h-full">
            {children}
          </div>
        </div>
      </div>
      
      {/* Bouton home (iPhone) */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full"></div>
    </div>
  )
}

