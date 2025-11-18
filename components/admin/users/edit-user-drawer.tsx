/**
 * Drawer d'édition d'utilisateur (Admin)
 * Formulaire complet pour modifier les informations et permissions d'un utilisateur
 */
"use client"

import { useState } from "react"
import { X, Save, Shield, Zap, CreditCard } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

type User = {
  id: string
  name: string
  email: string
  plan: string
  status: string
  credits: number
  events: number
  qrcodes: number
  joined: string
  lastActive: string
}

interface EditUserDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

export function EditUserDrawer({ open, onOpenChange, user }: EditUserDrawerProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    plan: user?.plan || "free",
    status: user?.status || "active",
    credits: user?.credits || 0,
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Mise à jour utilisateur:", formData)
    onOpenChange(false)
  }

  if (!user) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[480px] overflow-y-auto">
        {/* Header fixe */}
        <SheetHeader className="pb-4 border-b bg-[#fafafa] -mx-6 -mt-6 px-6 pt-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-xl">Modifier l'utilisateur</SheetTitle>
              <SheetDescription className="mt-1">
                Gestion complète du profil et des permissions
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Informations personnelles */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Informations personnelles
            </h3>

            <div className="space-y-4 pl-6">
              {/* Nom */}
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Sophie Martin"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sophie.martin@example.com"
                />
              </div>
            </div>
          </div>

          {/* Section: Abonnement */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Abonnement et statut
            </h3>

            <div className="space-y-4 pl-6">
              {/* Plan */}
              <div className="space-y-2">
                <Label htmlFor="plan">Plan d'abonnement</Label>
                <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Gratuit (3€)</SelectItem>
                    <SelectItem value="standard">Standard (10€)</SelectItem>
                    <SelectItem value="premium">Premium (20€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Statut */}
              <div className="space-y-2">
                <Label htmlFor="status">Statut du compte</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section: Crédits IA */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Gestion des crédits IA
            </h3>

            <div className="space-y-4 pl-6">
              {/* Crédits */}
              <div className="space-y-2">
                <Label htmlFor="credits">Nombre de crédits</Label>
                <Input
                  id="credits"
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                  placeholder="850"
                />
                <p className="text-xs text-gray-500">
                  Crédits actuels: {user.credits} • Ajustez selon les besoins
                </p>
              </div>

              {/* Actions rapides */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, credits: formData.credits + 100 })}
                >
                  +100 crédits
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, credits: formData.credits + 500 })}
                >
                  +500 crédits
                </Button>
              </div>
            </div>
          </div>

          {/* Section: Permissions avancées */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Permissions avancées</h3>

            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="unlimited-events" className="cursor-pointer">
                  Événements illimités
                </Label>
                <Switch id="unlimited-events" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="unlimited-qrcodes" className="cursor-pointer">
                  QR Codes illimités
                </Label>
                <Switch id="unlimited-qrcodes" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="priority-support" className="cursor-pointer">
                  Support prioritaire
                </Label>
                <Switch id="priority-support" />
              </div>
            </div>
          </div>

          {/* Notes admin */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes administratives (privées)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes internes sur cet utilisateur..."
              rows={3}
            />
          </div>
        </form>

        {/* Footer fixe */}
        <SheetFooter className="border-t bg-white -mx-6 -mb-6 px-6 py-4 mt-6">
          <div className="flex gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 gap-2"
            >
              <Save className="h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
