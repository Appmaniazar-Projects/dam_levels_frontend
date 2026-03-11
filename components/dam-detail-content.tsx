"use client"

import { useMemo, useCallback } from "react"
import { use } from "react"
import { useResilientData } from "@/lib/resilient-data"
import { fetchLatestDams, fetchDamHistory, fetchDamDetails } from "@/lib/api"
import { fallbackDams, generateFallbackHistory } from "@/lib/fallback-data"
import type { DamData, DamHistory } from "@/lib/types"
import { DamDetails } from "@/components/dam-details"
import { RiskBadge } from "@/components/risk-badge"
import { ChangeIndicator } from "@/components/change-indicator"
import { LevelGauge } from "@/components/level-gauge"
import { DamHistoryChart } from "@/components/dam-history-chart"
import { ErrorState } from "@/components/error-state"
import { DamDetailSkeleton } from "@/components/dam-detail-skeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

interface DamDetailContentProps {
  params: Promise<{ dam: string }>
}

export function DamDetailContent({ params }: DamDetailContentProps) {
  const { dam: damSlug } = use(params)
  const damName = decodeURIComponent(damSlug)

  const {
    data: allDams,
    error: damsError,
    isLoading: damsLoading,
    isUsingFallback: damsUsingFallback,
    retry: retryDams,
  } = useResilientData(fetchLatestDams, {
    fallbackData: fallbackDams,
    cacheKey: "dams-latest"
  })

  // Memoize fetchers to prevent recreation on every render
  const detailsFetcher = useCallback(() => fetchDamDetails(damName), [damName])
  const historyFetcher = useCallback(() => fetchDamHistory(damName), [damName])
  const fallbackHistory = useMemo(() => generateFallbackHistory(damName), [damName])

  const {
    data: damDetails,
    error: detailsError,
    isLoading: detailsLoading,
    isUsingFallback: detailsUsingFallback,
    retry: retryDetails,
  } = useResilientData(detailsFetcher, {
    cacheKey: `dam-details-${damName}`
  })

  const {
    data: history,
    error: historyError,
    isLoading: historyLoading,
    isUsingFallback: historyUsingFallback,
    retry: retryHistory,
  } = useResilientData(historyFetcher, {
    fallbackData: fallbackHistory,
    cacheKey: `dam-history-${damName}`
  })

  const dam: DamData | undefined = damDetails || allDams?.find(
    (d) => d.dam.toLowerCase() === damName.toLowerCase()
  )

  const hasError = damsError || detailsError || (!damsLoading && !dam)
  const isUsingFallback = damsUsingFallback || detailsUsingFallback || historyUsingFallback

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {/* Back link */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to all dams
          </Link>

          {/* Fallback Warning */}
          {isUsingFallback && dam && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="size-5 text-amber-600" />
                <div>
                  <h3 className="font-medium text-amber-900">Using Cached Data</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Unable to connect to the live API. Showing previously cached data.
                  </p>
                </div>
              </div>
            </div>
          )}

          {hasError ? (
            <ErrorState message={`Could not find data for "${damName}". The dam may not exist or the API may be unavailable.`} />
          ) : damsLoading ? (
            <DamDetailSkeleton />
          ) : dam ? (
            <div className="flex flex-col gap-6">
              {/* Enhanced Dam Details */}
              <DamDetails dam={dam} />

              {/* Historical Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <CardTitle className="text-base">Historical Levels</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {historyError ? (
                    <ErrorState message="Could not load historical data." />
                  ) : historyLoading ? (
                    <Skeleton className="h-72 w-full rounded-lg" />
                  ) : history ? (
                    <DamHistoryChart data={history} risk={dam.risk} />
                  ) : null}
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </main>
      <footer className="border-t border-border bg-card/50 py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-muted-foreground">
            Data sourced from the Department of Water and Sanitation. Updated weekly.
          </p>
        </div>
      </footer>
    </div>
  )
}

