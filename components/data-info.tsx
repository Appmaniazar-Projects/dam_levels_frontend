"use client"

import { useResilientData } from "@/lib/resilient-data"
import { fetchDataInfo } from "@/lib/api"
import { fallbackDataInfo } from "@/lib/fallback-data"
import { FallbackWarning } from "@/components/fallback-warning"
import { Calendar, Database, TrendingUp } from "lucide-react"

export function DataInfo() {
  const { data: info, isLoading, isUsingFallback, retry } = useResilientData(
    fetchDataInfo,
    { 
      fallbackData: fallbackDataInfo,
      cacheKey: "data-info"
    }
  )

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Unknown"
      }
      return date.toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    } catch (error) {
      return "Unknown"
    }
  }

  if (isLoading || !info) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-muted rounded w-48 mb-2"></div>
        <div className="h-3 bg-muted rounded w-32"></div>
      </div>
    )
  }

  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Database className="size-4" />
        <span className="font-medium">Data Information</span>
        {isUsingFallback && (
          <FallbackWarning compact showRetry={false} />
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="size-3" />
            <span>Last Update</span>
          </div>
          <p className="font-medium text-foreground">
            {formatDate(info.latest_update)}
          </p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Database className="size-3" />
            <span>Total Dams</span>
          </div>
          <p className="font-medium text-foreground">
            {info.total_dams || "Unknown"}
          </p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="size-3" />
            <span>Update Frequency</span>
          </div>
          <p className="font-medium text-foreground">
            {info.update_frequency || "Unknown"}
          </p>
        </div>
        
        <div className="space-y-1">
          <div className="text-muted-foreground text-xs">
            Weekly Change
          </div>
          <p className="font-medium text-foreground text-xs">
            {info.weekly_calculation || "Unknown"}
          </p>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground border-t pt-2">
        <p><strong>Source:</strong> Department of Water and Sanitation</p>
        <p><strong>Note:</strong> Data typically updated Monday-Tuesday each week</p>
      </div>
    </div>
  )
}
