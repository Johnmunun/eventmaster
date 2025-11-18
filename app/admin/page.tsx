/**
 * Page principale du Dashboard Admin - Vue d'ensemble
 * Affiche les statistiques globales et le monitoring système
 */

"use client"

import { Card } from "@/components/ui/card"
import { Users, Calendar, DollarSign, TrendingUp, AlertTriangle, Activity, QrCode, Zap, ArrowUp, ArrowDown } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vue d'ensemble</h1>
        <p className="text-gray-600 mt-1">Tableau de bord administrateur EventMaster</p>
      </div>

      {/* Statistiques principales - 4 cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Utilisateurs totaux */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <ArrowUp className="h-4 w-4" />
              12.5%
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">12,847</div>
          <div className="text-sm text-gray-600 mt-1">Utilisateurs inscrits</div>
          <div className="text-xs text-gray-500 mt-2">+1,247 ce mois</div>
        </Card>

        {/* Événements créés */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <ArrowUp className="h-4 w-4" />
              8.3%
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">8,392</div>
          <div className="text-sm text-gray-600 mt-1">Événements actifs</div>
          <div className="text-xs text-gray-500 mt-2">+543 cette semaine</div>
        </Card>

        {/* Revenus mensuels */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500 rounded-xl shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <ArrowUp className="h-4 w-4" />
              23.1%
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">€89,247</div>
          <div className="text-sm text-gray-600 mt-1">Revenus du mois</div>
          <div className="text-xs text-gray-500 mt-2">€12,450 aujourd'hui</div>
        </Card>

        {/* QR Codes générés */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
              <QrCode className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <ArrowUp className="h-4 w-4" />
              15.7%
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">47,829</div>
          <div className="text-sm text-gray-600 mt-1">QR Codes générés</div>
          <div className="text-xs text-gray-500 mt-2">+2,847 cette semaine</div>
        </Card>
      </div>

      {/* Ligne 2 - Monitoring système et activité */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monitoring système */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monitoring Système</h3>
            <Activity className="h-5 w-5 text-primary" />
          </div>
          
          <div className="space-y-4">
            {/* CPU Usage */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Utilisation CPU</span>
                <span className="font-semibold text-gray-900">47%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: '47%' }} />
              </div>
            </div>

            {/* Memory Usage */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Mémoire RAM</span>
                <span className="font-semibold text-gray-900">68%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>

            {/* Storage */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Stockage</span>
                <span className="font-semibold text-gray-900">82%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>

            {/* Database */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Base de données</span>
                <span className="font-semibold text-gray-900">54%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{ width: '54%' }} />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-900">Tous les systèmes opérationnels</span>
            </div>
          </div>
        </Card>

        {/* Activité récente */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Activité en temps réel</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-600">Live</span>
            </div>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto">
            {[
              { type: 'user', action: 'Nouvelle inscription', user: 'Sophie Martin', time: 'Il y a 30 sec', color: 'blue' },
              { type: 'payment', action: 'Paiement reçu', user: 'Plan Premium - €20', time: 'Il y a 1 min', color: 'green' },
              { type: 'event', action: 'Événement créé', user: 'Mariage Julie & Marc', time: 'Il y a 2 min', color: 'purple' },
              { type: 'qr', action: 'QR Code scanné', user: 'Concert Rock Festival', time: 'Il y a 3 min', color: 'orange' },
              { type: 'support', action: 'Ticket support', user: 'Problème technique', time: 'Il y a 5 min', color: 'red' },
              { type: 'user', action: 'Connexion utilisateur', user: 'Thomas Dubois', time: 'Il y a 6 min', color: 'blue' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`w-2 h-2 bg-${activity.color}-500 rounded-full mt-2`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{activity.user}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Ligne 3 - Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plans d'abonnement */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition Plans</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Gratuit</span>
              <span className="text-sm font-bold text-blue-600">6,842</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Standard (10€)</span>
              <span className="text-sm font-bold text-green-600">4,235</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Premium (20€)</span>
              <span className="text-sm font-bold text-purple-600">1,770</span>
            </div>
          </div>
        </Card>

        {/* Crédits IA */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Crédits IA
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Distribués</span>
              <span className="text-sm font-bold text-yellow-600">1.2M</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Utilisés</span>
              <span className="text-sm font-bold text-orange-600">847K</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Restants</span>
              <span className="text-sm font-bold text-green-600">353K</span>
            </div>
          </div>
        </Card>

        {/* Alertes & Issues */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Alertes actives
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Critiques</span>
              <span className="text-sm font-bold text-red-600">2</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Moyennes</span>
              <span className="text-sm font-bold text-orange-600">7</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Mineures</span>
              <span className="text-sm font-bold text-yellow-600">12</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
