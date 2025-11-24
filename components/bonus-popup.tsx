"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Sparkles, Gift, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BonusPopupProps {
  open: boolean
  onClose: () => void
  credits: number
}

export function BonusPopup({ open, onClose, credits }: BonusPopupProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setIsAnimating(true)
      setIsVisible(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
        <DialogTitle className="sr-only">
          Bonus de bienvenue - {credits} crédits offerts
        </DialogTitle>
        <div 
          className={`relative transition-all duration-500 ${
            isVisible 
              ? "opacity-100 scale-100 translate-y-0" 
              : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          {/* Effet de particules animées */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            {[...Array(20)].map((_, i) => (
              <Sparkles
                key={i}
                className={`absolute text-primary animate-ping`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`,
                  opacity: 0.6,
                  width: `${10 + Math.random() * 20}px`,
                  height: `${10 + Math.random() * 20}px`,
                }}
              />
            ))}
          </div>

          {/* Contenu principal avec fond blanc amélioré */}
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-10 border-4 border-primary/30 shadow-2xl">
            {/* Animation de pulse */}
            <div
              className={`absolute inset-0 rounded-3xl bg-primary/10 ${
                isAnimating ? "animate-ping" : ""
              }`}
              style={{ animationDuration: "2s" }}
            />

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              {/* Icône cadeau animée */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
                <div
                  className={`relative bg-gradient-to-br from-primary to-accent p-6 rounded-full shadow-xl ${
                    isAnimating ? "animate-bounce" : ""
                  }`}
                  style={{ animationDuration: "0.6s" }}
                >
                  <Gift className="h-12 w-12 text-white" />
                </div>
              </div>

              {/* Titre */}
              <div className="space-y-2">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  🎉 Bienvenue !
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                  Bonus de bienvenue offert
                </p>
              </div>

              {/* Crédits */}
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-5xl font-bold text-primary">
                  <Sparkles className="h-10 w-10 animate-spin text-primary" style={{ animationDuration: "3s" }} />
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                    +{credits} crédits
                  </span>
                  <Sparkles className="h-10 w-10 animate-spin text-primary" style={{ animationDuration: "3s", animationDirection: "reverse" }} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                  Utilisez ces crédits pour générer des QR codes et accéder aux fonctionnalités premium
                </p>
              </div>

              {/* Liste des avantages avec fond blanc */}
              <div className="w-full space-y-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border-2 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium">Crédits utilisables immédiatement</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium">Accès aux fonctionnalités premium</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium">Génération de QR codes illimitée</span>
                </div>
              </div>

              {/* Bouton */}
              <Button
                onClick={onClose}
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all text-base py-6"
              >
                Commencer maintenant
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}



