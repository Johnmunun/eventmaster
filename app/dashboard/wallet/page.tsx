"use client"

import { useState } from "react"
import { Wallet, Plus, History, TrendingUp, Zap, CreditCard, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

/**
 * Page Wallet - Gestion du portefeuille de crédits IA
 * Permet de recharger des crédits, consulter l'historique et les statistiques d'utilisation
 */
export default function WalletPage() {
  const [isRechargeOpen, setIsRechargeOpen] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState("50")

  // Solde actuel
  const currentBalance = 153

  // Offres de recharge
  const rechargeOffers = [
    { credits: 50, price: 5, bonus: 0, popular: false },
    { credits: 150, price: 12, bonus: 10, popular: true },
    { credits: 300, price: 20, bonus: 30, popular: false },
    { credits: 500, price: 30, bonus: 75, popular: false },
  ]

  // Historique des transactions
  const transactions = [
    {
      id: 1,
      type: "recharge",
      amount: 150,
      date: "2024-01-15",
      time: "14:32",
      description: "Recharge de crédits",
      price: 12,
    },
    {
      id: 2,
      type: "usage",
      amount: -25,
      date: "2024-01-14",
      time: "10:15",
      description: "Génération d'invitations IA",
      event: "Mariage Sophie & Marc",
    },
    {
      id: 3,
      type: "usage",
      amount: -15,
      date: "2024-01-13",
      time: "16:45",
      description: "Personnalisation QR codes IA",
      event: "Concert Rock Festival",
    },
    {
      id: 4,
      type: "bonus",
      amount: 20,
      date: "2024-01-12",
      time: "09:00",
      description: "Bonus de bienvenue",
      price: 0,
    },
    {
      id: 5,
      type: "usage",
      amount: -30,
      date: "2024-01-11",
      time: "11:20",
      description: "Création de badges IA",
      event: "Conférence Tech 2024",
    },
  ]

  // Statistiques d'utilisation
  const usageStats = [
    { label: "Crédits utilisés ce mois", value: 247, icon: TrendingUp, color: "text-orange-600" },
    { label: "Crédits rechargés", value: 400, icon: Plus, color: "text-green-600" },
    { label: "Économies réalisées", value: "45$", icon: Wallet, color: "text-blue-600" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portefeuille de Crédits</h1>
          <p className="text-gray-600">Gérez vos crédits IA et consultez votre historique</p>
        </div>

        {/* Bouton Recharger */}
        <Sheet open={isRechargeOpen} onOpenChange={setIsRechargeOpen}>
          <SheetTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Recharger des crédits
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[500px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Recharger votre portefeuille
              </SheetTitle>
              <SheetDescription>
                Choisissez le montant de crédits IA que vous souhaitez acheter
              </SheetDescription>
            </SheetHeader>

            {/* Formulaire de recharge */}
            <div className="space-y-6 py-6">
              {/* Offres de recharge */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Choisissez une offre</Label>
                <RadioGroup value={selectedAmount} onValueChange={setSelectedAmount}>
                  {rechargeOffers.map((offer) => (
                    <div key={offer.credits} className="relative">
                      {offer.popular && (
                        <Badge className="absolute -top-2 left-2 z-10 bg-orange-500">Populaire</Badge>
                      )}
                      <label
                        htmlFor={`offer-${offer.credits}`}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary ${
                          selectedAmount === offer.credits.toString()
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={offer.credits.toString()} id={`offer-${offer.credits}`} />
                          <div>
                            <p className="font-semibold text-gray-900 flex items-center gap-2">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              {offer.credits} crédits
                              {offer.bonus > 0 && (
                                <Badge variant="outline" className="text-green-600 ml-2">
                                  +{offer.bonus} bonus
                                </Badge>
                              )}
                            </p>
                            {offer.bonus > 0 && (
                              <p className="text-sm text-gray-500">
                                Total: {offer.credits + offer.bonus} crédits
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">{offer.price}$</p>
                          <p className="text-xs text-gray-500">
                            {(offer.price / (offer.credits + offer.bonus)).toFixed(2)}$ / crédit
                          </p>
                        </div>
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Moyen de paiement */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Moyen de paiement</Label>
                <div className="p-4 bg-gradient-to-r from-primary to-accent rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6" />
                      <div>
                        <p className="text-sm opacity-90">Carte bancaire</p>
                        <p className="font-mono">•••• 4242</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      Changer
                    </Button>
                  </div>
                </div>
              </div>

              {/* Récapitulatif */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Crédits de base</span>
                  <span className="font-medium">{selectedAmount} crédits</span>
                </div>
                {rechargeOffers.find(o => o.credits.toString() === selectedAmount)?.bonus > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bonus</span>
                    <span className="font-medium text-green-600">
                      +{rechargeOffers.find(o => o.credits.toString() === selectedAmount)?.bonus} crédits
                    </span>
                  </div>
                )}
                <div className="h-px bg-gray-300 my-2" />
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">
                      {rechargeOffers.find(o => o.credits.toString() === selectedAmount)?.price}$
                    </p>
                    <p className="text-sm text-gray-600">
                      {parseInt(selectedAmount) + (rechargeOffers.find(o => o.credits.toString() === selectedAmount)?.bonus || 0)} crédits
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsRechargeOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    // Logique de recharge
                    setIsRechargeOpen(false)
                  }}
                >
                  Confirmer le paiement
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Solde actuel */}
      <Card className="bg-gradient-to-br from-primary via-primary to-accent border-0 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10">
          <Wallet className="h-48 w-48" />
        </div>
        <CardContent className="pt-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-2">Solde actuel</p>
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-yellow-300" />
                <p className="text-5xl font-bold">{currentBalance}</p>
                <span className="text-lg opacity-90">crédits</span>
              </div>
              <p className="text-sm opacity-75 mt-2">Valeur estimée: {(currentBalance * 0.08).toFixed(2)}$</p>
            </div>
            <Button variant="secondary" size="lg" className="gap-2">
              <History className="h-5 w-5" />
              Historique
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        {usageStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                  <Badge variant="outline" className="text-xs">Ce mois</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Historique des transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Historique des transactions
          </CardTitle>
          <CardDescription>
            Consultez toutes vos recharges et dépenses de crédits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      transaction.type === "recharge"
                        ? "bg-green-100"
                        : transaction.type === "bonus"
                        ? "bg-blue-100"
                        : "bg-orange-100"
                    }`}
                  >
                    {transaction.type === "recharge" ? (
                      <ArrowDownRight className="h-5 w-5 text-green-600" />
                    ) : transaction.type === "bonus" ? (
                      <Zap className="h-5 w-5 text-blue-600" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{transaction.date}</span>
                      <span>•</span>
                      <span>{transaction.time}</span>
                      {transaction.event && (
                        <>
                          <span>•</span>
                          <span className="text-primary">{transaction.event}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      transaction.amount > 0 ? "text-green-600" : "text-orange-600"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.amount} crédits
                  </p>
                  {transaction.price !== undefined && (
                    <p className="text-sm text-gray-500">{transaction.price > 0 ? `${transaction.price}$` : "Gratuit"}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
