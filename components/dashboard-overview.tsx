"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, QrCode, TrendingUp, Plus, ArrowRight, Sparkles, Eye, Download, Send, CheckCircle2, Clock, BarChart2 } from 'lucide-react'
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { SkeletonStatCard } from "@/components/skeletons"

interface DashboardStats {
  totalEvents: number
  ongoingEvents: number
  totalQrCodes: number
  totalGuests: number
  confirmedGuests: number
  attendedGuests: number
  totalScans: number
  confirmationRate: string
  attendanceRate: string
  invitationsSent: number
  eventsChange: string
  qrCodesChange: string
  guestsChange: string
  eventsThisMonth: number
  qrCodesThisWeek: number
  guestsThisMonth: number
}

interface Event {
  id: string
  name: string
  date: string
  time: string
  location: string
  guests: number
  confirmed: number
  status: string
  progress: number
}

interface Activity {
  id: string
  action: string
  event: string
  user: string
  time: string
  type: string
}

export function DashboardOverview() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [statsData, setStatsData] = useState<DashboardStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)
  const [userName, setUserName] = useState<string>("")

  // Afficher un toast d'accueil si l'utilisateur vient de se connecter
  useEffect(() => {
    const loggedIn = searchParams.get("loggedIn")
    if (loggedIn === "true") {
      toast.success("Bienvenue sur votre tableau de bord ! 🎉", {
        description: "Vous êtes maintenant connecté à EventMaster",
        duration: 4000,
      })
      // Nettoyer l'URL en supprimant le paramètre
      router.replace("/dashboard", { scroll: false })
    }
  }, [searchParams, router])

  // Charger les statistiques
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")
        const data = await response.json()
        
        if (data.success && data.stats) {
          setStatsData(data.stats)
        } else {
          toast.error("Erreur", {
            description: "Impossible de charger les statistiques",
          })
        }
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error)
        toast.error("Erreur", {
          description: "Une erreur est survenue lors du chargement des statistiques",
        })
      } finally {
        setIsLoadingStats(false)
      }
    }

    fetchStats()
  }, [])

  // Charger les événements à venir
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/dashboard/events")
        const data = await response.json()
        
        if (data.success && data.events) {
          setUpcomingEvents(data.events)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des événements:", error)
      } finally {
        setIsLoadingEvents(false)
      }
    }

    fetchEvents()
  }, [])

  // Charger les activités récentes
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("/api/dashboard/activities")
        const data = await response.json()
        
        if (data.success && data.activities) {
          setRecentActivities(data.activities)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des activités:", error)
      } finally {
        setIsLoadingActivities(false)
      }
    }

    fetchActivities()
  }, [])

  // Charger le nom de l'utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user/profile")
        const data = await response.json()
        
        if (data.success && data.user) {
          setUserName(data.user.name || data.user.email?.split("@")[0] || "Utilisateur")
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error)
      }
    }

    fetchUser()
  }, [])

  // Formater les nombres avec séparateurs
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num)
  }

  const stats = statsData ? [
    {
      title: "Événements créés",
      value: formatNumber(statsData.totalEvents),
      change: statsData.eventsChange,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: statsData.eventsThisMonth > 0 ? "up" : "neutral" as const
    },
    {
      title: "Événements en cours",
      value: formatNumber(statsData.ongoingEvents),
      change: `${statsData.ongoingEvents} actif${statsData.ongoingEvents > 1 ? 's' : ''}`,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "neutral" as const
    },
    {
      title: "QR codes générés",
      value: formatNumber(statsData.totalQrCodes),
      change: statsData.qrCodesChange,
      icon: QrCode,
      color: "text-primary",
      bgColor: "bg-orange-100",
      trend: statsData.qrCodesThisWeek > 0 ? "up" : "neutral" as const
    },
    {
      title: "Total d'invités",
      value: formatNumber(statsData.totalGuests),
      change: statsData.guestsChange,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: statsData.guestsThisMonth > 0 ? "up" : "neutral" as const
    },
    {
      title: "Taux de confirmation",
      value: statsData.confirmationRate,
      change: `${statsData.confirmedGuests} confirmé${statsData.confirmedGuests > 1 ? 's' : ''}`,
      icon: CheckCircle2,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
      trend: parseFloat(statsData.confirmationRate) > 50 ? "up" : "neutral" as const
    },
    {
      title: "Taux de présence",
      value: statsData.attendanceRate,
      change: `${statsData.attendedGuests} présent${statsData.attendedGuests > 1 ? 's' : ''}`,
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      trend: parseFloat(statsData.attendanceRate) > 50 ? "up" : "neutral" as const
    },
    {
      title: "Total scans",
      value: formatNumber(statsData.totalScans),
      change: `${statsData.totalScans} scan${statsData.totalScans > 1 ? 's' : ''} effectué${statsData.totalScans > 1 ? 's' : ''}`,
      icon: BarChart2,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      trend: statsData.totalScans > 0 ? "up" : "neutral" as const
    },
    {
      title: "Invitations envoyées",
      value: formatNumber(statsData.invitationsSent),
      change: `${statsData.invitationsSent} invitation${statsData.invitationsSent > 1 ? 's' : ''}`,
      icon: Send,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      trend: statsData.invitationsSent > 0 ? "up" : "neutral" as const
    },
  ] : []

  const quickActions = [
    {
      title: "Créer un événement",
      description: "Lancez un nouvel événement en quelques clics",
      icon: Calendar,
      color: "bg-blue-500",
      href: "/dashboard/events/new"
    },
    {
      title: "Générer un QR code",
      description: "Créez un QR code personnalisé",
      icon: QrCode,
      color: "bg-primary",
      href: "/dashboard/qrcodes/new"
    },
    {
      title: "Lancer un scan",
      description: "Scannez les QR codes de vos invités",
      icon: Eye,
      color: "bg-green-500",
      href: "/dashboard/scanner"
    },
    {
      title: "Exporter une liste",
      description: "Téléchargez vos données",
      icon: Download,
      color: "bg-purple-500",
      href: "/dashboard/guests"
    },
  ]


  const aiRecommendations = [
    {
      title: "Optimisez votre taux de confirmation",
      description: "Envoyez un rappel personnalisé à vos invités non confirmés pour augmenter votre taux de 15%",
      action: "Envoyer maintenant"
    },
    {
      title: "Design d'invitation suggéré",
      description: "Nous avons généré un design élégant pour votre prochain événement basé sur vos préférences",
      action: "Voir le design"
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
          <p className="text-gray-600">
            Bienvenue {userName || "..."} ! Voici un aperçu complet de vos événements.
          </p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Créer un événement
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoadingStats ? (
          // Skeleton de chargement
          Array.from({ length: 8 }).map((_, index) => (
            <SkeletonStatCard key={index} />
          ))
        ) : stats.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Aucune statistique disponible</p>
          </div>
        ) : (
          stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-2 border-transparent hover:border-primary/20 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Effet de brillance au hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`relative p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-xl ${stat.bgColor} blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                    <Icon className={`relative h-6 w-6 ${stat.color} drop-shadow-sm`} />
                  </div>
                  {stat.trend === "up" && (
                    <div className="flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full text-xs font-semibold">
                      <TrendingUp className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })
        )}
      </div>

      {/* Quick Actions */}
      <Card className="border-2 border-primary/10 bg-gradient-to-br from-white via-primary/5 to-accent/5 dark:from-gray-900 dark:via-primary/10 dark:to-accent/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Raccourcis rapides
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Accédez rapidement aux fonctionnalités essentielles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link key={index} href={action.href}>
                  <div className="group relative p-5 border-2 border-border rounded-xl bg-white dark:bg-gray-800 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer overflow-hidden">
                    {/* Effet de gradient au hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10">
                      <div className={`relative ${action.color} p-4 rounded-xl inline-flex mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                        {/* Glow effect */}
                        <div className={`absolute inset-0 ${action.color} rounded-xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />
                        <Icon className="relative h-6 w-6 text-white drop-shadow-md" />
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-primary transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {action.description}
                      </p>
                      <div className="mt-3 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 dark:from-primary/20 dark:via-primary/10 dark:to-accent/20">
          {/* Effet de brillance animé */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg animate-pulse" />
                <Sparkles className="relative h-6 w-6 text-primary animate-pulse" />
              </div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Recommandations IA
              </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              Suggestions pour améliorer vos événements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 relative z-10">
            {aiRecommendations.map((rec, index) => (
              <div 
                key={index} 
                className="group p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border-2 border-primary/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
              >
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {rec.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {rec.description}
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-white transition-all group/btn"
                >
                  {rec.action}
                  <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-2 border-accent/20 bg-gradient-to-br from-white to-accent/5 dark:from-gray-900 dark:to-accent/10">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Activités récentes
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Timeline des dernières actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const iconConfig = {
                  scan: { icon: QrCode, bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
                  confirmation: { icon: CheckCircle2, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
                  guest: { icon: Users, bg: 'bg-purple-100 dark:bg-purple-900/30', color: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
                  email: { icon: Send, bg: 'bg-orange-100 dark:bg-orange-900/30', color: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' }
                }
                const config = iconConfig[activity.type as keyof typeof iconConfig] || iconConfig.email
                const Icon = config.icon
                
                return (
                  <div 
                    key={activity.id} 
                    className="group flex gap-4 p-3 rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`relative h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 border-2 ${config.bg} ${config.border} group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                      <div className={`absolute inset-0 ${config.bg} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity`} />
                      <Icon className={`relative h-5 w-5 ${config.color} drop-shadow-sm`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {activity.event}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">{activity.user}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="border-2 border-primary/10 bg-gradient-to-br from-white via-primary/5 to-accent/5 dark:from-gray-900 dark:via-primary/10 dark:to-accent/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Événements à venir
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Vos prochains événements et leur statut
              </CardDescription>
            </div>
            <Link href="/dashboard/events">
              <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-white transition-all group">
                Voir tout
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className="group relative p-6 border-2 border-border rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden"
              >
                {/* Effet de gradient au hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-primary transition-colors">
                        {event.name}
                      </h4>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{event.date} à {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-primary">📍</span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border-2 shadow-sm ${
                      event.status === "En cours"
                        ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                        : "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Confirmations</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {event.confirmed} / {event.guests}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={event.progress} 
                        className="h-3 bg-gray-200 dark:bg-gray-700"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white drop-shadow-sm">
                          {event.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
