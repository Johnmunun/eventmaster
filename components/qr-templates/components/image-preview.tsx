"use client"

interface ImagePreviewProps {
  src: string
  alt: string
  onRemove: () => void
  className?: string
}

export function ImagePreview({ src, alt, onRemove, className = "" }: ImagePreviewProps) {
  return (
    <div className={`mt-2 relative group ${className}`}>
      <div className="relative overflow-hidden rounded-xl shadow-lg border-2 border-gray-200">
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-40 object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 shadow-lg transition-all hover:scale-110"
        title="Supprimer l'image"
      >
        ×
      </button>
    </div>
  )
}


