"use client"

import { Smartphone, Tablet, Monitor, MoreVertical, X } from "lucide-react"
import { useState } from "react"

type DeviceType = 'phone' | 'tablet' | 'desktop'

interface DeviceBarProps {
  onDeviceChange?: (device: DeviceType) => void
}

export function DeviceBar({ onDeviceChange }: DeviceBarProps) {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('phone')
  const [isOpen, setIsOpen] = useState(false)

  const handleDeviceSelect = (device: DeviceType) => {
    setSelectedDevice(device)
    setIsOpen(false)
    if (onDeviceChange) {
      onDeviceChange(device)
    }
  }

  return (
    <>
      {/* Bouton menu en bas du mockup */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-primary text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110"
        title="Options d'affichage"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <MoreVertical className="w-5 h-5" />
        )}
      </button>

      {/* Menu bulle avec animation */}
      {isOpen && (
        <div className="absolute bottom-16 right-4 z-50 animate-bubble-in">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 p-3 flex flex-col gap-2 min-w-[180px]">
            {/* Pointe de la bulle */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white/95 backdrop-blur-md border-r border-b border-gray-200/50 transform rotate-45"></div>
            
            <button
              onClick={() => handleDeviceSelect('phone')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                selectedDevice === 'phone'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              title="Téléphone"
            >
              <Smartphone className="w-5 h-5" />
              <span className="text-sm font-medium">Mobile</span>
            </button>
            <button
              onClick={() => handleDeviceSelect('tablet')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                selectedDevice === 'tablet'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              title="Tablette"
            >
              <Tablet className="w-5 h-5" />
              <span className="text-sm font-medium">Tablette</span>
            </button>
            <button
              onClick={() => handleDeviceSelect('desktop')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                selectedDevice === 'desktop'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              title="Ordinateur"
            >
              <Monitor className="w-5 h-5" />
              <span className="text-sm font-medium">Desktop</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

