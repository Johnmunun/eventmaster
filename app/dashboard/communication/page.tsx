/**
 * PAGE: Communication
 * Gestion des emails et SMS d'invitation
 */
"use client"

import { useState } from "react"
import { Send, Mail, MessageSquare, Users, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CommunicationPage() {
  const [openEmailDrawer, setOpenEmailDrawer] = useState(false)
  const [openSMSDrawer, setOpenSMSDrawer] = useState(false)

  // Données de mock pour les campagnes
  const campaigns = [
    { 
      id: 1, 
      name: "Invitation Mariage Sophie", 
      type: "email", 
      sent: 250, 
      opened: 198, 
      clicked: 156,
      date: "15 Jan 2025",
      status: "sent"
    },
    { 
      id: 2, 
      name: "Rappel Concert Rock", 
      type: "sms", 
      sent: 500, 
      opened: 456, 
      clicked: 389,
      date: "12 Jan 2025",
      status: "sent"
    },
    { 
      id: 3, 
      name: "Confirmation Formation", 
      type: "email", 
      sent: 50, 
      opened: 42, 
      clicked: 38,
      date: "10 Jan 2025",
      status: "sent"
    },
  ]

  const stats = [
    { label: "Emails envoyés", value: "1,248", icon: Mail, color: "text-blue-600" },
    { label: "SMS envoyés", value: "856", icon: MessageSquare, color: "text-green-600" },
    { label: "Taux d'ouverture", value: "78%", icon: Users, color: "text-purple-600" },
    { label: "Clics totaux", value: "634", icon: Send, color: "text-orange-600" },
  ]

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communication</h1>
          <p className="text-gray-600 mt-2">Gérez vos campagnes d'emails et SMS</p>
        </div>
        <div className="flex gap-3">
          <Sheet open={openSMSDrawer} onOpenChange={setOpenSMSDrawer}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Nouveau SMS
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto bg-gradient-to-b from-white to-gray-50">
              <SheetHeader className="space-y-3 pb-6 border-b">
                <SheetTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  Envoyer un SMS
                </SheetTitle>
                <SheetDescription className="text-base">
                  Envoyez des SMS de rappel ou d'invitation à vos invités
                </SheetDescription>
              </SheetHeader>
              
              <form className="space-y-6 mt-8">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Événement *</Label>
                  <Select>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Sélectionnez un événement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Mariage Sophie & Marc</SelectItem>
                      <SelectItem value="2">Concert Rock Festival</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Destinataires *</Label>
                  <Select>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Sélectionnez les destinataires" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les invités</SelectItem>
                      <SelectItem value="confirmed">Confirmés uniquement</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Message *</Label>
                  <Textarea 
                    placeholder="Votre message SMS..."
                    rows={5}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500">Limite: 160 caractères</p>
                </div>

                <div className="flex gap-3 pt-6 border-t">
                  <Button type="button" variant="outline" className="flex-1 h-11" onClick={() => setOpenSMSDrawer(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1 h-11 bg-green-600 hover:bg-green-700">
                    Envoyer SMS
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>

          <Sheet open={openEmailDrawer} onOpenChange={setOpenEmailDrawer}>
            <SheetTrigger asChild>
              <Button className="gap-2">
                <Mail className="h-4 w-4" />
                Nouvel Email
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto bg-gradient-to-b from-white to-gray-50">
              <SheetHeader className="space-y-3 pb-6 border-b">
                <SheetTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  Envoyer un Email
                </SheetTitle>
                <SheetDescription className="text-base">
                  Envoyez des emails personnalisés à vos invités
                </SheetDescription>
              </SheetHeader>
              
              <form className="space-y-6 mt-8">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Événement *</Label>
                  <Select>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Sélectionnez un événement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Mariage Sophie & Marc</SelectItem>
                      <SelectItem value="2">Concert Rock Festival</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Sujet *</Label>
                  <Input 
                    placeholder="Ex: Invitation à notre mariage"
                    className="h-11"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Message *</Label>
                  <Textarea 
                    placeholder="Votre message email..."
                    rows={8}
                    className="resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-6 border-t">
                  <Button type="button" variant="outline" className="flex-1 h-11" onClick={() => setOpenEmailDrawer(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="flex-1 h-11">
                    Envoyer Email
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Liste des campagnes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campagnes récentes</CardTitle>
              <CardDescription>Historique de vos communications</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="email">Emails</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {campaigns.map((campaign) => (
                <div 
                  key={campaign.id}
                  className="flex items-center justify-between p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${campaign.type === 'email' ? 'bg-blue-100' : 'bg-green-100'}`}>
                      {campaign.type === 'email' ? (
                        <Mail className="h-5 w-5 text-blue-600" />
                      ) : (
                        <MessageSquare className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{campaign.name}</p>
                      <p className="text-sm text-gray-500">{campaign.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{campaign.sent}</p>
                      <p className="text-xs text-gray-500">Envoyés</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{campaign.opened}</p>
                      <p className="text-xs text-gray-500">Ouverts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{campaign.clicked}</p>
                      <p className="text-xs text-gray-500">Clics</p>
                    </div>
                    <Badge variant="default">Envoyé</Badge>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="email">
              <p className="text-center text-gray-500 py-12">Filtrer par emails uniquement</p>
            </TabsContent>

            <TabsContent value="sms">
              <p className="text-center text-gray-500 py-12">Filtrer par SMS uniquement</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
