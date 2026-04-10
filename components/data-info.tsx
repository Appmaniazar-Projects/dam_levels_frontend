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
      
      {/* Province Status */}
      {info.province_status && (
        <div className="space-y-2 border-t pt-3">
          <div className="text-sm font-medium text-foreground">Province Status</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            {Object.entries(info.province_status).map(([province, status]) => (
              <div key={province} className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
                <div className="flex items-center gap-1">
                  {status.status === 'success' && <span className="text-green-500">🟢</span>}
                  {status.status === 'partial' && <span className="text-yellow-500">🟡</span>}
                  {status.status === 'failed' && <span className="text-red-500">🔴</span>}
                  {status.status === 'unknown' && <span className="text-gray-500">⚪</span>}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{province}</div>
                  <div className="text-muted-foreground">
                    {status.fresh_dams} fresh / {status.total_dams} total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Data Freshness */}
      {info.data_freshness && (
        <div className="space-y-2 border-t pt-3">
          <div className="text-sm font-medium text-foreground">Data Freshness</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="text-center p-2 rounded-md bg-green-50 dark:bg-green-900/20">
              <div className="text-green-600 dark:text-green-400 font-semibold">🟢 {info.data_freshness.fresh_dams}</div>
              <div className="text-muted-foreground">Fresh</div>
            </div>
            <div className="text-center p-2 rounded-md bg-yellow-50 dark:bg-yellow-900/20">
              <div className="text-yellow-600 dark:text-yellow-400 font-semibold">🟡 {info.data_freshness.stale_dams}</div>
              <div className="text-muted-foreground">Stale</div>
            </div>
            <div className="text-center p-2 rounded-md bg-red-50 dark:bg-red-900/20">
              <div className="text-red-600 dark:text-red-400 font-semibold">🔴 {info.data_freshness.old_dams}</div>
              <div className="text-muted-foreground">Old</div>
            </div>
            <div className="text-center p-2 rounded-md bg-gray-50 dark:bg-gray-900/20">
              <div className="text-gray-600 dark:text-gray-400 font-semibold">⚪ {info.data_freshness.historical_dams}</div>
              <div className="text-muted-foreground">Historical</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-xs text-muted-foreground border-t pt-2">
        <p><strong>Source:</strong> Department of Water and Sanitation</p>
        <p><strong>Note:</strong> Data typically updated Monday-Tuesday each week</p>
        <p><strong>Data Status:</strong> 🟢 Fresh (this week) 🟡 Stale (1-4 weeks) 🔴 Old (4+ weeks) ⚪ Historical</p>
      </div>
    </div>
  )
}
