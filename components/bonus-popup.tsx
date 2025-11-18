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

  useEffect(() => {
    if (open) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
        <DialogTitle className="sr-only">
          Bonus de bienvenue - {credits} crédits offerts
        </DialogTitle>
        <div className="relative">
          {/* Effet de particules animées */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

          {/* Contenu principal */}
          <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-primary/20 shadow-2xl">
            {/* Animation de pulse */}
            <div
              className={`absolute inset-0 rounded-2xl bg-primary/20 ${
                isAnimating ? "animate-ping" : ""
              }`}
              style={{ animationDuration: "2s" }}
            />

            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              {/* Icône cadeau animée */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
                <div
                  className={`relative bg-gradient-to-br from-primary to-accent p-6 rounded-full shadow-lg ${
                    isAnimating ? "animate-bounce" : ""
                  }`}
                  style={{ animationDuration: "0.6s" }}
                >
                  <Gift className="h-12 w-12 text-white" />
                </div>
              </div>

              {/* Titre */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  🎉 Bienvenue !
                </h2>
                <p className="text-lg text-muted-foreground">
                  Bonus de bienvenue offert
                </p>
              </div>

              {/* Crédits */}
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-4xl font-bold text-primary">
                  <Sparkles className="h-8 w-8 animate-spin" style={{ animationDuration: "3s" }} />
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                    +{credits} crédits
                  </span>
                  <Sparkles className="h-8 w-8 animate-spin" style={{ animationDuration: "3s", animationDirection: "reverse" }} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Utilisez ces crédits pour générer des QR codes et accéder aux fonctionnalités premium
                </p>
              </div>

              {/* Liste des avantages */}
              <div className="w-full space-y-2 bg-white/50 dark:bg-gray-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Crédits utilisables immédiatement</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Accès aux fonctionnalités premium</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Génération de QR codes illimitée</span>
                </div>
              </div>

              {/* Bouton */}
              <Button
                onClick={onClose}
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
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



