"use client"

import { useMemo, useState } from "react"
import { useResilientData } from "@/lib/resilient-data"
import { fetchLatestDams } from "@/lib/api"
import { fallbackDams } from "@/lib/fallback-data"
import { FallbackWarning } from "@/components/fallback-warning"
import type { DamData, RiskLevel } from "@/lib/types"
import { DamCard } from "@/components/dam-card"
import { DamCardSkeleton } from "@/components/dam-card-skeleton"
import { DashboardFilters } from "@/components/dashboard-filters"
import { SummaryStats } from "@/components/summary-stats"
import { ErrorState } from "@/components/error-state"
import { DataInfo } from "@/components/data-info"
import { Droplets } from "lucide-react"

const RISK_ORDER: Record<RiskLevel, number> = {
  critical: 0,
  warning: 1,
  stable: 2,
}

export function DashboardContent() {
  const { data: dams, isLoading, error, isUsingFallback, retry } = useResilientData(
    fetchLatestDams,
    { 
      fallbackData: fallbackDams,
      cacheKey: "dams-latest"
    }
  )

  const [search, setSearch] = useState("")
  const [province, setProvince] = useState("all")
  const [sortBy, setSortBy] = useState("risk")

  const provinces = useMemo(() => {
    if (!dams) return []
    return [...new Set(dams.map((d) => d.region))].sort()
  }, [dams])

  const filtered = useMemo(() => {
    if (!dams) return []

    let result = [...dams]

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (d) =>
          d.dam.toLowerCase().includes(q) || d.region.toLowerCase().includes(q)
      )
    }

    // Filter by province
    if (province !== "all") {
      result = result.filter((d) => d.region === province)
    }

    // Sort
    switch (sortBy) {
      case "risk":
        result.sort((a, b) => RISK_ORDER[a.risk] - RISK_ORDER[b.risk])
        break
      case "level-asc":
        result.sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
        break
      case "level-desc":
        result.sort((a, b) => (b.level ?? 0) - (a.level ?? 0))
        break
      case "weekly-change":
        result.sort((a, b) => (a.weekly_change ?? 0) - (b.weekly_change ?? 0))
        break
      case "name":
        result.sort((a, b) => a.dam.localeCompare(b.dam))
        break
    }

    return result
  }, [dams, search, province, sortBy])

  // Show error only if no data at all
  if (error && !dams) {
    return (
      <ErrorState
        message="We couldn't load dam level data. Please check your connection and try again."
        onRetry={retry}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Fallback Warning */}
      {isUsingFallback && dams && (
        <FallbackWarning onRetry={retry} />
      )}

      {/* Data Information */}
      <DataInfo />

      {/* Summary */}
      {!isLoading && dams && <SummaryStats dams={dams} />}

      {/* Filters */}
      <DashboardFilters
        search={search}
        onSearchChange={setSearch}
        province={province}
        onProvinceChange={setProvince}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        provinces={provinces}
      />

      {/* Count */}
      {!isLoading && (
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "dam" : "dams"}
          {province !== "all" && (
            <>
              {" "}
              in <span className="font-medium text-foreground">{province}</span>
            </>
          )}
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <DamCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Droplets className="size-6 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-foreground">No dams found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dam: DamData) => (
            <DamCard key={`${dam.dam}-${dam.region}`} dam={dam} />
          ))}
        </div>
      )}
    </div>
  )
}
