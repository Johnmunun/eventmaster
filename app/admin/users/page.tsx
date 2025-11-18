/**
 * Page de gestion des utilisateurs (Admin)
 * Permet de voir, éditer, suspendre et gérer tous les utilisateurs
 */
"use client"

import { useState } from "react"
import { Plus, Search, MoreVertical, Mail, Shield, Ban, Trash2, Eye, Edit, DollarSign, Calendar, QrCode } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditUserDrawer } from "@/components/admin/users/edit-user-drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type User = {
  id: string
  name: string
  email: string
  avatar?: string
  plan: "free" | "standard" | "premium"
  status: "active" | "suspended" | "pending"
  credits: number
  events: number
  qrcodes: number
  joined: string
  lastActive: string
}

export default function AdminUsersPage() {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPlan, setFilterPlan] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Données factices d'utilisateurs
  const users: User[] = [
    {
      id: "1",
      name: "Sophie Martin",
      email: "sophie.martin@example.com",
      plan: "premium",
      status: "active",
      credits: 850,
      events: 12,
      qrcodes: 47,
      joined: "2024-01-15",
      lastActive: "Il y a 2h",
    },
    {
      id: "2",
      name: "Thomas Dubois",
      email: "thomas.dubois@example.com",
      plan: "standard",
      status: "active",
      credits: 320,
      events: 5,
      qrcodes: 18,
      joined: "2024-02-20",
      lastActive: "Il y a 1 jour",
    },
    {
      id: "3",
      name: "Marie Leroy",
      email: "marie.leroy@example.com",
      plan: "free",
      status: "suspended",
      credits: 50,
      events: 2,
      qrcodes: 4,
      joined: "2024-03-10",
      lastActive: "Il y a 5 jours",
    },
    {
      id: "4",
      name: "Lucas Bernard",
      email: "lucas.bernard@example.com",
      plan: "premium",
      status: "active",
      credits: 1200,
      events: 24,
      qrcodes: 89,
      joined: "2023-11-05",
      lastActive: "Il y a 10 min",
    },
  ]

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "premium":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "standard":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "suspended":
        return "bg-red-100 text-red-700"
      default:
        return "bg-yellow-100 text-yellow-700"
    }
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête avec statistiques rapides */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
        <p className="text-gray-600 mt-1">Vue complète et contrôle total sur tous les utilisateurs</p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">12,847</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-gray-900">11,234</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Premium</p>
                <p className="text-2xl font-bold text-gray-900">1,770</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspendus</p>
                <p className="text-2xl font-bold text-gray-900">143</p>
              </div>
              <Ban className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtre Plan */}
            <Select value={filterPlan} onValueChange={setFilterPlan}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tous les plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les plans</SelectItem>
                <SelectItem value="free">Gratuit</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtre Statut */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="suspended">Suspendus</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des utilisateurs */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">Utilisateur</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">Plan</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">Statut</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">Crédits</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">Événements</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">QR Codes</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">Dernière activité</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    {/* Utilisateur */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-primary text-white">
                            {user.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="p-4">
                      <Badge className={getPlanColor(user.plan)}>
                        {user.plan === "free" ? "Gratuit" : user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                      </Badge>
                    </td>

                    {/* Statut */}
                    <td className="p-4">
                      <Badge className={getStatusColor(user.status)}>
                        {user.status === "active" ? "Actif" : user.status === "suspended" ? "Suspendu" : "En attente"}
                      </Badge>
                    </td>

                    {/* Crédits */}
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-900">{user.credits}</span>
                        <span className="text-xs text-yellow-600">crédits</span>
                      </div>
                    </td>

                    {/* Événements */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{user.events}</span>
                      </div>
                    </td>

                    {/* QR Codes */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{user.qrcodes}</span>
                      </div>
                    </td>

                    {/* Dernière activité */}
                    <td className="p-4">
                      <span className="text-sm text-gray-600">{user.lastActive}</span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir profil
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Envoyer email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-orange-600">
                            <Ban className="h-4 w-4 mr-2" />
                            Suspendre
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Drawer d'édition */}
      <EditUserDrawer 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen}
        user={selectedUser}
      />
    </div>
  )
}
