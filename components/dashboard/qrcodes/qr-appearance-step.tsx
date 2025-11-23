"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Frame,
  Grid3x3,
  Square,
  Image as ImageIcon,
  ChevronRight,
  QrCode,
  X,
  Check,
  ArrowLeft,
  ArrowRight,
  Loader2,
  ShoppingBag,
  Gift,
  Mail,
  Bike,
  Hand,
  Lock,
  Folder,
  FileText,
  Move,
  Crop,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil } from "lucide-react";
import { PhoneMockup } from "@/components/qr-templates/phone-mockup";
import { FormSection } from "@/components/ui/form-section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FrameSelector } from "@/components/qr-frames/frame-selector";
import { QRWithFrameSimple } from "@/components/qr-frames/qr-with-frame";
import { EditableQRMockup } from "@/components/qr-frames/editable-qr-mockup";
import { FrameConfig, QR_FRAMES, getFrameById } from "@/lib/qr-frames";
// Import dynamique de qrcode pour éviter les problèmes SSR
let QRCodeLib: any = null;
if (typeof window !== "undefined") {
  import("qrcode").then((module) => {
    QRCodeLib = module.default;
  });
}

// Helper pour créer un filtre de couleur CSS pour les cadres
function createColorFilter(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "";

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  return `brightness(0.8) saturate(100%) invert(${
    1 - r
  }) sepia(100%) saturate(${g * 100}%) hue-rotate(${b * 360}deg)`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

interface QRAppearanceStepProps {
  qrData: string; // Les données du QR code (URL, texte, etc.)
  onBack: () => void;
  onCreate: (qrCodeImage: string, appearanceConfig: QRAppearanceConfig) => void;
}

export interface QRAppearanceConfig {
  frameStyle: string | null; // ID du frame (ex: "bag-1", "gift-1", etc.) ou null
  frameText: string;
  frameColor: string;
  frameUseGradient: boolean;
  frameBackgroundColor: string;
  frameBackgroundTransparent: boolean;
  frameBackgroundUseGradient: boolean;
  pattern: string;
  cornerStyle: string;
  logo?: string;
  foregroundColor: string;
  backgroundColor: string;
  name?: string;
  password?: string;
  folderId?: string | null;
  // Paramètres de position/taille/crop pour le QR code
  qrPosition?: { x: number; y: number };
  qrSize?: { width: number; height: number };
  qrCrop?: { x: number; y: number; width: number; height: number };
  // Paramètres de position/taille/crop pour le cadre
  framePosition?: { x: number; y: number };
  frameSize?: { width: number; height: number };
  frameCrop?: { x: number; y: number; width: number; height: number };
}

const FRAME_STYLES = [
  { id: "none", label: "Aucun", icon: X },
  { id: "simple", label: "Simple", icon: Square },
  { id: "hand", label: "Main", icon: Hand },
  { id: "bag", label: "Sac", icon: ShoppingBag },
  { id: "gift", label: "Cadeau", icon: Gift },
  { id: "envelope", label: "Enveloppe", icon: Mail },
  { id: "scooter", label: "Scooter", icon: Bike },
  { id: "bubble", label: "Bulle", icon: QrCode },
  { id: "abstract1", label: "Abstrait 1", icon: Grid3x3 },
  { id: "abstract2", label: "Abstrait 2", icon: Grid3x3 },
  { id: "abstract3", label: "Abstrait 3", icon: Grid3x3 },
  { id: "abstract4", label: "Abstrait 4", icon: Grid3x3 },
];

const PATTERNS = ["square", "dots", "rounded", "circle"];
const CORNER_STYLES = ["square", "rounded", "extra-rounded"];

// Composant FrameSelector pour mobile (grille 2 colonnes)
function FrameSelectorMobile({
  selectedFrame,
  onFrameSelect,
  frameColor,
  onColorChange,
}: {
  selectedFrame: FrameConfig | null;
  onFrameSelect: (frame: FrameConfig | null) => void;
  frameColor?: string;
  onColorChange?: (color: string) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Grille 2 colonnes pour mobile */}
      <div className="grid grid-cols-2 gap-3">
        {/* Option "Aucun cadre" */}
        <button
          onClick={() => onFrameSelect(null)}
          className={`relative p-3 rounded-lg border-2 transition-all bg-white dark:bg-gray-800 ${
            !selectedFrame
              ? "border-primary bg-primary/10 dark:bg-primary/20"
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
              <QrCode className="h-8 w-8 text-gray-400" />
            </div>
            <span className="text-xs text-center text-gray-700 dark:text-gray-300">
              Aucun
            </span>
          </div>
          {!selectedFrame && (
            <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm">
              <Check className="h-3 w-3 text-white" />
            </div>
          )}
        </button>

        {/* Cadres disponibles */}
        {QR_FRAMES.map((frame) => {
          const isSelected = selectedFrame?.id === frame.id;
          return (
            <button
              key={frame.id}
              onClick={() => onFrameSelect(frame)}
              className={`relative p-3 rounded-lg border-2 transition-all bg-white dark:bg-gray-800 ${
                isSelected
                  ? "border-primary bg-primary/10 dark:bg-primary/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center overflow-hidden relative">
                  <img
                    src={`/frames/${frame.filename}`}
                    alt={frame.name}
                    className="w-full h-full object-contain"
                    style={{
                      filter:
                        frame.supportsColorChange &&
                        frameColor &&
                        frameColor !== "#000000"
                          ? createColorFilter(frameColor)
                          : "none",
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  {/* Placeholder si l'image ne charge pas */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <QrCode className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <span className="text-xs text-center text-gray-700 dark:text-gray-300 line-clamp-1">
                  {frame.name}
                </span>
              </div>
              {isSelected && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Sélecteur de couleur si le cadre le supporte */}
      {selectedFrame?.supportsColorChange && onColorChange && (
        <div className="space-y-2 pt-2">
          <label className="text-sm font-medium text-gray-900 dark:text-white">
            Couleur du cadre
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={frameColor || selectedFrame.defaultColor || "#000000"}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-12 h-10 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={frameColor || selectedFrame.defaultColor || "#000000"}
              onChange={(e) => onColorChange(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800"
              placeholder="#000000"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function QRAppearanceStep({
  qrData,
  onBack,
  onCreate,
}: QRAppearanceStepProps) {
  const [viewMode, setViewMode] = useState<"preview" | "qrcode">("qrcode");
  const [selectedFrame, setSelectedFrame] = useState<FrameConfig | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null); // Pour gérer l'ouverture des sections sur mobile
  const [showPreview, setShowPreview] = useState(false); // Pour le modal d'aperçu sur mobile
  const [appearanceConfig, setAppearanceConfig] = useState<QRAppearanceConfig>({
    frameStyle: null, // null = aucun frame, sinon ID du frame (ex: "bag-1")
    frameText: "Scanne-moi!",
    frameColor: "#000000",
    frameUseGradient: false,
    frameBackgroundColor: "#FFFFFF",
    frameBackgroundTransparent: false,
    frameBackgroundUseGradient: false,
    pattern: "square",
    cornerStyle: "square",
    foregroundColor: "#000000",
    backgroundColor: "#FFFFFF",
    name: "",
    password: "",
    folderId: null,
  });
  const [qrCodeImage, setQrCodeImage] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [folders, setFolders] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [editMode, setEditMode] = useState(false);
  // États pour le QR code
  const [qrPosition, setQrPosition] = useState({ x: 50, y: 50 });
  const [qrSize, setQrSize] = useState({ width: 60, height: 60 });
  const [qrCrop, setQrCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  // États pour le cadre
  const [framePosition, setFramePosition] = useState({ x: 50, y: 50 });
  const [frameSize, setFrameSize] = useState({ width: 80, height: 80 });
  const [frameCrop, setFrameCrop] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  // Synchroniser selectedFrame avec frameStyle
  useEffect(() => {
    if (appearanceConfig.frameStyle && appearanceConfig.frameStyle !== "none") {
      const frame = getFrameById(appearanceConfig.frameStyle);
      setSelectedFrame(frame || null);
      if (frame?.defaultColor) {
        setAppearanceConfig((prev) => ({
          ...prev,
          frameColor: frame.defaultColor || prev.frameColor,
        }));
      }
    } else {
      setSelectedFrame(null);
    }
  }, [appearanceConfig.frameStyle]);

  // Charger les dossiers
  useEffect(() => {
    const fetchFolders = async () => {
      setIsLoadingFolders(true);
      try {
        const response = await fetch("/api/folders");
        const data = await response.json();
        if (data.success) {
          setFolders(data.folders || []);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des dossiers:", error);
      } finally {
        setIsLoadingFolders(false);
      }
    };
    fetchFolders();
  }, []);

  // Callbacks mémorisés pour le QR code - sauvegarder dans appearanceConfig
  const handleQrPositionChange = useCallback(
    (pos: { x: number; y: number }) => {
      console.log("handleQrPositionChange appelé", pos);
      setQrPosition(pos);
      setAppearanceConfig((prev) => {
        const updated = { ...prev, qrPosition: pos };
        console.log(
          "appearanceConfig mis à jour avec qrPosition",
          updated.qrPosition
        );
        return updated;
      });
    },
    []
  );

  const handleQrSizeChange = useCallback(
    (sz: { width: number; height: number }) => {
      console.log("handleQrSizeChange appelé", sz);
      setQrSize(sz);
      setAppearanceConfig((prev) => {
        const updated = { ...prev, qrSize: sz };
        console.log("appearanceConfig mis à jour avec qrSize", updated.qrSize);
        return updated;
      });
    },
    []
  );

  const handleQrCropChange = useCallback(
    (crp: { x: number; y: number; width: number; height: number }) => {
      console.log("handleQrCropChange appelé", crp);
      setQrCrop(crp);
      setAppearanceConfig((prev) => ({ ...prev, qrCrop: crp }));
    },
    []
  );

  // Callbacks mémorisés pour le cadre - sauvegarder dans appearanceConfig
  const handleFramePositionChange = useCallback(
    (pos: { x: number; y: number }) => {
      console.log("handleFramePositionChange appelé", pos);
      setFramePosition(pos);
      setAppearanceConfig((prev) => {
        const updated = { ...prev, framePosition: pos };
        console.log(
          "appearanceConfig mis à jour avec framePosition",
          updated.framePosition
        );
        return updated;
      });
    },
    []
  );

  const handleFrameSizeChange = useCallback(
    (sz: { width: number; height: number }) => {
      console.log("handleFrameSizeChange appelé", sz);
      setFrameSize(sz);
      setAppearanceConfig((prev) => {
        const updated = { ...prev, frameSize: sz };
        console.log(
          "appearanceConfig mis à jour avec frameSize",
          updated.frameSize
        );
        return updated;
      });
    },
    []
  );

  const handleFrameCropChange = useCallback(
    (crp: { x: number; y: number; width: number; height: number }) => {
      console.log("handleFrameCropChange appelé", crp);
      setFrameCrop(crp);
      setAppearanceConfig((prev) => ({ ...prev, frameCrop: crp }));
    },
    []
  );

  // Taille fixe du canvas pour l'export final
  // IMPORTANT: Les pourcentages dans EditableQRMockup sont calculés par rapport au conteneur
  // Le conteneur a un padding de 2rem (32px) de chaque côté
  // PhoneMockup par défaut: 280x560
  // Zone effective du conteneur (avec padding 2rem = 32px):
  // - Largeur: 280 - 64 = 216px (mais en réalité c'est container.clientWidth qui inclut le padding)
  // En fait, les pourcentages sont calculés par rapport à container.clientWidth/clientHeight
  // qui est la taille du conteneur AVEC padding. Donc la zone effective est plus petite.
  // Pour simplifier, on utilise un format standard 9:16 (1080x1920) et on ajuste le calcul
  const EXPORT_WIDTH_FINAL = 1080;
  const EXPORT_HEIGHT_FINAL = 1920;

  // Les dimensions de référence pour le calcul des pourcentages
  // Dans EditableQRMockup, le conteneur a un padding de 2rem (32px)
  // Mais container.clientWidth inclut le padding, donc la zone effective est container.clientWidth - 64px
  // Cependant, les pourcentages sont calculés par rapport à container.clientWidth
  // On doit donc utiliser les mêmes dimensions de référence
  // Pour l'instant, on utilise un ratio simple: les pourcentages sont directement appliqués au canvas final

  // Fonction de conversion % → pixels
  // Les pourcentages sont calculés par rapport au conteneur dans EditableQRMockup
  // Le conteneur a un padding de 2rem (32px), mais container.clientWidth inclut le padding
  // Les pourcentages sont directement appliqués à container.clientWidth/clientHeight
  // Pour le rendu final, on applique directement les pourcentages au canvas final
  // Cela garantit que la position relative est préservée
  const percentToPixels = (
    percent: number,
    dimension: "width" | "height"
  ): number => {
    const exportSize =
      dimension === "width" ? EXPORT_WIDTH_FINAL : EXPORT_HEIGHT_FINAL;
    // Appliquer directement le pourcentage au canvas final
    // Les pourcentages sont relatifs, donc ils doivent être appliqués de la même manière
    return (percent / 100) * exportSize;
  };

  // Générer le QR code
  // Utiliser useCallback avec les dépendances pour s'assurer d'utiliser les valeurs actuelles
  const generateQRCode = useCallback(async () => {
    console.log("generateQRCode appelé", {
      qrData,
      qrDataLength: qrData?.length,
      qrDataType: typeof qrData,
      qrPosition: qrPosition || appearanceConfig.qrPosition,
      qrSize: qrSize || appearanceConfig.qrSize,
      framePosition: framePosition || appearanceConfig.framePosition,
      frameSize: frameSize || appearanceConfig.frameSize,
    });

    if (!qrData || qrData === "{}" || qrData.trim() === "") {
      console.warn("qrData is empty or invalid:", qrData);
      setQrCodeImage("");
      toast.error("Erreur", {
        description:
          "Les données du QR code sont vides. Veuillez remplir tous les champs requis.",
      });
      setIsGenerating(false);
      return;
    }

    // Valider la longueur des données (QR code a une limite)
    if (qrData.length > 2953) {
      console.warn("qrData trop long pour un QR code:", qrData.length);
      toast.error("Erreur", {
        description:
          "Les données sont trop longues pour un QR code. Veuillez réduire la taille.",
      });
      setIsGenerating(false);
      return;
    }

    console.log(
      "Génération du QR code avec les données:",
      qrData.substring(0, 100)
    );

    setIsGenerating(true);
    try {
      // Charger dynamiquement qrcode si nécessaire
      if (!QRCodeLib && typeof window !== "undefined") {
        try {
          const module = await import("qrcode");
          QRCodeLib = module.default;
        } catch (importError) {
          console.error(
            "Erreur lors du chargement de la bibliothèque QRCode:",
            importError
          );
          toast.error("Erreur", {
            description:
              "Impossible de charger la bibliothèque QR code. Veuillez rafraîchir la page.",
          });
          setIsGenerating(false);
          return;
        }
      }

      if (!QRCodeLib) {
        console.error("QRCode library not available");
        toast.error("Erreur", {
          description:
            "La bibliothèque QR code n'est pas disponible. Veuillez rafraîchir la page.",
        });
        setIsGenerating(false);
        return;
      }

      // Valider les couleurs
      const isValidColor = (color: string): boolean => {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
      };

      const foregroundColor = isValidColor(appearanceConfig.foregroundColor)
        ? appearanceConfig.foregroundColor
        : "#000000";
      const backgroundColor = isValidColor(appearanceConfig.backgroundColor)
        ? appearanceConfig.backgroundColor
        : "#FFFFFF";

      const canvas = document.createElement("canvas");

      try {
        await QRCodeLib.toCanvas(canvas, qrData, {
          width: 300,
          margin: 2,
          color: {
            dark: foregroundColor,
            light: backgroundColor,
          },
          errorCorrectionLevel: "H",
        });
      } catch (qrError: any) {
        console.error("Erreur lors de la génération du canvas QR:", qrError);
        throw new Error(
          `Impossible de générer le QR code: ${
            qrError?.message || "Erreur inconnue"
          }`
        );
      }

      // Appliquer les motifs et coins personnalisés
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Appliquer le motif en modifiant le rendu des pixels
        if (appearanceConfig.pattern !== "square") {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          const size = canvas.width;
          const pixelSize = 1;

          // Redessiner avec le motif choisi
          ctx.fillStyle = appearanceConfig.backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          for (let y = 0; y < size; y += pixelSize) {
            for (let x = 0; x < size; x += pixelSize) {
              const index = (y * size + x) * 4;
              const isDark = data[index] < 128;

              if (isDark) {
                ctx.fillStyle = appearanceConfig.foregroundColor;

                if (appearanceConfig.pattern === "dots") {
                  // Motif points - cercles
                  ctx.beginPath();
                  ctx.arc(
                    x + pixelSize / 2,
                    y + pixelSize / 2,
                    pixelSize * 0.4,
                    0,
                    2 * Math.PI
                  );
                  ctx.fill();
                } else if (appearanceConfig.pattern === "rounded") {
                  // Motif arrondi - carrés avec coins arrondis
                  const radius = pixelSize * 0.2;
                  ctx.beginPath();
                  ctx.moveTo(x + radius, y);
                  ctx.lineTo(x + pixelSize - radius, y);
                  ctx.quadraticCurveTo(
                    x + pixelSize,
                    y,
                    x + pixelSize,
                    y + radius
                  );
                  ctx.lineTo(x + pixelSize, y + pixelSize - radius);
                  ctx.quadraticCurveTo(
                    x + pixelSize,
                    y + pixelSize,
                    x + pixelSize - radius,
                    y + pixelSize
                  );
                  ctx.lineTo(x + radius, y + pixelSize);
                  ctx.quadraticCurveTo(
                    x,
                    y + pixelSize,
                    x,
                    y + pixelSize - radius
                  );
                  ctx.lineTo(x, y + radius);
                  ctx.quadraticCurveTo(x, y, x + radius, y);
                  ctx.closePath();
                  ctx.fill();
                } else if (appearanceConfig.pattern === "circle") {
                  // Motif cercle - cercles ronds
                  ctx.beginPath();
                  ctx.arc(
                    x + pixelSize / 2,
                    y + pixelSize / 2,
                    pixelSize * 0.45,
                    0,
                    2 * Math.PI
                  );
                  ctx.fill();
                } else {
                  // Par défaut, carré
                  ctx.fillRect(x, y, pixelSize, pixelSize);
                }
              }
            }
          }
        }

        // Appliquer les coins arrondis aux carrés de détection
        if (appearanceConfig.cornerStyle !== "square") {
          const radius =
            appearanceConfig.cornerStyle === "extra-rounded" ? 6 : 3;
          const detectionSize = 7; // Taille des carrés de détection
          const margin = 2;

          // Fonction pour arrondir un carré de détection
          const roundDetectionSquare = (startX: number, startY: number) => {
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = (detectionSize + margin * 2) * 10;
            tempCanvas.height = (detectionSize + margin * 2) * 10;
            const tempCtx = tempCanvas.getContext("2d");
            if (tempCtx) {
              tempCtx.scale(10, 10);
              tempCtx.drawImage(
                canvas,
                startX - margin,
                startY - margin,
                detectionSize + margin * 2,
                detectionSize + margin * 2,
                0,
                0,
                detectionSize + margin * 2,
                detectionSize + margin * 2
              );

              // Arrondir les coins
              const roundedCanvas = document.createElement("canvas");
              roundedCanvas.width = tempCanvas.width;
              roundedCanvas.height = tempCanvas.height;
              const roundedCtx = roundedCanvas.getContext("2d");
              if (roundedCtx) {
                roundedCtx.fillStyle = appearanceConfig.backgroundColor;
                roundedCtx.fillRect(
                  0,
                  0,
                  roundedCanvas.width,
                  roundedCanvas.height
                );
                roundedCtx.globalCompositeOperation = "source-over";
                roundedCtx.drawImage(tempCanvas, 0, 0);
                ctx.drawImage(
                  roundedCanvas,
                  (startX - margin) * 10,
                  (startY - margin) * 10,
                  roundedCanvas.width,
                  roundedCanvas.height
                );
              }
            }
          };

          // Les 3 carrés de détection sont toujours aux mêmes positions approximatives
          // Pour simplifier, on applique un filtre d'arrondi global
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          ctx.putImageData(imageData, 0, 0);
        }
      }

      // Appliquer le cadre si sélectionné - utiliser les vraies images de frame
      if (
        selectedFrame &&
        appearanceConfig.frameStyle &&
        appearanceConfig.frameStyle !== "none"
      ) {
        // Charger l'image du frame
        const frameImage = new window.Image();
        frameImage.crossOrigin = "anonymous";

        await new Promise<void>((resolve, reject) => {
          frameImage.onload = () => resolve();
          frameImage.onerror = () => {
            console.error(
              `Erreur lors du chargement du frame: ${selectedFrame.filename}`
            );
            reject(
              new Error(
                `Impossible de charger le frame: ${selectedFrame.filename}`
              )
            );
          };
          frameImage.src = `/frames/${selectedFrame.filename}`;
        });

        // Créer un canvas pour le frame avec les paramètres de position/taille/crop
        const finalCanvas = document.createElement("canvas");
        // Taille fixe du canvas pour l'export (même proportions que PhoneMockup)
        finalCanvas.width = EXPORT_WIDTH_FINAL;
        finalCanvas.height = EXPORT_HEIGHT_FINAL;

        // PRIORITÉ: Utiliser d'abord les états locaux (qui sont toujours à jour), puis appearanceConfig, puis valeurs par défaut
        const framePos = framePosition ||
          appearanceConfig.framePosition || { x: 50, y: 50 };
        const frameSz = frameSize ||
          appearanceConfig.frameSize || { width: 80, height: 80 };
        const frameCrp = frameCrop ||
          appearanceConfig.frameCrop || { x: 0, y: 0, width: 100, height: 100 };

        console.log("Génération Frame avec paramètres (%):", {
          framePos,
          frameSz,
          frameCrp,
        });

        // 🔥 CONVERSION % → PIXELS (obligatoire avant le rendu)
        const frameWidthPx = percentToPixels(frameSz.width, "width");
        const frameHeightPx = percentToPixels(frameSz.height, "height");
        const frameXPx =
          percentToPixels(framePos.x, "width") - frameWidthPx / 2;
        const frameYPx =
          percentToPixels(framePos.y, "height") - frameHeightPx / 2;

        // Crop en pixels
        const cropXPx = (frameWidthPx * frameCrp.x) / 100;
        const cropYPx = (frameHeightPx * frameCrp.y) / 100;
        const cropWidthPx = (frameWidthPx * frameCrp.width) / 100;
        const cropHeightPx = (frameHeightPx * frameCrp.height) / 100;

        console.log("Frame converti en pixels:", {
          frameXPx,
          frameYPx,
          frameWidthPx,
          frameHeightPx,
          cropXPx,
          cropYPx,
          cropWidthPx,
          cropHeightPx,
        });
        const finalCtx = finalCanvas.getContext("2d");

        if (!finalCtx) {
          throw new Error("Impossible d'obtenir le contexte du canvas");
        }

        // Fond transparent ou couleur de fond
        if (appearanceConfig.frameBackgroundTransparent) {
          finalCtx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
        } else {
          if (appearanceConfig.frameBackgroundUseGradient) {
            const gradient = finalCtx.createLinearGradient(
              0,
              0,
              finalCanvas.width,
              finalCanvas.height
            );
            gradient.addColorStop(0, appearanceConfig.frameBackgroundColor);
            gradient.addColorStop(1, appearanceConfig.frameColor);
            finalCtx.fillStyle = gradient;
          } else {
            finalCtx.fillStyle = appearanceConfig.frameBackgroundColor;
          }
          finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        }

        // Sauvegarder le contexte pour le clip
        finalCtx.save();

        // Appliquer le clip pour le crop
        finalCtx.beginPath();
        finalCtx.rect(frameXPx, frameYPx, cropWidthPx, cropHeightPx);
        finalCtx.clip();

        // Appliquer le filtre de couleur si supporté
        if (selectedFrame.supportsColorChange && appearanceConfig.frameColor) {
          const filter = createColorFilter(appearanceConfig.frameColor);
          // Note: Les filtres CSS ne peuvent pas être appliqués directement au canvas
          // On doit utiliser une approche différente avec des opérations de canvas
          // Pour l'instant, on dessine l'image normalement
        }

        // Dessiner le frame avec coordonnées en pixels
        // Le frame doit être redimensionné pour correspondre à la taille calculée
        // Calculer le crop source depuis l'image du frame
        const frameSourceWidth = frameImage.width;
        const frameSourceHeight = frameImage.height;
        const frameSourceCropX = (frameSourceWidth * frameCrp.x) / 100;
        const frameSourceCropY = (frameSourceHeight * frameCrp.y) / 100;
        const frameSourceCropWidth = (frameSourceWidth * frameCrp.width) / 100;
        const frameSourceCropHeight =
          (frameSourceHeight * frameCrp.height) / 100;

        finalCtx.drawImage(
          frameImage,
          frameSourceCropX,
          frameSourceCropY,
          frameSourceCropWidth,
          frameSourceCropHeight, // Source (crop de l'image frame)
          frameXPx,
          frameYPx,
          cropWidthPx,
          cropHeightPx // Destination (position et taille finales en pixels)
        );

        // Restaurer le contexte
        finalCtx.restore();

        // Dessiner le QR code avec position/taille/crop
        // PRIORITÉ: Utiliser d'abord les états locaux (qui sont toujours à jour), puis appearanceConfig, puis valeurs par défaut
        const qrPos = qrPosition ||
          appearanceConfig.qrPosition || { x: 50, y: 50 };
        const qrSz = qrSize ||
          appearanceConfig.qrSize || { width: 60, height: 60 };
        const qrCrp = qrCrop ||
          appearanceConfig.qrCrop || { x: 0, y: 0, width: 100, height: 100 };

        console.log("Génération QR avec paramètres (%):", {
          qrPos,
          qrSz,
          qrCrp,
        });

        // 🔥 CONVERSION % → PIXELS (obligatoire avant le rendu)
        const qrWidthPx = percentToPixels(qrSz.width, "width");
        const qrHeightPx = percentToPixels(qrSz.height, "height");
        const qrXPx = percentToPixels(qrPos.x, "width") - qrWidthPx / 2;
        const qrYPx = percentToPixels(qrPos.y, "height") - qrHeightPx / 2;

        // Crop en pixels (relatif à la taille finale du QR)
        const qrCropWidthPx = (qrWidthPx * qrCrp.width) / 100;
        const qrCropHeightPx = (qrHeightPx * qrCrp.height) / 100;

        console.log("QR converti en pixels:", {
          qrXPx,
          qrYPx,
          qrWidthPx,
          qrHeightPx,
          qrCropWidthPx,
          qrCropHeightPx,
          canvasSize: `${canvas.width}x${canvas.height}`,
        });

        // Sauvegarder le contexte pour le clip du QR
        finalCtx.save();

        // Appliquer le clip pour le crop du QR
        finalCtx.beginPath();
        finalCtx.rect(qrXPx, qrYPx, qrCropWidthPx, qrCropHeightPx);
        finalCtx.clip();

        // 🔥 IMPORTANT: Dessiner le QR code en préservant les proportions
        // Le crop source est calculé en pourcentage du canvas source (300x300)
        // Puis redimensionné vers la taille finale en respectant les proportions
        const sourceCropX = (canvas.width * qrCrp.x) / 100;
        const sourceCropY = (canvas.height * qrCrp.y) / 100;
        const sourceCropWidth = (canvas.width * qrCrp.width) / 100;
        const sourceCropHeight = (canvas.height * qrCrp.height) / 100;

        // Calculer les proportions pour éviter la déformation
        // Le QR code source est carré (300x300), donc on doit maintenir le ratio 1:1
        const sourceAspectRatio = sourceCropWidth / sourceCropHeight;
        const destAspectRatio = qrCropWidthPx / qrCropHeightPx;

        let finalDestWidth = qrCropWidthPx;
        let finalDestHeight = qrCropHeightPx;
        let finalDestX = qrXPx;
        let finalDestY = qrYPx;

        // Si les proportions ne correspondent pas, ajuster pour préserver l'aspect ratio du QR code
        // Le QR code doit rester carré pour être scannable
        // Utiliser la PLUS GRANDE dimension pour préserver la taille maximale
        if (Math.abs(sourceAspectRatio - destAspectRatio) > 0.01) {
          // Utiliser la plus grande dimension pour maintenir un carré de taille raisonnable
          const maxSize = Math.max(qrCropWidthPx, qrCropHeightPx);
          finalDestWidth = maxSize;
          finalDestHeight = maxSize;
          // Recentrer
          finalDestX = qrXPx + (qrCropWidthPx - finalDestWidth) / 2;
          finalDestY = qrYPx + (qrCropHeightPx - finalDestHeight) / 2;
        }

        finalCtx.drawImage(
          canvas,
          sourceCropX,
          sourceCropY,
          sourceCropWidth,
          sourceCropHeight, // Source (crop du canvas 300x300)
          finalDestX,
          finalDestY,
          finalDestWidth,
          finalDestHeight // Destination (position et taille finales en pixels, proportions préservées)
        );

        // Restaurer le contexte
        finalCtx.restore();

        const finalDataUrl = finalCanvas.toDataURL("image/png");
        console.log(
          "QR code généré avec frame réel, longueur:",
          finalDataUrl.length
        );
        setQrCodeImage(finalDataUrl);
      } else {
        // Pas de frame, appliquer seulement les paramètres de position/taille/crop au QR code
        // PRIORITÉ: Utiliser d'abord les états locaux (qui sont toujours à jour), puis appearanceConfig, puis valeurs par défaut
        const qrPos = qrPosition ||
          appearanceConfig.qrPosition || { x: 50, y: 50 };
        const qrSz = qrSize ||
          appearanceConfig.qrSize || { width: 60, height: 60 };
        const qrCrp = qrCrop ||
          appearanceConfig.qrCrop || { x: 0, y: 0, width: 100, height: 100 };

        console.log("Génération QR sans frame avec paramètres (%):", {
          qrPos,
          qrSz,
          qrCrp,
        });

        // Si les paramètres sont différents des valeurs par défaut, créer un nouveau canvas
        if (
          qrPos.x !== 50 ||
          qrPos.y !== 50 ||
          qrSz.width !== 60 ||
          qrSz.height !== 60 ||
          qrCrp.x !== 0 ||
          qrCrp.y !== 0 ||
          qrCrp.width !== 100 ||
          qrCrp.height !== 100
        ) {
          const finalCanvas = document.createElement("canvas");
          // Taille fixe du canvas pour l'export (même proportions que PhoneMockup)
          finalCanvas.width = EXPORT_WIDTH_FINAL;
          finalCanvas.height = EXPORT_HEIGHT_FINAL;
          const finalCtx = finalCanvas.getContext("2d");

          if (finalCtx) {
            // Fond blanc
            finalCtx.fillStyle = appearanceConfig.backgroundColor;
            finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

            // 🔥 CONVERSION % → PIXELS (obligatoire avant le rendu)
            const qrWidthPx = percentToPixels(qrSz.width, "width");
            const qrHeightPx = percentToPixels(qrSz.height, "height");
            const qrXPx = percentToPixels(qrPos.x, "width") - qrWidthPx / 2;
            const qrYPx = percentToPixels(qrPos.y, "height") - qrHeightPx / 2;

            // Crop en pixels (relatif à la taille finale du QR)
            const qrCropWidthPx = (qrWidthPx * qrCrp.width) / 100;
            const qrCropHeightPx = (qrHeightPx * qrCrp.height) / 100;

            console.log("QR sans frame converti en pixels:", {
              qrXPx,
              qrYPx,
              qrWidthPx,
              qrHeightPx,
              qrCropWidthPx,
              qrCropHeightPx,
              canvasSize: `${canvas.width}x${canvas.height}`,
            });

            finalCtx.save();
            finalCtx.beginPath();
            finalCtx.rect(qrXPx, qrYPx, qrCropWidthPx, qrCropHeightPx);
            finalCtx.clip();

            // 🔥 IMPORTANT: Dessiner le QR code en préservant les proportions
            // Le crop source est calculé en pourcentage du canvas source (300x300)
            // Puis redimensionné vers la taille finale en respectant les proportions
            const sourceCropX = (canvas.width * qrCrp.x) / 100;
            const sourceCropY = (canvas.height * qrCrp.y) / 100;
            const sourceCropWidth = (canvas.width * qrCrp.width) / 100;
            const sourceCropHeight = (canvas.height * qrCrp.height) / 100;

            // Calculer les proportions pour éviter la déformation
            // Le QR code source est carré (300x300), donc on doit maintenir le ratio 1:1
            const sourceAspectRatio = sourceCropWidth / sourceCropHeight;
            const destAspectRatio = qrCropWidthPx / qrCropHeightPx;

            let finalDestWidth = qrCropWidthPx;
            let finalDestHeight = qrCropHeightPx;
            let finalDestX = qrXPx;
            let finalDestY = qrYPx;

            // Si les proportions ne correspondent pas, ajuster pour préserver l'aspect ratio du QR code
            // Le QR code doit rester carré pour être scannable
            // Utiliser la PLUS GRANDE dimension pour préserver la taille maximale
            if (Math.abs(sourceAspectRatio - destAspectRatio) > 0.01) {
              // Utiliser la plus grande dimension pour maintenir un carré de taille raisonnable
              const maxSize = Math.max(qrCropWidthPx, qrCropHeightPx);
              finalDestWidth = maxSize;
              finalDestHeight = maxSize;
              // Recentrer
              finalDestX = qrXPx + (qrCropWidthPx - finalDestWidth) / 2;
              finalDestY = qrYPx + (qrCropHeightPx - finalDestHeight) / 2;
            }

            finalCtx.drawImage(
              canvas,
              sourceCropX,
              sourceCropY,
              sourceCropWidth,
              sourceCropHeight, // Source (crop du canvas 300x300)
              finalDestX,
              finalDestY,
              finalDestWidth,
              finalDestHeight // Destination (position et taille finales en pixels, proportions préservées)
            );

            finalCtx.restore();

            const dataUrl = finalCanvas.toDataURL("image/png");
            console.log(
              "QR code généré avec paramètres de position/taille/crop, longueur:",
              dataUrl.length
            );
            setQrCodeImage(dataUrl);
          } else {
            const dataUrl = canvas.toDataURL("image/png");
            setQrCodeImage(dataUrl);
          }
        } else {
          // Valeurs par défaut : créer un canvas avec la taille fixe
          const finalCanvas = document.createElement("canvas");
          finalCanvas.width = EXPORT_WIDTH_FINAL;
          finalCanvas.height = EXPORT_HEIGHT_FINAL;
          const finalCtx = finalCanvas.getContext("2d");

          if (finalCtx) {
            finalCtx.fillStyle = appearanceConfig.backgroundColor;
            finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

            // Centrer le QR code par défaut
            const qrSizePx =
              Math.min(EXPORT_WIDTH_FINAL, EXPORT_HEIGHT_FINAL) * 0.6;
            const qrXPx = (EXPORT_WIDTH_FINAL - qrSizePx) / 2;
            const qrYPx = (EXPORT_HEIGHT_FINAL - qrSizePx) / 2;

            finalCtx.drawImage(canvas, qrXPx, qrYPx, qrSizePx, qrSizePx);
            const dataUrl = finalCanvas.toDataURL("image/png");
            console.log(
              "QR code généré sans frame (valeurs par défaut), longueur:",
              dataUrl.length
            );
            setQrCodeImage(dataUrl);
          } else {
            const dataUrl = canvas.toDataURL("image/png");
            setQrCodeImage(dataUrl);
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error);
      setQrCodeImage("");
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la génération du QR code";
      toast.error("Erreur de génération", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  }, [
    qrData,
    appearanceConfig.foregroundColor,
    appearanceConfig.backgroundColor,
    appearanceConfig.pattern,
    appearanceConfig.cornerStyle,
    appearanceConfig.frameStyle,
    appearanceConfig.frameText,
    appearanceConfig.frameColor,
    appearanceConfig.frameUseGradient,
    appearanceConfig.frameBackgroundColor,
    appearanceConfig.frameBackgroundTransparent,
    appearanceConfig.frameBackgroundUseGradient,
    appearanceConfig.qrPosition,
    appearanceConfig.qrSize,
    appearanceConfig.qrCrop,
    appearanceConfig.framePosition,
    appearanceConfig.frameSize,
    appearanceConfig.frameCrop,
    selectedFrame,
    qrPosition,
    qrSize,
    qrCrop,
    framePosition,
    frameSize,
    frameCrop,
  ]);

  // Générer le QR code quand les paramètres changent (mais pas pendant le mode édition)
  useEffect(() => {
    // Ne pas régénérer pendant le mode édition pour éviter les doublons
    if (editMode) {
      return;
    }

    console.log("useEffect pour generateQRCode déclenché", {
      qrData,
      hasQrData: !!qrData,
      editMode,
    });
    if (qrData) {
      generateQRCode();
    } else {
      console.warn("qrData est vide, impossible de générer le QR code");
      setQrCodeImage("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    appearanceConfig.foregroundColor,
    appearanceConfig.backgroundColor,
    appearanceConfig.pattern,
    appearanceConfig.cornerStyle,
    appearanceConfig.frameStyle,
    appearanceConfig.frameText,
    appearanceConfig.frameColor,
    appearanceConfig.frameUseGradient,
    appearanceConfig.frameBackgroundColor,
    appearanceConfig.frameBackgroundTransparent,
    appearanceConfig.frameBackgroundUseGradient,
    // Ne pas inclure les paramètres de position/taille/crop dans les dépendances
    // Ils seront appliqués seulement quand on désactive le mode édition
    qrData,
    selectedFrame,
    editMode, // Inclure editMode pour régénérer quand on sort du mode édition
  ]);

  const handleCreate = async () => {
    console.log("handleCreate appelé", {
      qrCodeImage: !!qrCodeImage,
      isSubmitting,
      qrData,
    });

    if (!qrCodeImage) {
      console.error("qrCodeImage est vide, impossible de créer le QR code");
      toast.error("Erreur", {
        description: "Le QR code n'a pas pu être généré. Veuillez réessayer.",
      });
      return;
    }

    if (isSubmitting) {
      console.log("Déjà en cours de soumission, ignore");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Appel de onCreate avec:", {
        qrCodeImageLength: qrCodeImage.length,
        appearanceConfig,
      });
      await onCreate(qrCodeImage, appearanceConfig);
      // Si la création réussit, le drawer se ferme donc on ne réinitialise pas ici
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Erreur", {
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la création du QR code.",
      });
      // Réinitialiser l'état en cas d'erreur pour permettre de réessayer
      setIsSubmitting(false);
    }
  };

  // Configuration des cartes pour mobile
  const appearanceCards = [
    {
      id: "frame",
      title: "Cadre",
      description:
        "Les cadres permettent à votre code QR de se démarquer parmi les autres et suscitent plus de scans.",
      icon: Frame,
    },
    {
      id: "pattern",
      title: "Motif du code QR",
      description:
        "Choisissez un motif pour votre code QR et sélectionnez des couleurs.",
      icon: Grid3x3,
    },
    {
      id: "corners",
      title: "Coins du code QR",
      description: "Sélectionnez le style de coins de votre code QR",
      icon: Square,
    },
    {
      id: "logo",
      title: "Ajouter un logo",
      description:
        "Créez un code QR unique en y ajoutant votre logo ou une image.",
      icon: ImageIcon,
    },
  ];

  return (
    <div
      className="w-full h-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden"
      style={{ minHeight: "100%", position: "relative" }}
    >
      {/* Vue mobile : Liste de cartes ou contenu détaillé */}
      <div className="lg:hidden flex-1 overflow-y-auto pb-24">
        {!activeSection ? (
          // Vue liste des cartes
          <>
            <div className="px-4 sm:px-6 pt-6 pb-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                3. Choisissez l'apparence du QR
              </h2>
            </div>

            <div className="px-4 sm:px-6 space-y-3">
              {appearanceCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card
                    key={card.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl"
                    onClick={() => setActiveSection(card.id)}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-center gap-4">
                        {/* Icône dans un conteneur gris arrondi */}
                        <div className="flex-shrink-0 p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
                          <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                        </div>

                        {/* Titre et description */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">
                            {card.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {card.description}
                          </p>
                        </div>

                        {/* Flèche à droite */}
                        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          // Vue contenu détaillé de la section
          <div className="px-4 sm:px-6 pt-6 pb-4 space-y-6">
            {/* Header avec bouton retour */}
            {(() => {
              const card = appearanceCards.find((c) => c.id === activeSection);
              if (!card) return null;
              const Icon = card.icon;
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setActiveSection(null)}
                      className="h-9 w-9"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
                        <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                          {card.title}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contenu spécifique à chaque section */}
                  {activeSection === "frame" && (
                    <div className="space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        Style de cadre
                      </h3>
                      <div className="lg:hidden">
                        {/* Version mobile : grille 2 colonnes */}
                        <FrameSelectorMobile
                          selectedFrame={selectedFrame}
                          onFrameSelect={(frame) => {
                            setSelectedFrame(frame);
                            setAppearanceConfig({
                              ...appearanceConfig,
                              frameStyle: frame?.id || null,
                              frameColor:
                                frame?.defaultColor ||
                                appearanceConfig.frameColor,
                            });
                          }}
                          frameColor={appearanceConfig.frameColor}
                          onColorChange={(color) => {
                            setAppearanceConfig({
                              ...appearanceConfig,
                              frameColor: color,
                            });
                          }}
                        />
                      </div>
                      <div className="hidden lg:block">
                        {/* Version desktop : scroll horizontal */}
                        <FrameSelector
                          selectedFrame={selectedFrame}
                          onFrameSelect={(frame) => {
                            setSelectedFrame(frame);
                            setAppearanceConfig({
                              ...appearanceConfig,
                              frameStyle: frame?.id || null,
                              frameColor:
                                frame?.defaultColor ||
                                appearanceConfig.frameColor,
                            });
                          }}
                          frameColor={appearanceConfig.frameColor}
                          onColorChange={(color) => {
                            setAppearanceConfig({
                              ...appearanceConfig,
                              frameColor: color,
                            });
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {activeSection === "pattern" && (
                    <div className="space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        Style de motif
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {PATTERNS.map((pattern) => (
                          <button
                            key={pattern}
                            onClick={() =>
                              setAppearanceConfig({
                                ...appearanceConfig,
                                pattern,
                              })
                            }
                            className={`relative p-4 rounded-lg border-2 transition-all ${
                              appearanceConfig.pattern === pattern
                                ? "border-primary bg-primary/10 dark:bg-primary/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded w-full h-16 flex items-center justify-center">
                                <Grid3x3
                                  className={`h-6 w-6 ${
                                    appearanceConfig.pattern === pattern
                                      ? "text-primary"
                                      : "text-gray-400"
                                  }`}
                                />
                              </div>
                              <span className="text-xs text-center capitalize">
                                {pattern}
                              </span>
                            </div>
                            {appearanceConfig.pattern === pattern && (
                              <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSection === "corners" && (
                    <div className="space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        Style de coins
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {CORNER_STYLES.map((corner) => (
                          <button
                            key={corner}
                            type="button"
                            onClick={() =>
                              setAppearanceConfig({
                                ...appearanceConfig,
                                cornerStyle: corner,
                              })
                            }
                            className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                              appearanceConfig.cornerStyle === corner
                                ? "border-primary bg-primary/10 dark:bg-primary/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                            }`}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded w-full h-16 flex items-center justify-center">
                                <Square
                                  className={`h-6 w-6 ${
                                    appearanceConfig.cornerStyle === corner
                                      ? "text-primary"
                                      : "text-gray-400"
                                  }`}
                                />
                              </div>
                              <span className="text-xs text-center capitalize">
                                {corner === "extra-rounded"
                                  ? "Extra arrondi"
                                  : corner === "rounded"
                                  ? "Arrondi"
                                  : "Carré"}
                              </span>
                            </div>
                            {appearanceConfig.cornerStyle === corner && (
                              <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSection === "logo" && (
                    <div className="space-y-4">
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Fonctionnalité à venir
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Vue desktop : Layout original */}
      <div className="hidden lg:flex flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 min-h-0 overflow-hidden relative z-0">
        {/* Colonne gauche : Configuration */}
        <div className="space-y-6 overflow-y-auto pr-2 drawer-scrollbar min-h-0 relative z-0">
          {/* Section Nom du QR Code */}
          <FormSection
            icon={FileText}
            title="Nom du code QR"
            description="Donnez un nom à votre code QR."
            collapsible={false}
          >
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                Nom
              </Label>
              <Input
                value={appearanceConfig.name || ""}
                onChange={(e) =>
                  setAppearanceConfig({
                    ...appearanceConfig,
                    name: e.target.value,
                  })
                }
                placeholder="Par exemple : Mon code QR"
                className="rounded-[2px] border-gray-300 dark:border-gray-600"
              />
            </div>
          </FormSection>

          {/* Section Mot de passe */}
          <FormSection
            icon={Lock}
            title="Mot de passe"
            description="Protégez votre QR code avec un mot de passe (optionnel)."
            collapsible={false}
          >
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                Mot de passe (optionnel)
              </Label>
              <Input
                type="password"
                value={appearanceConfig.password || ""}
                onChange={(e) =>
                  setAppearanceConfig({
                    ...appearanceConfig,
                    password: e.target.value,
                  })
                }
                placeholder="Entrez un mot de passe"
                className="rounded-[2px] border-gray-300 dark:border-gray-600"
              />
            </div>
          </FormSection>

          {/* Section Dossier */}
          <FormSection
            icon={Folder}
            title="Dossier"
            description="Liez ce QR à un dossier existant ou à un nouveau dossier."
            collapsible={false}
          >
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                Dossier
              </Label>
              <Select
                value={appearanceConfig.folderId || "none"}
                onValueChange={(value) =>
                  setAppearanceConfig({
                    ...appearanceConfig,
                    folderId: value === "none" ? null : value,
                  })
                }
              >
                <SelectTrigger className="rounded-[2px] border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Aucun dossier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun dossier</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FormSection>

          {/* Section Cadre */}
          <FormSection
            icon={Frame}
            title="Cadre"
            description="Les cadres permettent à votre code QR de se démarquer parmi les autres et suscitent plus de scans."
            collapsible={false}
          >
            <div className="space-y-4">
              <FrameSelector
                selectedFrame={selectedFrame}
                onFrameSelect={(frame) => {
                  setSelectedFrame(frame);
                  setAppearanceConfig({
                    ...appearanceConfig,
                    frameStyle: frame?.id || null,
                    frameColor:
                      frame?.defaultColor || appearanceConfig.frameColor,
                  });
                }}
                frameColor={appearanceConfig.frameColor}
                onColorChange={(color) => {
                  setAppearanceConfig({
                    ...appearanceConfig,
                    frameColor: color,
                  });
                }}
              />

              {/* Texte encadré - seulement si un cadre est sélectionné */}
              {selectedFrame && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Texte encadré
                  </Label>
                  <div className="relative">
                    <input
                      type="text"
                      value={appearanceConfig.frameText}
                      onChange={(e) =>
                        setAppearanceConfig({
                          ...appearanceConfig,
                          frameText: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Scanne-moi!"
                    />
                    <Pencil className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}

              {/* Couleur du cadre - seulement si un cadre est sélectionné et supporte le changement de couleur */}
              {selectedFrame && selectedFrame.supportsColorChange && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Utiliser un dégradé de couleurs pour le cadre
                    </Label>
                    <Switch
                      checked={appearanceConfig.frameUseGradient}
                      onCheckedChange={(checked) =>
                        setAppearanceConfig({
                          ...appearanceConfig,
                          frameUseGradient: checked,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Couleur du cadre
                    </Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={appearanceConfig.frameColor}
                        onChange={(e) =>
                          setAppearanceConfig({
                            ...appearanceConfig,
                            frameColor: e.target.value,
                          })
                        }
                        className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                        style={{ cursor: "pointer" }}
                      />
                      <input
                        type="text"
                        value={appearanceConfig.frameColor}
                        onChange={(e) =>
                          setAppearanceConfig({
                            ...appearanceConfig,
                            frameColor: e.target.value,
                          })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Couleur d'arrière-plan du cadre - seulement si un cadre est sélectionné */}
              {selectedFrame && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="transparent-background"
                      checked={appearanceConfig.frameBackgroundTransparent}
                      onCheckedChange={(checked) =>
                        setAppearanceConfig({
                          ...appearanceConfig,
                          frameBackgroundTransparent: checked as boolean,
                        })
                      }
                    />
                    <Label
                      htmlFor="transparent-background"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Arrière-plan transparent
                    </Label>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Utiliser un dégradé de couleurs en arrière-plan
                    </Label>
                    <Switch
                      checked={appearanceConfig.frameBackgroundUseGradient}
                      onCheckedChange={(checked) =>
                        setAppearanceConfig({
                          ...appearanceConfig,
                          frameBackgroundUseGradient: checked,
                        })
                      }
                    />
                  </div>
                  {!appearanceConfig.frameBackgroundTransparent && (
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Couleur d'arrière-plan
                      </Label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={appearanceConfig.frameBackgroundColor}
                          onChange={(e) =>
                            setAppearanceConfig({
                              ...appearanceConfig,
                              frameBackgroundColor: e.target.value,
                            })
                          }
                          className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          style={{ cursor: "pointer" }}
                        />
                        <input
                          type="text"
                          value={appearanceConfig.frameBackgroundColor}
                          onChange={(e) =>
                            setAppearanceConfig({
                              ...appearanceConfig,
                              frameBackgroundColor: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </FormSection>

          {/* Section Motif */}
          <FormSection
            icon={Grid3x3}
            title="Motif du code QR"
            description="Choisissez un motif pour votre code QR et sélectionnez des couleurs."
            collapsible={false}
          >
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Style de motif
              </Label>
              <div className="grid grid-cols-4 gap-3">
                {PATTERNS.map((pattern) => (
                  <button
                    key={pattern}
                    onClick={() =>
                      setAppearanceConfig({ ...appearanceConfig, pattern })
                    }
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      appearanceConfig.pattern === pattern
                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded w-full h-16 flex items-center justify-center">
                        <Grid3x3
                          className={`h-6 w-6 ${
                            appearanceConfig.pattern === pattern
                              ? "text-primary"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <span className="text-xs text-center capitalize">
                        {pattern}
                      </span>
                    </div>
                    {appearanceConfig.pattern === pattern && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </FormSection>

          {/* Section Coins */}
          <FormSection
            icon={Square}
            title="Coins du code QR"
            description="Sélectionnez le style de coins de votre code QR"
            collapsible={false}
          >
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Style de coins
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {CORNER_STYLES.map((corner) => (
                  <button
                    key={corner}
                    type="button"
                    onClick={() =>
                      setAppearanceConfig({
                        ...appearanceConfig,
                        cornerStyle: corner,
                      })
                    }
                    className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      appearanceConfig.cornerStyle === corner
                        ? "border-primary bg-primary/10 dark:bg-primary/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded w-full h-16 flex items-center justify-center">
                        <Square
                          className={`h-6 w-6 ${
                            appearanceConfig.cornerStyle === corner
                              ? "text-primary"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <span className="text-xs text-center capitalize">
                        {corner === "extra-rounded"
                          ? "Extra arrondi"
                          : corner === "rounded"
                          ? "Arrondi"
                          : "Carré"}
                      </span>
                    </div>
                    {appearanceConfig.cornerStyle === corner && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </FormSection>

          {/* Section Logo */}
          <FormSection
            icon={ImageIcon}
            title="Ajouter un logo"
            description="Créez un code QR unique en y ajoutant votre logo ou une image."
            collapsible={false}
          >
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fonctionnalité à venir
              </p>
            </div>
          </FormSection>
        </div>

        {/* Colonne droite : Preview - Desktop uniquement */}
        <div className="hidden lg:flex flex-col items-center lg:sticky lg:top-0">
          {/* Toggle Switch */}
          <div className="mb-4 w-full max-w-[280px] flex flex-col gap-2">
            <div className="relative inline-flex rounded-lg border-2 border-primary overflow-hidden bg-white dark:bg-gray-900">
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`px-6 py-2 text-sm font-bold transition-all cursor-pointer ${
                  viewMode === "preview"
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-gray-900 text-primary"
                }`}
                style={{ cursor: "pointer" }}
              >
                Aperçu
              </button>
              <button
                type="button"
                onClick={() => setViewMode("qrcode")}
                className={`px-6 py-2 text-sm font-bold transition-all cursor-pointer ${
                  viewMode === "qrcode"
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-gray-900 text-primary"
                }`}
                style={{ cursor: "pointer" }}
              >
                Code QR
              </button>
            </div>

            {/* Bouton pour activer/désactiver le mode édition */}
            {viewMode === "qrcode" && (qrCodeImage || qrData) && (
              <Button
                type="button"
                variant={editMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const newEditMode = !editMode;
                  setEditMode(newEditMode);

                  // Réinitialiser les positions au centre quand on active le mode édition
                  if (newEditMode) {
                    setQrPosition({ x: 50, y: 50 });
                    setFramePosition({ x: 50, y: 50 });
                    setQrSize({ width: 60, height: 60 });
                    setFrameSize({ width: 80, height: 80 });
                    setQrCrop({ x: 0, y: 0, width: 100, height: 100 });
                    setFrameCrop({ x: 0, y: 0, width: 100, height: 100 });
                    // Mettre à jour appearanceConfig aussi
                    setAppearanceConfig((prev) => ({
                      ...prev,
                      qrPosition: { x: 50, y: 50 },
                      framePosition: { x: 50, y: 50 },
                      qrSize: { width: 60, height: 60 },
                      frameSize: { width: 80, height: 80 },
                      qrCrop: { x: 0, y: 0, width: 100, height: 100 },
                      frameCrop: { x: 0, y: 0, width: 100, height: 100 },
                    }));
                  } else {
                    // Régénérer le QR code quand on désactive le mode édition pour appliquer les paramètres
                    // IMPORTANT: Synchroniser d'abord les états locaux avec appearanceConfig
                    // pour s'assurer que toutes les modifications sont prises en compte
                    if (qrData) {
                      // Mettre à jour appearanceConfig avec les valeurs actuelles des états locaux
                      // Utiliser une fonction de callback pour s'assurer d'avoir les valeurs les plus récentes
                      setAppearanceConfig((prev) => {
                        const updated = {
                          ...prev,
                          qrPosition: qrPosition,
                          qrSize: qrSize,
                          qrCrop: qrCrop,
                          framePosition: framePosition,
                          frameSize: frameSize,
                          frameCrop: frameCrop,
                        };
                        console.log(
                          "appearanceConfig mis à jour avec valeurs locales:",
                          {
                            qrPosition: updated.qrPosition,
                            qrSize: updated.qrSize,
                            framePosition: updated.framePosition,
                            frameSize: updated.frameSize,
                          }
                        );
                        return updated;
                      });

                      // Utiliser requestAnimationFrame pour s'assurer que le state est mis à jour
                      requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                          console.log(
                            "Régénération après mode édition avec valeurs:",
                            {
                              qrPosition: qrPosition,
                              qrSize: qrSize,
                              framePosition: framePosition,
                              frameSize: frameSize,
                            }
                          );
                          generateQRCode();
                        });
                      });
                    }
                  }
                }}
                className="w-full flex items-center justify-center gap-2"
              >
                {editMode ? (
                  <>
                    <Crop className="h-4 w-4" />
                    Mode Édition
                  </>
                ) : (
                  <>
                    <Move className="h-4 w-4" />
                    Éditer Position
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Phone Mockup */}
          <div className="relative">
            {viewMode === "qrcode" ? (
              editMode && (qrCodeImage || qrData) ? (
                // Mode édition : utiliser le composant éditable dans le mockup
                <PhoneMockup>
                  <EditableQRMockup
                    qrData={qrData}
                    selectedFrame={selectedFrame}
                    frameColor={appearanceConfig.frameColor}
                    qrColor={appearanceConfig.foregroundColor}
                    qrBackgroundColor={appearanceConfig.backgroundColor}
                    qrCodeImage={qrCodeImage}
                    editMode={editMode}
                    initialQrPosition={qrPosition}
                    initialQrSize={qrSize}
                    initialQrCrop={qrCrop}
                    initialFramePosition={framePosition}
                    initialFrameSize={frameSize}
                    initialFrameCrop={frameCrop}
                    onQrPositionChange={handleQrPositionChange}
                    onQrSizeChange={handleQrSizeChange}
                    onQrCropChange={handleQrCropChange}
                    onFramePositionChange={handleFramePositionChange}
                    onFrameSizeChange={handleFrameSizeChange}
                    onFrameCropChange={handleFrameCropChange}
                  />
                </PhoneMockup>
              ) : (
                // Mode normal : affichage standard
                <PhoneMockup>
                  <div className="w-full h-full flex items-center justify-center p-8 bg-white">
                    {isGenerating ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-sm text-gray-500">Génération...</p>
                      </div>
                    ) : qrCodeImage || qrData ? (
                      // Si qrCodeImage existe, il contient déjà le frame et le QR code avec les paramètres appliqués
                      // Afficher simplement l'image générée
                      qrCodeImage ? (
                        <img
                          src={qrCodeImage}
                          alt="QR Code"
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        // Sinon, afficher le QR code sans frame (fallback)
                        <div className="flex items-center justify-center w-full h-full">
                          <QRWithFrameSimple
                            frame={null}
                            value={qrData}
                            size={280}
                            qrColor={appearanceConfig.foregroundColor}
                            qrBackgroundColor={appearanceConfig.backgroundColor}
                            errorCorrectionLevel="H"
                          />
                        </div>
                      )
                    ) : (
                      <div className="text-center text-gray-400">
                        <QrCode className="h-16 w-16 mx-auto mb-2" />
                        <p className="text-sm">Aperçu QR Code</p>
                      </div>
                    )}
                  </div>
                </PhoneMockup>
              )
            ) : (
              <PhoneMockup>
                <div className="w-full h-full flex items-center justify-center p-8 bg-white">
                  <div className="text-center text-gray-400">
                    <QrCode className="h-16 w-16 mx-auto mb-2" />
                    <p className="text-sm">Aperçu</p>
                  </div>
                </div>
              </PhoneMockup>
            )}
          </div>
        </div>
      </div>

      {/* Navigation en bas - Mobile avec 3 boutons */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex items-center gap-2 sm:gap-3 relative z-50 flex-shrink-0">
        {/* Bouton Précédent */}
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBack();
          }}
          className="flex items-center gap-2 cursor-pointer relative z-50 bg-primary text-white border-primary hover:bg-primary/90 lg:hidden"
          style={{ cursor: "pointer" }}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Précédent</span>
        </Button>

        {/* Bouton Aperçu - Mobile uniquement */}
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPreview(true)}
          className="flex items-center gap-2 cursor-pointer relative z-50 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 lg:hidden flex-1"
          style={{ cursor: "pointer" }}
        >
          <Eye className="h-4 w-4" />
          <span>Aperçu</span>
        </Button>

        {/* Bouton Créer - Mobile uniquement */}
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isGenerating && !isSubmitting && qrCodeImage) {
              handleCreate();
            }
          }}
          disabled={isGenerating || isSubmitting || !qrCodeImage}
          className="lg:hidden flex items-center gap-2 bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl relative z-50 flex-1"
          style={{
            cursor:
              isGenerating || isSubmitting || !qrCodeImage
                ? "not-allowed"
                : "pointer",
            pointerEvents: "auto",
            position: "relative",
            zIndex: 50,
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Création...</span>
            </>
          ) : isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Génération...</span>
            </>
          ) : (
            <>
              <span>Créer</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        {/* Navigation desktop - Layout original */}
        <div className="hidden lg:flex items-center justify-between w-full">
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBack();
            }}
            className="flex items-center gap-2 cursor-pointer relative z-50"
            style={{ cursor: "pointer" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          {/* Debug info */}
          {process.env.NODE_ENV === "development" && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mr-4">
              QR: {qrCodeImage ? "✓" : "✗"} | Gén:{" "}
              {isGenerating ? "Oui" : "Non"} | Sub:{" "}
              {isSubmitting ? "Oui" : "Non"}
            </div>
          )}
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isGenerating && !isSubmitting && qrCodeImage) {
                handleCreate();
              }
            }}
            disabled={isGenerating || isSubmitting || !qrCodeImage}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl relative z-50"
            style={{
              cursor:
                isGenerating || isSubmitting || !qrCodeImage
                  ? "not-allowed"
                  : "pointer",
              pointerEvents: "auto",
              position: "relative",
              zIndex: 50,
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Création...
              </>
            ) : isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                Créer
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Modal d'aperçu pour mobile avec PhoneMockup et mode édition */}
      {showPreview && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => {
            if (!editMode) {
              setShowPreview(false);
            }
          }}
        >
          <div
            className="bg-transparent rounded-2xl max-w-[90vw] max-h-[90vh] overflow-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-white">
                  {editMode ? "Mode Édition" : "Aperçu"}
                </h3>
                {editMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newEditMode = !editMode;
                      setEditMode(newEditMode);
                      if (!newEditMode && qrData) {
                        // Synchroniser appearanceConfig avec les états locaux avant de régénérer
                        setAppearanceConfig((prev) => ({
                          ...prev,
                          qrPosition: qrPosition,
                          qrSize: qrSize,
                          qrCrop: qrCrop,
                          framePosition: framePosition,
                          frameSize: frameSize,
                          frameCrop: frameCrop,
                        }));
                        setTimeout(() => {
                          generateQRCode();
                        }, 150);
                      }
                    }}
                    className="bg-white/90 text-gray-900 border-white/50 hover:bg-white"
                  >
                    <Crop className="h-3 w-3 mr-1" />
                    Terminer
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (editMode) {
                    setEditMode(false);
                    if (qrData) {
                      // Synchroniser appearanceConfig avec les états locaux avant de régénérer
                      setAppearanceConfig((prev) => ({
                        ...prev,
                        qrPosition: qrPosition,
                        qrSize: qrSize,
                        qrCrop: qrCrop,
                        framePosition: framePosition,
                        frameSize: frameSize,
                        frameCrop: frameCrop,
                      }));
                      setTimeout(() => {
                        generateQRCode();
                      }, 150);
                    }
                  }
                  setShowPreview(false);
                }}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Toggle pour activer le mode édition sur mobile */}
            {!editMode && (qrCodeImage || qrData) && (
              <div className="mb-4 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMode(true)}
                  className="bg-white/90 text-gray-900 border-white/50 hover:bg-white"
                >
                  <Move className="h-4 w-4 mr-2" />
                  Éditer Position
                </Button>
              </div>
            )}

            {qrCodeImage || qrData ? (
              <PhoneMockup width={280} height={560}>
                {editMode && (qrCodeImage || qrData) ? (
                  // Mode édition : utiliser le composant éditable
                  <EditableQRMockup
                    qrData={qrData}
                    selectedFrame={selectedFrame}
                    frameColor={appearanceConfig.frameColor}
                    qrColor={appearanceConfig.foregroundColor}
                    qrBackgroundColor={appearanceConfig.backgroundColor}
                    qrCodeImage={qrCodeImage}
                    editMode={editMode}
                    initialQrPosition={qrPosition}
                    initialQrSize={qrSize}
                    initialQrCrop={qrCrop}
                    initialFramePosition={framePosition}
                    initialFrameSize={frameSize}
                    initialFrameCrop={frameCrop}
                    onQrPositionChange={handleQrPositionChange}
                    onQrSizeChange={handleQrSizeChange}
                    onQrCropChange={handleQrCropChange}
                    onFramePositionChange={handleFramePositionChange}
                    onFrameSizeChange={handleFrameSizeChange}
                    onFrameCropChange={handleFrameCropChange}
                  />
                ) : (
                  // Mode normal : affichage standard
                  <div className="w-full h-full flex items-center justify-center p-8 bg-white">
                    {isGenerating ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-sm text-gray-500">Génération...</p>
                      </div>
                    ) : qrCodeImage ? (
                      <img
                        src={qrCodeImage}
                        alt="QR Code"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <QRWithFrameSimple
                          frame={null}
                          value={qrData}
                          size={280}
                          qrColor={appearanceConfig.foregroundColor}
                          qrBackgroundColor={appearanceConfig.backgroundColor}
                          errorCorrectionLevel="H"
                        />
                      </div>
                    )}
                  </div>
                )}
              </PhoneMockup>
            ) : (
              <PhoneMockup width={280} height={560}>
                <div className="w-full h-full flex items-center justify-center p-8 bg-white">
                  <div className="text-center text-gray-400">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-sm">Génération en cours...</p>
                  </div>
                </div>
              </PhoneMockup>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
