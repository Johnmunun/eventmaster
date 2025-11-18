"use client"

import { useState } from "react"
import { CreditCard, Download, Receipt, TrendingUp, Zap, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * Page Facturation - Gestion de l'abonnement et des factures
 * Affiche le plan actuel, l'historique des paiements et permet les upgrades
 */
export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState("standard")

  // Plans tarifaires
  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 3,
      features: [
        { text: "50 QR codes / mois", included: true },
        { text: "2 événements actifs", included: true },
        { text: "100 invités max", included: true },
        { text: "Support email", included: true },
        { text: "Analytics basiques", included: true },
        { text: "Personnalisation limitée", included: false },
        { text: "IA EventMaster", included: false },
        { text: "Support prioritaire", included: false },
      ],
    },
    {
      id: "standard",
      name: "Standard",
      price: 10,
      popular: true,
      features: [
        { text: "200 QR codes / mois", included: true },
        { text: "10 événements actifs", included: true },
        { text: "500 invités max", included: true },
        { text: "Support prioritaire", included: true },
        { text: "Analytics avancées", included: true },
        { text: "Personnalisation complète", included: true },
        { text: "IA EventMaster (150 crédits)", included: true },
        { text: "API Access", included: false },
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: 20,
      features: [
        { text: "QR codes illimités", included: true },
        { text: "Événements illimités", included: true },
        { text: "Invités illimités", included: true },
        { text: "Support 24/7", included: true },
        { text: "Analytics premium + export", included: true },
        { text: "Personnalisation avancée", included: true },
        { text: "IA EventMaster (500 crédits)", included: true },
        { text: "API Access complet", included: true },
      ],
    },
  ]

  // Historique des factures
  const invoices = [
    { date: "2024-01-01", amount: 10, status: "Payée", invoice: "INV-2024-001" },
    { date: "2023-12-01", amount: 10, status: "Payée", invoice: "INV-2023-012" },
    { date: "2023-11-01", amount: 10, status: "Payée", invoice: "INV-2023-011" },
    { date: "2023-10-01", amount: 10, status: "Payée", invoice: "INV-2023-010" },
  ]

  // Statistiques d'utilisation
  const usageStats = [
    { label: "QR Codes créés", current: 156, limit: 200, unit: "codes" },
    { label: "Événements actifs", current: 7, limit: 10, unit: "événements" },
    { label: "Crédits IA utilisés", current: 97, limit: 150, unit: "crédits" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Facturation & Abonnement</h1>
        <p className="text-gray-600">Gérez votre abonnement et consultez vos factures</p>
      </div>

      {/* Plan actuel et utilisation */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-primary">Plan actuel</Badge>
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-gray-900">Standard</p>
            <p className="text-3xl font-bold text-primary mt-2">10$ <span className="text-sm text-gray-600 font-normal">/ mois</span></p>
            <Button className="w-full mt-4">Changer de plan</Button>
          </CardContent>
        </Card>

        {usageStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
              <div className="flex items-end gap-1 mb-2">
                <p className="text-3xl font-bold text-gray-900">{stat.current}</p>
                <p className="text-sm text-gray-500 mb-1">/ {stat.limit}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{ width: `${(stat.current / stat.limit) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{stat.unit}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Plans & Tarifs</TabsTrigger>
          <TabsTrigger value="invoices">Factures</TabsTrigger>
          <TabsTrigger value="payment">Moyen de paiement</TabsTrigger>
        </TabsList>

        {/* Onglet Plans */}
        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${
                  currentPlan === plan.id ? 'border-2 border-primary ring-2 ring-primary/20' : ''
                } ${plan.popular ? 'border-2 border-orange-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-orange-500">Plus populaire</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}$</span>
                    <span className="text-gray-600"> / mois</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        {feature.included ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={currentPlan === plan.id ? "outline" : "default"}
                    disabled={currentPlan === plan.id}
                  >
                    {currentPlan === plan.id ? "Plan actuel" : "Choisir ce plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Onglet Factures */}
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Historique des factures
              </CardTitle>
              <CardDescription>Téléchargez vos factures précédentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.map((invoice, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-lg">
                        <Receipt className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{invoice.invoice}</p>
                        <p className="text-sm text-gray-500">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{invoice.amount}$</p>
                        <Badge variant="outline" className="text-xs text-green-600">
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Moyen de paiement */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Moyen de paiement
              </CardTitle>
              <CardDescription>Gérez vos cartes bancaires</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-primary to-accent rounded-xl text-white">
                <p className="text-sm opacity-90">Carte bancaire</p>
                <p className="text-2xl font-mono tracking-wider mt-2">•••• •••• •••• 4242</p>
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-xs opacity-90">Expire le</p>
                    <p className="font-medium">12/25</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-90">Titulaire</p>
                    <p className="font-medium">JEAN DUPONT</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">Modifier</Button>
                <Button variant="outline" className="flex-1">Ajouter une carte</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
