/**
 * PAGE: Statistiques & Analytics
 * Tableau de bord analytique avec graphiques et métriques
 */
"use client"

import { BarChart3, TrendingUp, Users, Calendar, Download, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AnalyticsPage() {
  // Données de mock
  const topEvents = [
    { name: "Mariage Sophie & Marc", guests: 250, scans: 198, rate: 79 },
    { name: "Concert Rock Festival", guests: 500, scans: 456, rate: 91 },
    { name: "Formation Marketing", guests: 50, scans: 42, rate: 84 },
    { name: "Gala de Charité", guests: 120, scans: 98, rate: 82 },
  ]

  const kpis = [
    { label: "Total événements", value: "12", change: "+15%", icon: Calendar, color: "text-blue-600" },
    { label: "Total invités", value: "1,248", change: "+23%", icon: Users, color: "text-green-600" },
    { label: "Taux de présence", value: "85%", change: "+5%", icon: Eye, color: "text-purple-600" },
    { label: "QR codes générés", value: "956", change: "+18%", icon: BarChart3, color: "text-orange-600" },
  ]

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistiques & Analytics</h1>
          <p className="text-gray-600 mt-2">Suivez vos performances et insights</p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Exporter le rapport
        </Button>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{kpi.label}</p>
                    <p className="text-3xl font-bold mt-2">{kpi.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">{kpi.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-gray-50 ${kpi.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Graphiques */}
      <Tabs defaultValue="events" className="space-y-6">
        <TabsList>
          <TabsTrigger value="events">Événements</TabsTrigger>
          <TabsTrigger value="guests">Invités</TabsTrigger>
          <TabsTrigger value="qrcodes">QR Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Graphique principal */}
            <Card>
              <CardHeader>
                <CardTitle>Performance des événements</CardTitle>
                <CardDescription>Taux de présence par événement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border">
                  <BarChart3 className="h-24 w-24 text-gray-300" />
                </div>
              </CardContent>
            </Card>

            {/* Top événements */}
            <Card>
              <CardHeader>
                <CardTitle>Top événements</CardTitle>
                <CardDescription>Classement par taux de présence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topEvents.map((event, index) => (
                    <div key={event.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{event.name}</p>
                            <p className="text-sm text-gray-500">
                              {event.scans}/{event.guests} invités présents
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-primary">{event.rate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${event.rate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guests">
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-24 w-24 text-gray-300 mx-auto" />
              <p className="text-gray-500 mt-4">Statistiques des invités à venir</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qrcodes">
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-24 w-24 text-gray-300 mx-auto" />
              <p className="text-gray-500 mt-4">Statistiques des QR codes à venir</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
