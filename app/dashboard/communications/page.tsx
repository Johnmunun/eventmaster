"use client"

import { useState } from "react"
import { Send, Mail, MessageSquare, Bell, Users, Calendar, Filter, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * Page Communications - Gestion des envois emails, SMS et notifications
 * Permet de créer et envoyer des communications aux invités
 * Affiche l'historique et les statistiques d'envoi
 */
export default function CommunicationsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [commType, setCommType] = useState("email")

  // Statistiques des communications
  const stats = [
    { label: "Emails envoyés", value: "2,847", icon: Mail, color: "text-blue-600" },
    { label: "SMS envoyés", value: "1,234", icon: MessageSquare, color: "text-green-600" },
    { label: "Taux d'ouverture", value: "68%", icon: Bell, color: "text-purple-600" },
    { label: "Destinataires", value: "4,521", icon: Users, color: "text-orange-600" },
  ]

  // Historique des communications
  const communications = [
    {
      type: "Email",
      subject: "Confirmation d'inscription - Mariage Sophie & Thomas",
      recipients: 150,
      sent: "2024-01-15",
      status: "Envoyé",
      openRate: "72%",
    },
    {
      type: "SMS",
      subject: "Rappel - Concert Rock Festival demain",
      recipients: 500,
      sent: "2024-01-14",
      status: "Envoyé",
      openRate: "95%",
    },
    {
      type: "Email",
      subject: "Invitation VIP - Gala de Charité 2024",
      recipients: 80,
      sent: "2024-01-13",
      status: "Envoyé",
      openRate: "85%",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Communications</h1>
          <p className="text-gray-600">Gérez vos envois emails, SMS et notifications</p>
        </div>
        
        {/* Bouton créer une communication - Ouvre le drawer */}
        <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <SheetTrigger asChild>
            <Button size="lg" className="gap-2 shadow-lg">
              <Send className="h-5 w-5" />
              Nouvelle communication
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-2xl flex items-center gap-2">
                <Send className="h-6 w-6 text-primary" />
                Nouvelle communication
              </SheetTitle>
              <SheetDescription>
                Envoyez un email, SMS ou notification push à vos invités
              </SheetDescription>
            </SheetHeader>
            
            {/* Formulaire de création de communication */}
            <div className="space-y-6 mt-6">
              {/* Type de communication */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Type de communication</Label>
                <Select value={commType} onValueChange={setCommType}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">📧 Email</SelectItem>
                    <SelectItem value="sms">💬 SMS</SelectItem>
                    <SelectItem value="push">🔔 Notification Push</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Événement associé */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Événement</Label>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionner un événement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">💒 Mariage Sophie & Thomas</SelectItem>
                    <SelectItem value="concert">🎸 Concert Rock Festival</SelectItem>
                    <SelectItem value="training">📚 Formation Marketing Digital</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Destinataires */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Destinataires</Label>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choisir les destinataires" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">👥 Tous les invités (150)</SelectItem>
                    <SelectItem value="confirmed">✅ Invités confirmés (120)</SelectItem>
                    <SelectItem value="pending">⏳ En attente (30)</SelectItem>
                    <SelectItem value="vip">⭐ Invités VIP (25)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sujet (pour email) */}
              {commType === "email" && (
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Sujet</Label>
                  <Input
                    placeholder="Sujet de l'email"
                    className="h-12 text-base"
                  />
                </div>
              )}

              {/* Message */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Message</Label>
                <Textarea
                  placeholder={commType === "sms" ? "Votre message SMS (max 160 caractères)" : "Rédigez votre message..."}
                  className="min-h-[180px] text-base"
                  maxLength={commType === "sms" ? 160 : undefined}
                />
                {commType === "sms" && (
                  <p className="text-xs text-muted-foreground">0/160 caractères</p>
                )}
              </div>

              {/* Programmation */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Envoi</Label>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Envoyer maintenant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">⚡ Envoyer maintenant</SelectItem>
                    <SelectItem value="schedule">📅 Programmer l'envoi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button size="lg" className="flex-1 gap-2">
                  <Send className="h-4 w-4" />
                  Envoyer
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
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

      {/* Recherche et filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Rechercher une communication..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2 h-12">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des communications */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des communications</CardTitle>
          <CardDescription>Toutes vos communications envoyées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {communications.map((comm, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 bg-white rounded-lg">
                    {comm.type === "Email" ? (
                      <Mail className="h-5 w-5 text-blue-600" />
                    ) : (
                      <MessageSquare className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{comm.subject}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="secondary" className="text-xs">{comm.type}</Badge>
                      <span className="text-xs text-gray-500">{comm.recipients} destinataires</span>
                      <span className="text-xs text-gray-500">{comm.sent}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">{comm.status}</Badge>
                    <p className="text-xs text-green-600 font-medium mt-1">{comm.openRate} ouvert</p>
                  </div>
                  <Button variant="ghost" size="sm">Détails</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
