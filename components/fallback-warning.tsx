"use client"

import { AlertTriangle } from "lucide-react"

interface FallbackWarningProps {
  onRetry?: () => void
  showRetry?: boolean
  compact?: boolean
}

export function FallbackWarning({ onRetry, showRetry = true, compact = false }: FallbackWarningProps) {
  return (
    <div className={`bg-amber-50 border border-amber-200 rounded-lg p-4 ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-center gap-3">
        <AlertTriangle className={`text-amber-600 ${compact ? 'size-4' : 'size-5'}`} />
        <div className="flex-1">
          <h3 className={`font-medium text-amber-900 ${compact ? 'text-sm' : 'text-base'}`}>
            Using Cached Data
          </h3>
          <p className={`text-amber-700 mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>
            Unable to connect to the live API. Showing previously cached data.
            {showRetry && onRetry && (
              <button 
                onClick={onRetry}
                className="ml-2 underline hover:no-underline font-medium"
              >
                Try Again
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
