"use client"

import { useQRTemplateStore, TemplateType } from "@/lib/stores/qr-template-store"
import { TEMPLATE_OPTIONS } from "./index"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

export function TemplateSelector() {
  const { selectedTemplate, setSelectedTemplate } = useQRTemplateStore()

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {TEMPLATE_OPTIONS.map((option) => (
        <Card
          key={option.value}
          className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
            selectedTemplate === option.value
              ? "ring-2 ring-primary shadow-lg"
              : "hover:border-primary/50"
          }`}
          onClick={() => setSelectedTemplate(option.value)}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center space-y-2 h-full">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-secondary text-white shadow-md">
              <span className="text-2xl">📱</span>
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm">{option.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {option.description}
              </p>
            </div>
            {selectedTemplate === option.value && (
              <Badge className="mt-2 bg-primary text-white">
                <Check className="h-3 w-3 mr-1" />
                Sélectionné
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}



