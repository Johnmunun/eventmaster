/**
 * PAGE: Paramètres
 * Configuration du compte et préférences utilisateur
 */
"use client"

import { User, Bell, CreditCard, Shield, Globe, Palette } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-2">Gérez votre compte et vos préférences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Facturation</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations du profil
              </CardTitle>
              <CardDescription>
                Mettez à jour vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold">
                  JD
                </div>
                <div>
                  <Button variant="outline">Changer la photo</Button>
                  <p className="text-sm text-gray-500 mt-2">JPG, PNG ou GIF. Max 2MB</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input placeholder="Jean" defaultValue="Jean" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input placeholder="Dupont" defaultValue="Dupont" className="h-11" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="jean.dupont@email.com" defaultValue="jean.dupont@email.com" className="h-11" />
              </div>

              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input type="tel" placeholder="+33 6 12 34 56 78" defaultValue="+33 6 12 34 56 78" className="h-11" />
              </div>

              <div className="space-y-2">
                <Label>Entreprise</Label>
                <Input placeholder="EventMaster Inc." defaultValue="EventMaster Inc." className="h-11" />
              </div>

              <Button className="h-11">Enregistrer les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Préférences de notifications
              </CardTitle>
              <CardDescription>
                Choisissez comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Notifications par email</p>
                    <p className="text-sm text-gray-500">Recevez des emails pour les mises à jour importantes</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Notifications SMS</p>
                    <p className="text-sm text-gray-500">Recevez des SMS pour les alertes urgentes</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Nouveaux invités</p>
                    <p className="text-sm text-gray-500">Soyez notifié quand un invité confirme</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Rappels d'événements</p>
                    <p className="text-sm text-gray-500">Rappels 24h avant vos événements</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Newsletter marketing</p>
                    <p className="text-sm text-gray-500">Recevez nos conseils et actualités</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Button className="h-11">Enregistrer les préférences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Facturation */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Facturation et abonnement
              </CardTitle>
              <CardDescription>
                Gérez votre plan et vos moyens de paiement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Plan actuel</p>
                    <p className="text-2xl font-bold mt-1">Standard</p>
                    <p className="text-gray-600 mt-1">10$ / mois</p>
                  </div>
                  <Button>Améliorer le plan</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Moyen de paiement</h3>
                <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-500">Expire 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Modifier</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Historique de facturation</h3>
                <div className="space-y-2">
                  {[
                    { date: "15 Jan 2025", amount: "10$", status: "Payé" },
                    { date: "15 Déc 2024", amount: "10$", status: "Payé" },
                    { date: "15 Nov 2024", amount: "10$", status: "Payé" },
                  ].map((invoice) => (
                    <div key={invoice.date} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">{invoice.date}</span>
                      <span className="font-medium">{invoice.amount}</span>
                      <span className="text-sm text-green-600">{invoice.status}</span>
                      <Button variant="ghost" size="sm">Télécharger</Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité du compte
              </CardTitle>
              <CardDescription>
                Protégez votre compte avec des paramètres de sécurité avancés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Changer le mot de passe</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Mot de passe actuel</Label>
                    <Input type="password" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nouveau mot de passe</Label>
                    <Input type="password" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirmer le nouveau mot de passe</Label>
                    <Input type="password" className="h-11" />
                  </div>
                  <Button className="h-11">Mettre à jour le mot de passe</Button>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h3 className="font-semibold">Authentification à deux facteurs</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">2FA activé</p>
                    <p className="text-sm text-gray-500">Sécurité renforcée pour votre compte</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h3 className="font-semibold">Sessions actives</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                    <div>
                      <p className="font-medium">Paris, France</p>
                      <p className="text-sm text-gray-500">Chrome sur Windows • Actif maintenant</p>
                    </div>
                    <Button variant="ghost" size="sm">Déconnecter</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Préférences */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Préférences générales
              </CardTitle>
              <CardDescription>
                Personnalisez votre expérience EventMaster
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Langue</Label>
                <Select defaultValue="fr">
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Fuseau horaire</Label>
                <Select defaultValue="paris">
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paris">(GMT+1) Paris</SelectItem>
                    <SelectItem value="london">(GMT+0) Londres</SelectItem>
                    <SelectItem value="newyork">(GMT-5) New York</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Format de date</Label>
                <Select defaultValue="dd/mm/yyyy">
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/mm/yyyy">JJ/MM/AAAA</SelectItem>
                    <SelectItem value="mm/dd/yyyy">MM/JJ/AAAA</SelectItem>
                    <SelectItem value="yyyy-mm-dd">AAAA-MM-JJ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="h-11">Enregistrer les préférences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Apparence */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Apparence
              </CardTitle>
              <CardDescription>
                Personnalisez l'interface à votre goût
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Thème</Label>
                <div className="grid grid-cols-3 gap-4">
                  {["Clair", "Sombre", "Auto"].map((theme) => (
                    <button
                      key={theme}
                      className="p-6 border-2 border-primary rounded-lg hover:bg-gray-50 transition"
                    >
                      <p className="font-medium">{theme}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Couleur d'accent</Label>
                <div className="grid grid-cols-6 gap-3">
                  {["#FF6B35", "#4ECDC4", "#6C5CE7", "#00B894", "#FDCB6E", "#E17055"].map((color) => (
                    <button
                      key={color}
                      className="aspect-square rounded-lg border-2 hover:scale-110 transition"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <Button className="h-11">Appliquer les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
