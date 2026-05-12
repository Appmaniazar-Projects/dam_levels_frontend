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
import { Droplet } from "lucide-react"
import { CITY_SYSTEMS, CITY_CODES } from "@/lib/city-dams"
 
const RISK_ORDER: Record<RiskLevel, number> = {
  critical: 0,
  warning:  1,
  stable:   2,
}
 
export function DashboardContent() {
  const { data: dams, isLoading, error, isUsingFallback, retry } = useResilientData(
    fetchLatestDams,
    {
      fallbackData: fallbackDams,
      cacheKey: "dams-latest",
    }
  )
 
  const [search,   setSearch]   = useState("")
  const [province, setProvince] = useState("all")
  const [city,     setCity]     = useState("all")
  const [sortBy,   setSortBy]   = useState("risk")
 
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
        (d) => d.dam.toLowerCase().includes(q) || d.region.toLowerCase().includes(q)
      )
    }
 
    // Filter by province
    if (province !== "all") {
      result = result.filter((d) => d.region === province)
    }
 
    // Filter by city water supply system
    // When a city is selected we show only its specific dams,
    // regardless of the province filter (reset province when city is picked).
    if (city !== "all") {
      const cityDams = new Set(
        CITY_SYSTEMS[city as keyof typeof CITY_SYSTEMS]?.dams ?? []
      )
      result = result.filter((d) => cityDams.has(d.dam))
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
  }, [dams, search, province, city, sortBy])
 
  // Clear province when a city is selected (they overlap in confusing ways)
  function handleCityChange(value: string) {
    setCity(value)
    if (value !== "all") setProvince("all")
  }
 
  // Clear city when a province is selected
  function handleProvinceChange(value: string) {
    setProvince(value)
    if (value !== "all") setCity("all")
  }
 
  if (error && !dams) {
    return (
      <ErrorState
        message="We couldn't load dam level data. Please check your connection and try again."
        onRetry={retry}
      />
    )
  }
 
  const cityLabel =
    city !== "all" ? CITY_SYSTEMS[city as keyof typeof CITY_SYSTEMS]?.label : null
 
  return (
    <div className="flex flex-col gap-6">
      {isUsingFallback && dams && <FallbackWarning onRetry={retry} />}
 
      <DataInfo />
 
      {!isLoading && dams && <SummaryStats dams={dams} filtered={filtered} />}
 
      <DashboardFilters
        search={search}
        onSearchChange={setSearch}
        province={province}
        onProvinceChange={handleProvinceChange}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        provinces={provinces}
        city={city}
        onCityChange={handleCityChange}
      />
 
      {/* Count line */}
      {!isLoading && (
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "dam" : "dams"}
          {cityLabel && (
            <>
              {" "}supplying{" "}
              <span className="font-medium text-foreground">{cityLabel}</span>
            </>
          )}
          {!cityLabel && province !== "all" && (
            <>
              {" "}in{" "}
              <span className="font-medium text-foreground">{province}</span>
            </>
          )}
          {filtered.length > 0 && (
            <>
              {" "}with{" "}
              <span className="font-medium text-foreground">
                {(() => {
                  const total = filtered.reduce((sum, d) => sum + (d.level || 0), 0)
                  const avg = total / filtered.length
                  return avg.toFixed(1)
                })()}%
              </span>
              {" "}average level
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
            <Droplet className="size-6 text-muted-foreground" />
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
 
export default function CitiesPage() {
  return <DashboardContent />
}
