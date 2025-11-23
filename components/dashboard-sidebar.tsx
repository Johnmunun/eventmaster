"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, Users, QrCode, Sparkles, Send, BarChart3, Palette, ScanLine, CreditCard, Settings, ChevronLeft, ChevronRight, Wallet, Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Événements", href: "/dashboard/events", icon: Calendar },
  { name: "Invités", href: "/dashboard/guests", icon: Users },
  { name: "QR Codes & Badges", href: "/dashboard/qrcodes", icon: QrCode },
  { name: "IA EventMaster", href: "/dashboard/ai", icon: Sparkles },
  { name: "Communications", href: "/dashboard/communications", icon: Send },
  { name: "Statistiques", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Designer", href: "/dashboard/designer", icon: Palette },
  { name: "Scanner", href: "/dashboard/scanner", icon: ScanLine },
  { name: "Portefeuille", href: "/dashboard/wallet", icon: Wallet },
  { name: "Facturation", href: "/dashboard/billing", icon: CreditCard },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
]

// Hook pour détecter si on est sur mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// Composant de navigation réutilisable
function NavigationContent({ 
  pathname, 
  collapsed = false, 
  onLinkClick 
}: { 
  pathname: string
  collapsed?: boolean
  onLinkClick?: () => void 
}) {
  return (
    <nav className="flex-1 overflow-y-auto p-4">
      <ul className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={onLinkClick}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm",
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
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
  )
}

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useIsMobile()

  // Sur mobile, on ne montre pas le sidebar par défaut
  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 md:hidden h-10 w-10 bg-white shadow-md"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 [&>button]:hidden">
          <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <div className="p-1.5 bg-primary rounded-lg">
                  <QrCode className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg">EventMaster</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <NavigationContent 
              pathname={pathname} 
              onLinkClick={() => setMobileOpen(false)} 
            />

            {/* User Plan Badge */}
            <div className="p-4 border-t border-border">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-3 border border-primary/20">
                <div className="text-xs font-semibold text-primary mb-1">Plan Standard</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">10$ / mois</div>
                <Button size="sm" variant="outline" className="w-full mt-2 text-xs h-7">
                  Améliorer le plan
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // Version desktop
  return (
    <aside
      className={cn(
        "hidden md:flex sticky top-0 h-screen bg-white dark:bg-gray-900 border-r border-border transition-all duration-300 flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-lg">
              <QrCode className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">EventMaster</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-8 w-8", collapsed && "mx-auto")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <NavigationContent pathname={pathname} collapsed={collapsed} />

      {/* User Plan Badge */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-3 border border-primary/20">
            <div className="text-xs font-semibold text-primary mb-1">Plan Standard</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">10$ / mois</div>
            <Button size="sm" variant="outline" className="w-full mt-2 text-xs h-7">
              Améliorer le plan
            </Button>
          </div>
        </div>
      )}
    </aside>
  )
}
