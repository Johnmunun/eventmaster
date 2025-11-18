/**
 * PAGE: Scanner QR Code
 * Permet de scanner les QR codes des invités en temps réel
 */
"use client"

import { useState } from "react"
import { ScanLine, CheckCircle, XCircle, Camera, Users, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false)
  
  // Données de mock pour les scans récents
  const recentScans = [
    { id: 1, name: "Marie Dupont", event: "Mariage Sophie & Marc", time: "Il y a 2 min", status: "success" },
    { id: 2, name: "Jean Martin", event: "Concert Rock Festival", time: "Il y a 5 min", status: "success" },
    { id: 3, name: "Pierre Durand", event: "Formation Marketing", time: "Il y a 8 min", status: "error" },
    { id: 4, name: "Sophie Bernard", event: "Mariage Sophie & Marc", time: "Il y a 12 min", status: "success" },
  ]

  const stats = [
    { label: "Total scannés", value: "234", icon: ScanLine, color: "text-blue-600" },
    { label: "Validés", value: "198", icon: CheckCircle, color: "text-green-600" },
    { label: "Refusés", value: "36", icon: XCircle, color: "text-red-600" },
    { label: "En attente", value: "42", icon: Users, color: "text-orange-600" },
  ]

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Scanner QR Code</h1>
        <p className="text-gray-600 mt-2">Scannez les QR codes de vos invités pour valider leur entrée</p>
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Zone de scan */}
        <Card>
          <CardHeader>
            <CardTitle>Scanner en direct</CardTitle>
            <CardDescription>Positionnez le QR code devant la caméra</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Zone caméra */}
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              {scanning ? (
                <div className="text-center">
                  <Camera className="h-24 w-24 text-primary mx-auto animate-pulse" />
                  <p className="text-sm text-gray-600 mt-4">Scan en cours...</p>
                </div>
              ) : (
                <div className="text-center">
                  <ScanLine className="h-24 w-24 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600 mt-4">Caméra inactive</p>
                </div>
              )}
            </div>

            {/* Boutons de contrôle */}
            <div className="space-y-3">
              <Button 
                onClick={() => setScanning(!scanning)} 
                className="w-full h-12"
              >
                <Camera className="h-5 w-5 mr-2" />
                {scanning ? "Arrêter le scan" : "Démarrer le scan"}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Ou</span>
                </div>
              </div>

              {/* Scan manuel */}
              <div className="space-y-2">
                <Label htmlFor="manual-code">Code manuel</Label>
                <div className="flex gap-2">
                  <Input 
                    id="manual-code" 
                    placeholder="Entrez le code QR" 
                    className="h-11"
                  />
                  <Button variant="outline" className="h-11">
                    Valider
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scans récents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Scans récents</CardTitle>
              <CardDescription>Dernières validations effectuées</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div 
                  key={scan.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    {scan.status === "success" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{scan.name}</p>
                      <p className="text-sm text-gray-500">{scan.event}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={scan.status === "success" ? "default" : "destructive"}>
                      {scan.status === "success" ? "Validé" : "Refusé"}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{scan.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
