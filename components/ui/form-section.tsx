"use client"

import { ReactNode, useState } from "react"
import { LucideIcon, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FormSectionProps {
  icon: LucideIcon
  title: string
  description?: string
  children: ReactNode
  defaultExpanded?: boolean
  collapsible?: boolean
  className?: string
}

export function FormSection({
  icon: Icon,
  title,
  description,
  children,
  defaultExpanded = true,
  collapsible = true,
  className,
}: FormSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className={cn("bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm", className)}>
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            <Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </div>
        {collapsible && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
            />
          </Button>
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-6">
          {children}
        </div>
      )}
    </div>
  )
}



