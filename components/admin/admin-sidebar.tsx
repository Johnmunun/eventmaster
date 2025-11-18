/**
 * Sidebar de navigation pour le Dashboard Admin
 * Navigation vers toutes les sections d'administration avec contrôle total
 */

"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Calendar, QrCode, CreditCard, BarChart3, Settings, ChevronLeft, ChevronRight, Shield, FileText, MessageSquare, DollarSign, Zap, Database, AlertTriangle, UserCheck, Palette } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Navigation complète de l'admin
const navigation = [
  { name: "Vue d'ensemble", href: "/admin", icon: LayoutDashboard },
  { name: "Utilisateurs", href: "/admin/users", icon: Users },
  { name: "Événements", href: "/admin/events", icon: Calendar },
  { name: "QR Codes", href: "/admin/qrcodes", icon: QrCode },
  { name: "Transactions", href: "/admin/transactions", icon: DollarSign },
  { name: "Crédits IA", href: "/admin/credits", icon: Zap },
  { name: "Statistiques", href: "/admin/analytics", icon: BarChart3 },
  { name: "Support", href: "/admin/support", icon: MessageSquare },
  { name: "Modération", href: "/admin/moderation", icon: Shield },
  { name: "Templates", href: "/admin/templates", icon: Palette },
  { name: "Logs & Audits", href: "/admin/logs", icon: FileText },
  { name: "Base de données", href: "/admin/database", icon: Database },
  { name: "Alertes", href: "/admin/alerts", icon: AlertTriangle },
  { name: "Configuration", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white border-r border-slate-700 transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Admin avec badge */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg shadow-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg">Admin Panel</span>
              <div className="text-xs text-red-400">EventMaster</div>
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-8 w-8 text-white hover:bg-slate-700", collapsed && "mx-auto")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                    isActive
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{item.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Badge Admin avec accès utilisateur */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-700">
          <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg p-3 border border-red-500/30">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="h-4 w-4 text-red-400" />
              <div className="text-xs font-semibold text-red-400">Accès Admin</div>
            </div>
            <div className="text-xs text-slate-300 mb-2">Contrôle total système</div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full text-xs h-7 border-slate-600 text-slate-300 hover:bg-slate-700"
              asChild
            >
              <Link href="/dashboard">Vue Utilisateur</Link>
            </Button>
          </div>
        </div>
      )}
    </aside>
  )
}
