"use client"

import { useState } from "react"
import { Sparkles, Wand2, Users, Calendar, Mail, MessageSquare, Zap, TrendingUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

/**
 * Page IA EventMaster - Génération assistée par IA
 * Cette page permet aux utilisateurs d'utiliser l'IA pour:
 * - Générer des descriptions d'événements
 * - Créer des messages de communication
 * - Analyser et optimiser leurs événements
 * - Obtenir des suggestions personnalisées
 */
export default function AIPage() {
  const [isGenerateOpen, setIsGenerateOpen] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [taskType, setTaskType] = useState("event")

  // Statistiques d'utilisation IA
  const stats = [
    { label: "Crédits IA utilisés", value: "847", icon: Zap, color: "text-yellow-600" },
    { label: "Générations ce mois", value: "156", icon: Sparkles, color: "text-purple-600" },
    { label: "Temps économisé", value: "42h", icon: TrendingUp, color: "text-green-600" },
  ]

  // Historique des générations récentes
  const recentGenerations = [
    { type: "Événement", title: "Conférence Tech 2024", date: "Il y a 2 heures", credits: 10 },
    { type: "Email", title: "Invitation VIP Gala", date: "Il y a 5 heures", credits: 5 },
    { type: "Description", title: "Formation Marketing Digital", date: "Hier", credits: 8 },
    { type: "Message", title: "Rappel Webinar", date: "Hier", credits: 3 },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header avec action principale */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IA EventMaster</h1>
          <p className="text-gray-600">Laissez l'intelligence artificielle créer pour vous</p>
        </div>
        
        {/* Bouton d'action principale - Ouvre le drawer de génération */}
        <Sheet open={isGenerateOpen} onOpenChange={setIsGenerateOpen}>
          <SheetTrigger asChild>
            <Button size="lg" className="gap-2 shadow-lg">
              <Wand2 className="h-5 w-5" />
              Générer avec l'IA
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Génération IA
              </SheetTitle>
              <SheetDescription>
                Décrivez ce que vous voulez créer et l'IA fera le reste
              </SheetDescription>
            </SheetHeader>
            
            {/* Formulaire de génération IA */}
            <div className="space-y-6 mt-6">
              {/* Type de tâche */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Type de génération</Label>
                <Select value={taskType} onValueChange={setTaskType}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event">📅 Événement complet</SelectItem>
                    <SelectItem value="description">📝 Description d'événement</SelectItem>
                    <SelectItem value="email">📧 Email d'invitation</SelectItem>
                    <SelectItem value="sms">💬 Message SMS</SelectItem>
                    <SelectItem value="social">📱 Post réseaux sociaux</SelectItem>
                    <SelectItem value="program">📋 Programme détaillé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Prompt utilisateur */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Décrivez votre besoin</Label>
                <Textarea
                  placeholder="Ex: Créer un événement de lancement de produit tech pour 200 personnes, ambiance moderne et professionnelle, avec cocktail et démo produit..."
                  className="min-h-[180px] text-base"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Plus vous êtes précis, meilleurs seront les résultats
                </p>
              </div>

              {/* Informations sur les crédits */}
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/10">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Coût de cette génération</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {taskType === "event" && "10 crédits - Génération complète"}
                      {taskType === "description" && "8 crédits - Description détaillée"}
                      {taskType === "email" && "5 crédits - Email personnalisé"}
                      {taskType === "sms" && "3 crédits - Message court"}
                      {taskType === "social" && "4 crédits - Post optimisé"}
                      {taskType === "program" && "7 crédits - Programme structuré"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    153 crédits restants
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  disabled={!prompt.trim()}
                >
                  <Sparkles className="h-4 w-4" />
                  Générer
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsGenerateOpen(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Statistiques d'utilisation IA */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Modèles de prompts prédéfinis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Modèles de prompts
          </CardTitle>
          <CardDescription>Utilisez ces modèles pour démarrer rapidement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => {
                setPrompt("Créer un événement de networking professionnel pour 100 personnes dans le secteur tech, ambiance décontractée, avec buffet et activités de team building")
                setTaskType("event")
                setIsGenerateOpen(true)
              }}
            >
              <div className="flex-1">
                <p className="font-medium text-sm">Événement Networking Tech</p>
                <p className="text-xs text-muted-foreground mt-1">100 personnes, ambiance décontractée</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => {
                setPrompt("Rédiger un email d'invitation VIP pour un gala de charité, ton élégant et formel, avec détails sur la cause soutenue")
                setTaskType("email")
                setIsGenerateOpen(true)
              }}
            >
              <div className="flex-1">
                <p className="font-medium text-sm">Invitation Gala VIP</p>
                <p className="text-xs text-muted-foreground mt-1">Email formel et élégant</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => {
                setPrompt("Créer un programme détaillé pour une formation de 2 jours sur le marketing digital, avec modules, pauses et activités pratiques")
                setTaskType("program")
                setIsGenerateOpen(true)
              }}
            >
              <div className="flex-1">
                <p className="font-medium text-sm">Programme Formation</p>
                <p className="text-xs text-muted-foreground mt-1">2 jours, modules structurés</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => {
                setPrompt("Générer un post Instagram pour promouvoir un concert de musique électronique, avec emojis, hashtags et call-to-action pour les billets")
                setTaskType("social")
                setIsGenerateOpen(true)
              }}
            >
              <div className="flex-1">
                <p className="font-medium text-sm">Post Concert Social</p>
                <p className="text-xs text-muted-foreground mt-1">Instagram optimisé avec hashtags</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historique des générations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Historique des générations
          </CardTitle>
          <CardDescription>Vos dernières créations avec l'IA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentGenerations.map((gen, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 bg-white rounded-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{gen.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="secondary" className="text-xs">{gen.type}</Badge>
                      <span className="text-xs text-gray-500">{gen.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {gen.credits} crédits
                  </Badge>
                  <Button variant="ghost" size="sm">
                    Réutiliser
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
