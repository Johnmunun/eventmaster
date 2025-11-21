/**
 * Exemple d'intégration du système de cadres QR code
 * 
 * Ce composant montre comment intégrer QRWithFrame et FrameSelector
 * dans votre étape d'apparence QR code
 */

"use client"

import { useState, useRef } from "react"
import { QRWithFrameSimple } from "./qr-with-frame"
import { FrameSelector } from "./frame-selector"
import { FrameConfig } from "@/lib/qr-frames"
import { downloadQRCodeFromContainer } from "@/lib/qr-download"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"

interface QRFrameIntegrationExampleProps {
  qrData: string // Les données du QR code
  onQRCodeGenerated?: (imageDataUrl: string) => void
}

export function QRFrameIntegrationExample({
  qrData,
  onQRCodeGenerated,
}: QRFrameIntegrationExampleProps) {
  const [selectedFrame, setSelectedFrame] = useState<FrameConfig | null>(null)
  const [frameColor, setFrameColor] = useState<string>("#000000")
  const [qrColor, setQrColor] = useState<string>("#000000")
  const [qrBackgroundColor, setQrBackgroundColor] = useState<string>("#FFFFFF")
  const [size, setSize] = useState<number>(512)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!containerRef.current) {
      toast.error("Erreur", { description: "Impossible de télécharger le QR code" })
      return
    }

    try {
      await downloadQRCodeFromContainer(containerRef.current, "qrcode-with-frame")
      toast.success("Téléchargé !", { description: "Le QR code a été téléchargé avec succès" })
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error)
      toast.error("Erreur", { description: "Impossible de télécharger le QR code" })
    }
  }

  const handleFrameSelect = (frame: FrameConfig | null) => {
    setSelectedFrame(frame)
    if (frame?.defaultColor) {
      setFrameColor(frame.defaultColor)
    }
  }

  return (
    <div className="space-y-6">
      {/* Sélecteur de cadre */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Choisir un cadre</h3>
        <FrameSelector
          selectedFrame={selectedFrame}
          onFrameSelect={handleFrameSelect}
          frameColor={frameColor}
          onColorChange={setFrameColor}
        />
      </div>

      {/* Prévisualisation */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Prévisualisation</h3>
        <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div ref={containerRef} className="inline-block">
            <QRWithFrameSimple
              frame={selectedFrame}
              value={qrData}
              frameColor={frameColor}
              size={size}
              qrColor={qrColor}
              qrBackgroundColor={qrBackgroundColor}
              errorCorrectionLevel="H"
            />
          </div>
        </div>
      </div>

      {/* Options de personnalisation */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Couleur du QR code</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={qrColor}
              onChange={(e) => setQrColor(e.target.value)}
              className="w-12 h-10 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={qrColor}
              onChange={(e) => setQrColor(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md text-sm"
              placeholder="#000000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Fond du QR code</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={qrBackgroundColor}
              onChange={(e) => setQrBackgroundColor(e.target.value)}
              className="w-12 h-10 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={qrBackgroundColor}
              onChange={(e) => setQrBackgroundColor(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md text-sm"
              placeholder="#FFFFFF"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Taille (px)</label>
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value) || 512)}
            min={256}
            max={1024}
            step={64}
            className="w-full px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </div>

      {/* Bouton de téléchargement */}
      <div className="flex justify-end">
        <Button onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Télécharger en PNG
        </Button>
      </div>
    </div>
  )
}


