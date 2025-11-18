"use client"

import { useState } from "react"
import { Palette, Layout, Image, Type, Wand2, Download, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

/**
 * Page Designer - Personnalisation des designs
 * Permet de créer et personnaliser les invitations, badges et QR codes
 * Interface de design avec preview en temps réel
 */
export default function DesignerPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("wedding")

  // Templates prédéfinis
  const templates = [
    { id: "wedding", name: "Mariage Élégant", category: "Mariage", preview: "/elegant-wedding-invitation.png" },
    { id: "concert", name: "Concert Rock", category: "Concert", preview: "/rock-concert-ticket.jpg" },
    { id: "corporate", name: "Corporate Pro", category: "Corporate", preview: "/corporate-event-badge.jpg" },
    { id: "birthday", name: "Anniversaire Fun", category: "Anniversaire", preview: "/birthday-party-invitation.jpg" },
    { id: "conference", name: "Conférence Tech", category: "Formation", preview: "/tech-conference-badge.jpg" },
    { id: "gala", name: "Gala VIP", category: "Gala", preview: "/luxury-gala-invitation.jpg" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Designer</h1>
          <p className="text-gray-600">Créez et personnalisez vos invitations et badges</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Prévisualiser
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Télécharger
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panneau de personnalisation */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                Personnalisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="template" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="template">Template</TabsTrigger>
                  <TabsTrigger value="colors">Couleurs</TabsTrigger>
                  <TabsTrigger value="text">Texte</TabsTrigger>
                </TabsList>

                <TabsContent value="template" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Catégorie</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wedding">💒 Mariage</SelectItem>
                        <SelectItem value="concert">🎸 Concert</SelectItem>
                        <SelectItem value="corporate">💼 Corporate</SelectItem>
                        <SelectItem value="training">📚 Formation</SelectItem>
                        <SelectItem value="gala">🎭 Gala</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Format</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="invitation">Invitation</SelectItem>
                        <SelectItem value="badge">Badge</SelectItem>
                        <SelectItem value="ticket">Billet</SelectItem>
                        <SelectItem value="qrcode">QR Code</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="colors" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Couleur principale</Label>
                    <div className="flex gap-2">
                      <Input type="color" className="h-12 w-20" defaultValue="#FF6B35" />
                      <Input defaultValue="#FF6B35" className="flex-1 h-12" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Couleur secondaire</Label>
                    <div className="flex gap-2">
                      <Input type="color" className="h-12 w-20" defaultValue="#4ECDC4" />
                      <Input defaultValue="#4ECDC4" className="flex-1 h-12" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Couleur de fond</Label>
                    <div className="flex gap-2">
                      <Input type="color" className="h-12 w-20" defaultValue="#FFFFFF" />
                      <Input defaultValue="#FFFFFF" className="flex-1 h-12" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="text" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Police de titre</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une police" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="poppins">Poppins</SelectItem>
                        <SelectItem value="playfair">Playfair Display</SelectItem>
                        <SelectItem value="montserrat">Montserrat</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Taille du titre</Label>
                    <Slider defaultValue={[24]} max={48} min={12} step={2} />
                    <p className="text-xs text-muted-foreground">24px</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Alignement</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir l'alignement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Gauche</SelectItem>
                        <SelectItem value="center">Centre</SelectItem>
                        <SelectItem value="right">Droite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>

              <Button className="w-full gap-2">
                <Wand2 className="h-4 w-4" />
                Appliquer les modifications
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Zone de preview et templates */}
        <div className="lg:col-span-2 space-y-4">
          {/* Preview en temps réel */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Aperçu en temps réel
              </CardTitle>
              <CardDescription>Visualisez vos modifications instantanément</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
                <img
                  src="/elegant-wedding-invitation-preview.jpg"
                  alt="Preview"
                  className="max-w-full h-auto rounded-lg shadow-xl"
                />
              </div>
            </CardContent>
          </Card>

          {/* Galerie de templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5 text-primary" />
                Templates disponibles
              </CardTitle>
              <CardDescription>Choisissez un template pour commencer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`group cursor-pointer rounded-lg border-2 overflow-hidden transition-all hover:shadow-lg ${
                      selectedTemplate === template.id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="aspect-[4/3] bg-gray-100 relative">
                      <img
                        src={template.preview || "/placeholder.svg"}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                    </div>
                    <div className="p-3 bg-white">
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{template.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
