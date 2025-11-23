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
    <div className="space-y-4 sm:space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Scanner QR Code</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">Scannez les QR codes de vos invités pour valider leur entrée</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{stat.label}</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800 ${stat.color} flex-shrink-0 ml-2`}>
                    <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Zone de scan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Scanner en direct</CardTitle>
            <CardDescription className="text-sm">Positionnez le QR code devant la caméra</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
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
                className="w-full h-11 sm:h-12 text-sm sm:text-base"
              >
                <Camera className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {scanning ? "Arrêter le scan" : "Démarrer le scan"}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">Ou</span>
                </div>
              </div>

              {/* Scan manuel */}
              <div className="space-y-2">
                <Label htmlFor="manual-code" className="text-sm">Code manuel</Label>
                <div className="flex gap-2">
                  <Input 
                    id="manual-code" 
                    placeholder="Entrez le code QR" 
                    className="h-10 sm:h-11 text-sm sm:text-base"
                  />
                  <Button variant="outline" className="h-10 sm:h-11 px-3 sm:px-4 text-sm sm:text-base">
                    Valider
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scans récents */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl">Scans récents</CardTitle>
              <CardDescription className="text-sm">Dernières validations effectuées</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              {recentScans.map((scan) => (
                <div 
                  key={scan.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {scan.status === "success" ? (
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">{scan.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{scan.event}</p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col sm:text-right items-center sm:items-end gap-2">
                    <Badge variant={scan.status === "success" ? "default" : "destructive"} className="text-xs">
                      {scan.status === "success" ? "Validé" : "Refusé"}
                    </Badge>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{scan.time}</p>
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
