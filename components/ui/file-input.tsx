"use client"

import * as React from "react"
import { Upload, X, File } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FileInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string
  description?: string
  onFileChange?: (file: File | null) => void
  preview?: string | null
  onRemove?: () => void
  accept?: string
  maxSize?: number // en Mo
  className?: string
}

export function FileInput({
  label,
  description,
  onFileChange,
  preview,
  onRemove,
  accept,
  maxSize = 5,
  className,
  ...props
}: FileInputProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [fileName, setFileName] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleFileSelect = (file: File) => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      alert(`Le fichier est trop volumineux (max ${maxSize}Mo)`)
      return
    }

    setFileName(file.name)
    if (onFileChange) {
      onFileChange(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFileName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (onFileChange) {
      onFileChange(null)
    }
    if (onRemove) {
      onRemove()
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
          {label}
        </label>
      )}
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-[2px] transition-all cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 dark:border-gray-600 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          {...props}
        />
        
        {preview ? (
          <div className="relative p-4">
            <div className="relative w-full h-40 rounded-[2px] overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 shadow-lg transition-all hover:scale-110 z-10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : fileName ? (
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-10 h-10 rounded-[2px] bg-primary/10 flex items-center justify-center">
                <File className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {fileName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Cliquez pour changer de fichier
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Glissez-déposez un fichier ici
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ou <span className="text-primary font-medium">cliquez pour parcourir</span>
                </p>
              </div>
              {accept && (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Formats acceptés: {accept}
                </p>
              )}
              {maxSize && (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Taille max: {maxSize}Mo
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



